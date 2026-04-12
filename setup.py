from setuptools import setup, find_packages

setup(
    name="YT-transcriber",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "openai",
        "yt-dlp",
        "python-dotenv"
    ],
    entry_points={
        "console_scripts": [
            "transcribe = main:main"
        ]
    }
)
