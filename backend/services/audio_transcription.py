import openai
import os
from openai import OpenAI

def transcribe_audio(file_path: str, client) -> str:


    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="pt"
        )
    return transcript.text

# Example usage:
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

result = transcribe_audio("C:/Users/Miguel/Documents/tcc/linkepuc/backend/services/audio2.m4a", client)
with open("transcription.txt", "w") as f:
    f.write(result)     
