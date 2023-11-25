from transcriber.transcriber import transcribe_youtube_video as tyv
import argparse, os

def main():
    parser = argparse.ArgumentParser(description="Transcribe a YouTube video using the OpenAI Whisper API.")
    parser.add_argument("video_url", help="The URL of the YouTube video to transcribe.")
    args = parser.parse_args()
    response = tyv(args.video_url)
    print(response)   

    # save the transcript to a file in a directory called text if the directory doesn't exist, create it
    if not os.path.exists("text"):
        os.makedirs("text")
    with open(f"text/{response['video_id']}.txt", "w") as f:
        f.write(response['transcript'])
        
if __name__ == "__main__":
    main()
