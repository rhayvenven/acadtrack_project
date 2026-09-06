from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AcadTrack Analytics Service is running"}