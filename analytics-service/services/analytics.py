from services.queries import get_user_grading_scale, get_user_subject_grades
from services.normalization import normalize_grade

def calculate_subject_averages(user_id):
    grading_scale = get_user_grading_scale(user_id)
    grade_rows = get_user_subject_grades(user_id)

    if not grading_scale:
        return {"error": "No grading scale found for this user"}

    # Group rows by subject, since one subject has multiple assessment rows
    subjects = {}
    for row in grade_rows:
        subject_id = row["subject_id"]
        if subject_id not in subjects:
            subjects[subject_id] = {
                "subject_name": row["subject_name"],
                "weighted_total": 0,
                "total_weight": 0
            }

        percentage_score = (row["raw_score"] / row["max_score"]) * 100
        contribution = percentage_score * (row["weight_percent"] / 100)

        subjects[subject_id]["weighted_total"] += contribution
        subjects[subject_id]["total_weight"] += row["weight_percent"]

    # Now calculate final weighted average per subject, plus normalized score
    results = []
    for subject_id, data in subjects.items():
        weighted_average = data["weighted_total"]  # already weighted, out of 100
        
        results.append({
            "subject_id": subject_id,
            "subject_name": data["subject_name"],
            "weighted_average": round(weighted_average, 2),
            "total_weight_recorded": data["total_weight"]
        })

    return results

def calculate_needed_score(user_id, target_grade=75):
    grade_rows = get_user_subject_grades(user_id)

    subjects = {}
    for row in grade_rows:
        subject_id = row["subject_id"]
        if subject_id not in subjects:
            subjects[subject_id] = {
                "subject_name": row["subject_name"],
                "weighted_total": 0,
                "total_weight": 0
            }

        percentage_score = (row["raw_score"] / row["max_score"]) * 100
        contribution = percentage_score * (row["weight_percent"] / 100)

        subjects[subject_id]["weighted_total"] += contribution
        subjects[subject_id]["total_weight"] += row["weight_percent"]

    results = []
    for subject_id, data in subjects.items():
        current_weighted_score = data["weighted_total"]
        remaining_weight = 100 - data["total_weight"]

        if remaining_weight <= 0:
            results.append ({
                "subject_id": subject_id,
                "subject_name": data["subject_name"],
                "status": "complete",
                "final_weighted_score": round(current_weighted_score, 2)
            })
            continue
        needed_score = ((target_grade - current_weighted_score) / remaining_weight) * 100 
        is_at_risk = needed_score > 90

        results.append ({
            "subject_id": subject_id,
            "subject_name": data["subject_name"],
            "current_weighted_score": round(current_weighted_score, 2),
            "remaning_weight": remaining_weight,
            "needed_score_on_remaining": round(needed_score, 2),
            "at_risk": is_at_risk
        })
    return results