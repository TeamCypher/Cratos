import sys
import json
import requests
import os

try:
    from reka.client import Reka
    print("reka.client.Reka is available")
except ImportError:
    print("reka package not found or does not have Reka")

try:
    import reka
    print("reka package available, attrs:", dir(reka))
except ImportError:
    pass
