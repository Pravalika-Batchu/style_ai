import cv2
import numpy as np
from PIL import Image
import io

class ColorAnalyzer:
    def __init__(self):
        # Basic skin tone ranges in HSV
        self.skin_low = np.array([0, 20, 70], dtype=np.uint8)
        self.skin_high = np.array([20, 255, 255], dtype=np.uint8)

    def analyze(self, image_bytes):
        # Load image from bytes
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Invalid image"}

        # Convert to HSV for better skin detection
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, self.skin_low, self.skin_high)
        
        # Calculate mean color in BGR of the masked skin area
        skin_pixels = img[mask > 0]
        if len(skin_pixels) == 0:
            return {"error": "No skin detected"}

        avg_bgr = np.mean(skin_pixels, axis=0)
        avg_rgb = avg_bgr[::-1] # Convert BGR to RGB
        
        # Classification logic (Simplified for hackathon)
        skin_tone = self._classify_skin_tone(avg_rgb)
        undertone = self._detect_undertone(avg_rgb)
        season = self._mapping_seasonal_tone(skin_tone, undertone)
        
        return {
            "skin_tone": skin_tone,
            "undertone": undertone,
            "season": season,
            "avg_rgb": [int(x) for x in avg_rgb],
            "hex": '#%02x%02x%02x' % (int(avg_rgb[0]), int(avg_rgb[1]), int(avg_rgb[2]))
        }

    def _classify_skin_tone(self, rgb):
        luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]
        if luminance > 180: return "Fair"
        if luminance > 140: return "Medium"
        if luminance > 90: return "Olive"
        return "Deep"

    def _detect_undertone(self, rgb):
        # Warm: R > B, Cool: B > R (roughly)
        if rgb[0] > rgb[2] + 10: return "Warm"
        if rgb[2] > rgb[0] + 10: return "Cool"
        return "Neutral"

    def _mapping_seasonal_tone(self, tone, under):
        if under == "Warm":
            return "Spring" if tone in ["Fair", "Medium"] else "Autumn"
        elif under == "Cool":
            return "Summer" if tone in ["Fair", "Medium"] else "Winter"
        else: # Neutral
             return "Autumn" if tone in ["Deep", "Olive"] else "Spring"

analyzer = ColorAnalyzer()
