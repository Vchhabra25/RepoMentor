import os
import json
from groq import Groq

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)


def transcribe_audio(audio_path):
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            response_format="text"
        )

    return transcription


def detect_emotion(text):

    prompt = f"""
You are an emotion classifier.

Analyze the following text and return ONLY valid JSON.

Possible emotions:
- joy
- sadness
- anger
- fear
- surprise
- disgust
- neutral

Return ONLY this format:

{{
    "emotion": "joy",
    "confidence": 95
}}

Text:
{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    response = completion.choices[0].message.content.strip()

    # Remove markdown if Groq returns ```json ... ```
    if response.startswith("```"):
        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

    result = json.loads(response)

    return {
        "emotion": result["emotion"],
        "confidence": result["confidence"]
    }


def get_recommendation(emotion):

    recommendations = {
        "joy": "Keep doing activities that make you happy.",
        "sadness": "Consider talking to a trusted friend or taking a short walk.",
        "fear": "Try deep breathing and grounding exercises.",
        "anger": "Take a pause and allow yourself time to cool down.",
        "surprise": "Take a moment to process what happened.",
        "disgust": "Focus on what is within your control.",
        "neutral": "You seem emotionally balanced right now."
    }

    return recommendations.get(
        emotion.lower(),
        "Take care of your mental well-being."
    )