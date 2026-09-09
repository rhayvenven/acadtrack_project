from config.db import get_connection

def get_user_grading_scale(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary = True) #returns rows as dicts instead of tuples

    cursor.execute("""
        SELECT gs.scale_type, gs.best_value, gs.worst_value, gs.passing_value
        FROM users AS u
        JOIN grading_scales AS gs ON u.grading_scale_id = gs.id
        WHERE u.id = %s
    """, (user_id,))

    result = cursor.fetchone()
    cursor.close ()
    conn.close ()
    return result

def get_user_subject_grades(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT s.id AS subject_id, s.subject_name,
               at.type_name, at.weight_percent,
               g.raw_score, g.max_score
        FROM subjects AS s
        JOIN assessment_types AS at ON at.subject_id = s.id
        JOIN grades AS g ON g.assessment_type_id = at.id
        WHERE s.user_id = %s
    """, (user_id,))

    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results