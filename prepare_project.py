import subprocess
import sys

# Install all the required dependencies
def install_dependencies():
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Download NLTK resources (like vader_lexicon)
def download_nltk_resources():
    import nltk
    nltk.download('vader_lexicon')

if __name__ == "__main__":
    install_dependencies()
    download_nltk_resources()
    print("All dependencies installed and NLTK resources downloaded successfully.")