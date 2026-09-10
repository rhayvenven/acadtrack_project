from fastapi import FastAPI
from config.db import get_connection
from services.normalization import normalize_grade
from services.queries import get_user_grading_scale, get_user_subject_grades
from services.analytics import calculate_subject_averages, calculate_needed_score, calculate_declining_trend
app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "AcadTrack Analytics Service is running"}


@app.get("/test-db")
def test_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 + 1 AS result")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return {"db_test_result": result[0]}

@app.get("/test-normalize")
def test_normalize():
    result = normalize_grade(raw_value=1.75, scale_type = "inverted", best_value = 1.00, worst_value = 5.00)
    return {"raw value" : 1.75, "normalized_score": result}

@app.get ("/user-scale/{user_id}")
def user_scale(user_id: int):
    scale = get_user_grading_scale(user_id)
    if not scale:
        return {"error": "User or Grading Scale not Found"}
    return scale


@app.get("/user-grades/{user_id}")
def user_grades(user_id: int):
    grades = get_user_subject_grades(user_id)
    return grades

@app.get("/subject-averages/{user_id}")
def subject_averages(user_id: int):
    return calculate_subject_averages(user_id)

@app.get("/needed-score/{user_id}")
def needed_score(user_id: int, target: float = 75):
    return calculate_needed_score(user_id, target)

@app.get("/declining-trend/{user_id}")
def declining_trend(user_id: int):
    return calculate_declining_trend(user_id)