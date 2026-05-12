from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_log

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    log_text = content.decode("utf-8")

    results = analyze_log(log_text)

    return {
        "results": results
    }
