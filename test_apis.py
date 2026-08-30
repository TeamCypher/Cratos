import os
import asyncio
from dotenv import load_dotenv
from openai import AsyncOpenAI
import traceback

load_dotenv()

async def test_openrouter():
    try:
        print("Testing OpenRouter...")
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        response = await client.chat.completions.create(
            model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            messages=[{"role": "user", "content": "Hello!"}],
            max_tokens=10
        )
        print("OpenRouter SUCCESS! Response:", response.choices[0].message.content.strip())
        return True
    except Exception as e:
        print("OpenRouter FAILED:")
        traceback.print_exc()
        return False

async def main():
    success = await test_openrouter()
    if not success:
        print("\nSome APIs failed.")

if __name__ == "__main__":
    asyncio.run(main())
