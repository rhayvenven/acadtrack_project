from fastapi import FastAPI
from config.db import get_connection
from services.normalization import normalize_grade

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

