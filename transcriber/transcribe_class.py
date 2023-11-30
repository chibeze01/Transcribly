import time
import os
import asyncio
import yt_dlp
from moviepy.editor import VideoFileClip
import openai
from pydub import AudioSegment
from pydub.silence import *
import re
from dotenv import load_dotenv
load_dotenv()


class Transcriber:
    '''
    A class to transcribe audio files

    Attributes:
    - interval: The interval in minutes to split the audio into chunks
    - prompt: The prompt to use for the OpenAI API

    Methods:
    - extract_audio_from_video_url: Extract audio from a YouTube video URL
    - extract_audio_from_video_file: Extract audio from a local video file
    '''

    def __init__(self, interval=3, prompt=None):
        self.ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [],
            'outtmpl': './tmp/audio/' + '%(id)s.webm'
        }
        self.interval = interval
        self.prompt = prompt
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.target_language = None

    def extract_audio_from_video_url(self, video_url):
        with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            filename = './tmp/audio/' + \
                "{}.webm".format(info_dict.get("id", None))
        return filename

    def extract_audio_from_video_file(self, video_filepath, output_audio_filepath=None):
        """
        Extracts audio from a local video file.

        Parameters:
        - video_filepath: Path to the local video file.
        - output_audio_filepath: Path to save the extracted audio. If None, it will save with the same name as the video but with an .mp3 extension.

        Returns:
        - Path to the extracted audio file.
        """
        if not output_audio_filepath:
            output_audio_filepath = video_filepath.rsplit('.', 1)[0] + '.mp3'

        video = VideoFileClip(video_filepath)
        video.audio.write_audiofile(output_audio_filepath)
        print(f'Audio extracted successfully!:{output_audio_filepath}')

        return output_audio_filepath

    async def transcribe_chunk(self, chunk_folder, chunk, prompt):
        audio_chunk_path = f"{chunk_folder}/{chunk}"
        with open(audio_chunk_path, "rb") as audio_file:
            if self.target_language != None:
                return await openai.Audio.atranslate(
                    "whisper-1", audio_file, prompt=self.prompt, response_format="text") + " "
            else:
                return await openai.Audio.atranscribe(
                    "whisper-1", audio_file, prompt=self.prompt, response_format="text") + " "

    async def transcribe_audio(self, filename):
        '''
        Transcribe the audio file(s)

        Parameters:
        - filename: Path to the audio file

        Returns:
        - A dictionary containing the audio file path and the transcript
        '''
        # split the audio into smaller chunks
        start_chunk_timmer = time.time()
        print("Chunking audio...")
        chunk_folder = self.split_audio(filename)
        print("Time taken to cunk:", time.time() - start_chunk_timmer)
        # transcribe each chunk
        transcript = ""

        start_timmer = time.time()

        print("Transcribing audio...")

        tasks = []

        # TODO: find a method to parallelize this may be using async or multiprocessing
        for chunk in os.listdir(chunk_folder):
            task = self.transcribe_chunk(chunk_folder, chunk, self.prompt)
            tasks.append(task)

        # Run the tasks concurrently
        results = await asyncio.gather(*tasks)

        # Concatenate the results to form the full transcript
        transcript = "".join(results)

        for i, chunk in enumerate(os.listdir(chunk_folder)):
            audio_chunk_path = f"{chunk_folder}/{chunk}"
            with open(audio_chunk_path, "rb") as audio_file:
                transcript += openai.Audio.transcribe(
                    "whisper-1", audio_file, prompt=self.prompt, response_format="text") + " "
        result = {
            "audio_file": filename,
            "transcript": transcript,
        }
        print("[100%] Done!!")
        print("Time taken to transcribe:", time.time() - start_timmer)
        return result

    def split_audio(self, filename):
        '''
        Split the audio into smaller chunks

        Parameters:
        - filename: Path to the audio file

        Returns:
        - Path to the folder containing the audio chunks
        '''
        duration = self.interval * 60 * 1000

        audio = AudioSegment.from_file(filename)

        start = 0
        end = 0

        length_audio = len(audio)

        chunks = []
        while start < length_audio:
            end += duration

            if end > length_audio:
                end = length_audio

            silence = detect_silence(
                audio[end: end + 2 * 60 * 1000], min_silence_len=100, silence_thresh=-40)

            if len(silence) > 0:
                min_dBFS = min(enumerate(silence),
                               key=lambda x: audio[end+x[1][0]].dBFS)
                end = end + min_dBFS[1][0]

            chunk = audio[start:end]
            chunks.append(chunk)

            start = end
        print(filename)
        chunk_folder = "../tmp/audio/chunks/{}".format(
            re.search(r'/([^/]+)\.\w+$', filename).group(1) if '/' in filename else filename.split('.')[0])
        os.makedirs(chunk_folder, exist_ok=True)

        for i, audio in enumerate(chunks):
            audio_chunk_path = f"{chunk_folder}/chunk{i}.mp3"
            audio.export(audio_chunk_path, format="mp3")

        return chunk_folder

    def joinTextChunks(self, chunk_folder):
        '''
        Join the text chunks into a single text file

        Parameters:
        - chunk_folder: Path to the folder containing the text chunks

        Returns:
        - A string containing the text from all the chunks
        '''
        text = "".join([open(f).read()
                       for f in os.listdir(chunk_folder) if f.endswith('.txt')])
        return text

    def to_file(self, result):
        '''
        Save the transcript to a text file

        Parameters:
        - result: The result from the transcribe_audio method
        - filename: The name of the file to save the transcript to
        '''
        with open('../text/{}.txt'.format(re.search(r'/([^/]+)\.\w+$', result["audio_file"]).group(1) if '/' in result["audio_file"] else result["audio_file"].split('.')[0]), "w") as file:
            file.write(result["transcript"])

    async def transcribe_youtube_video(self, video_url):
        '''
        Transcribes a YouTube video

        Parameters:
        - video_url: The URL of the YouTube video

        Returns:
        - The name of the file containing the transcript
        '''
        filename = self.extract_audio_from_video_url(video_url)

        return await self.transcribe_audio(filename)

    async def transcribe_video(self, filename):
        '''
        Transcribes a local video file

        Parameters:
        - filename: The path to the local video file

        Returns:
        - The name of the file containing the transcript
        '''
        filename = self.extract_audio_from_video_file(filename)

        return await self.transcribe_audio(filename)

    '''
    TODO: add Translate method
    TODO: add Formatter method
    TODO: add Summarize method
    '''

    def translate_audio(self, filename, target_language):
        '''
        Translates text to the specified language

        Parameters:
        - text: The text to translate
        - target_language: The language to translate to

        Returns:
        - The translated text
        '''
        return 0

# TODO Scraper Class to handle the scraping logic

# TODO: Bot Class to handle the bot logic
