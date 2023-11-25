from moviepy.editor import *
import yt_dlp
import os
import openai
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_youtube_video(video_url):
    '''
    Extract audio from YouTube video

    Parameters:
    - video_url: The YouTube video URL

    Returns:
    - A dictionary containing the video ID, audio file path, transcript, and video URL
    '''

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
    audio_file = open(filename, "rb")
    transcript = openai.Audio.transcribe(
        "whisper-1", audio_file, prompt="")
    result = {"video_id": video_id, "audio_file": filename,
              "transcript": transcript['text'], "video_url": video_url}
    return result
