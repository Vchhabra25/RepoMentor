from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from model import (
    transcribe_audio,
    detect_emotion,
    get_recommendation
)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return {
        "message": "SoulNote AI Backend Running"
    }

@app.route("/analyze", methods=["POST"])
def analyze():

    if "audio" not in request.files:
        return jsonify({
            "error": "No audio file uploaded"
        }), 400

    audio_file = request.files["audio"]

    audio_path = os.path.join(
        UPLOAD_FOLDER,
        audio_file.filename
    )

    audio_file.save(audio_path)

    text = transcribe_audio(audio_path)

    emotion_result = detect_emotion(text)

    recommendation = get_recommendation(
        emotion_result["emotion"]
    )

    return jsonify({
        "transcript": text,
        "emotion": emotion_result["emotion"],
        "confidence": emotion_result["confidence"],
        "recommendation": recommendation
    })

if __name__ == "__main__":
    app.run(debug=True)