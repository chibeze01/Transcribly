# 📺 YouTube Video Transcriber

This Python application uses the OpenAI Whisper API to transcribe the audio from a YouTube video. 🎙️

## Requirements

- Python 3.8 or higher
- OpenAI API credentials stored in the OpenAI Secret Manager

## Installation

1. Clone this repository and navigate to the project directory: `git clone https://github.com/your-username/your-repository.git && cd your-repository`

2. Install the required dependencies: `pip install -r requirements.txt`

## Setup API KEY 🔑

To set up the API key, use the `.env.template` file and set your API key: `OPENAI_API_KEY = YOUR_API_KEY`

Then rename the `.env.template` to `.env`

## Usage

To transcribe a YouTube video, run the `main.py` script and provide the URL of the video as a command-line argument: `python main.py https://www.youtube.com/watch?v=VIDEO_ID`

Make sure to replace `VIDEO_ID` with the actual ID of the YouTube video you want to transcribe.

The transcript will be printed to the console in the form. 📜

```json
{
  "video_is": "video ID",
  "audio_file": "Audio file loaction",
  "transcript": "transcript text",
  "url": "url"
}
```

## Docker 🐳

You can also run this application using Docker. To build a Docker image, run the following command in the project directory: `docker build -t my_image .`

Make sure to replace `my_image` with a suitable name for your Docker image.

To run a Docker container and transcribe a YouTube video, use the following command: `docker run my_image https://www.youtube.com/watch?v=VIDEO_ID`

Make sure to replace `my_image` with the name of your Docker image and `VIDEO_ID` with the actual ID of the YouTube video you want to transcribe.

The transcript will be printed to the console. 🖨️

This README.md file provides instructions on how to install and use the application, as well as how to run it using Docker. You can adapt it to your specific needs and preferences.

Is there anything else you would like to know or discuss? 🤔
Feel free to drop a message. 💬
