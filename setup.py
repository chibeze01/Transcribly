from setuptools import setup, find_packages

setup(
    name="YT-transcriber",
    version="0.1",
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
