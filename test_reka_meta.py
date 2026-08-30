import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(__file__))

load_dotenv()

from backend.video_ai.profile_builder import generate_metadata_with_reka

def test_metadata():
    print("Testing generate_metadata_with_reka...")
    result = generate_metadata_with_reka(
        transcript="This video is about cooking a delicious pasta.",
        ocr_text=["PASTA", "RECIPE"],
        keywords=["cooking", "pasta", "recipe", "food"]
    )
    print("Metadata Result:")
    print(result)

if __name__ == "__main__":
    test_metadata()
