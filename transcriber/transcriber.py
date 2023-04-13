from dotenv import load_dotenv
load_dotenv()

import openai
import os
openai.api_key = os.getenv("OPENAI_API_KEY") 

print("here: ", openai.api_key)

import yt_dlp

def transcribe_youtube_video(video_url):
    # Extract audio from YouTube video
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [],
        'outtmpl': './tmp/audio/' + '%(id)s.%(ext)s'
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=True)
        video_id = info_dict.get("id", None)
        filename = './tmp/audio/' + f"{video_id}.webm"
    
    # Transcribe audio using OpenAI Whisper API
    audio_file = open( filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    result = {"video_id": video_id, "audio_file": filename, "transcript": transcript['text'], "video_url": video_url}
    return result

