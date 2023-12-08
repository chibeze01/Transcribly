from transcriber.transcribe_class import Transcriber as tc
from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio

app = Flask(__name__)
CORS(app, origins = "http://localhost:3000")

def set_event_loop_policy():
    policy = asyncio.get_event_loop_policy()
    if not isinstance(policy, asyncio.DefaultEventLoopPolicy):
        policy = asyncio.DefaultEventLoopPolicy()
        asyncio.set_event_loop_policy(policy)

@app.route('/')
def index():
    return 'Hello World!', 200

@app.route('/transcribe-media', methods=['POST'])
async def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the file
        file.save(file.filename)

        # load the Transcriber class
        transcriber = tc()
        # check the file type
        if file.filename.endswith('.mp4'):
            # Transcribe the video
            result = await transcriber.transcribe_video(file.filename)
        elif file.filename.endswith('.wav') or file.filename.endswith('.mp3'):
            # Transcribe the audio
            result = await transcriber.transcribe_audio(file.filename)
        else:
            return jsonify({'error': 'Invalid file type'}), 400

        # Return the transcription
        return jsonify({'transcription': result['transcript']}), 200

    return jsonify({'error': 'Something went wrong'}), 500

@app.route('/transcribe-link', methods=['POST'])
async def transcribe_link():
    if 'link' not in request.form:
        return jsonify({'error': 'No link provided'}), 400

    link = request.form['link']

    if link == '':
        return jsonify({'error': 'No link provided'}), 400

    # load the Transcriber class
    transcriber = tc()

    # check the link type
    if 'youtube.com' in link:
        # Transcribe the YouTube video
        result = await transcriber.transcribe_youtube_video(link)
    # elif 'drive.google.com' in link:
    #     # Transcribe the Google Drive video
    #     result = await transcriber.transcribe_google_drive_video(link)
    else:
        return jsonify({'error': 'Invalid link'}), 400

    # Return the transcription
    return jsonify({'transcription': result['transcript']}), 200

if __name__ == '__main__':
    set_event_loop_policy()
    app.run(debug=True)