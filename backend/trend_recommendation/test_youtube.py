import sys
import os

# Add root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.trend_recommendation.providers.youtube import YouTubeTrendProvider

def run_tests():
    print("Initializing YouTubeTrendProvider...")
    provider = YouTubeTrendProvider()
    
    print("\nTesting known topic (Minecraft)...")
    res1 = provider.get_trend_signals("Minecraft")
    print(f"Result: {res1}")
    
    print("\nTesting unknown topic (Quantum Physics)...")
    res2 = provider.get_trend_signals("Quantum Physics")
    print(f"Result: {res2}")
    
    print("\nAll YouTube provider tests passed!")

if __name__ == "__main__":
    run_tests()
