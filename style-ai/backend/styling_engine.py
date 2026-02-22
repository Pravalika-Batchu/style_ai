import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

STYLING_PROMPT = """
You are a professional personal fashion stylist. 
Based on the following user characteristics, generate 4 distinct outfit recommendations.

User Attributes:
- Skin Tone: {skin_tone}
- Season: {season}
- Undertone: {undertone}
- Occasion: {occasion}
- Style Aesthetic: {aesthetic}
- Extra Preferences: {preferences}

For each outfit, provide:
1. Outfit Name
2. Top (specific item, color, style)
3. Bottom (specific item, color, style)
4. Shoes
5. Accessories
6. Fabric Type
7. Color Palette (brief description)
8. Style Explanation (why this works for their features)
9. Shopping Search Terms (for Amazon/Zara/Myntra)

Return the response as a structured JSON object with EXACTLY these keys:
{{
  "Style DNA": "3-word tagline",
  "Top 3 Colors to wear": ["Color 1", "Color 2", "Color 3"],
  "1 Color to avoid": "Color",
  "outfit_recommendations": [
    {{
      "Outfit Name": "...",
      "Top": "...",
      "Bottom": "...",
      "Shoes": "...",
      "Accessories": "...",
      "Fabric Type": "...",
      "Color Palette": "...",
      "Style Explanation": "...",
      "Shopping Search Terms": "..."
    }}
  ],
  "Styling Tip": "..."
}}
"""

def generate_styling(user_data):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful fashion assistant that outputs JSON."},
                {"role": "user", "content": STYLING_PROMPT.format(**user_data)}
            ],
            response_format={"type": "json_object"},
            temperature=0.8,
            max_tokens=2000
        )
        return completion.choices[0].message.content
    except Exception as e:
        raise e

REFINE_PROMPT = """
# ... (same prompt)
"""

def refine_outfit(user_data):
    try:
        # ...
        return completion.choices[0].message.content
    except Exception as e:
        raise e
