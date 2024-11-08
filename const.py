from datetime import datetime
from openai import OpenAI
import os
import random
import requests

openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY', ''))

def get_time_of_day(hour):
    if 6 <= hour < 12:
        return "დილა"
    elif 12 <= hour < 18:
        return "შუადღე"
    elif 18 <= hour < 24:
        return "საღამო"
    else:  # 0-6
        return "შუაღამე"

def get_tbilisi_time():
    try:
        response = requests.get('http://worldtimeapi.org/api/timezone/Asia/Tbilisi')
        if response.status_code == 200:
            data = response.json()
            dt = datetime.fromisoformat(data['datetime'].replace('Z', '+00:00'))
            hour = dt.hour
            time_str = dt.strftime("%H:%M")
            return time_str, hour
    except Exception as e:
        print(f"Error getting Tbilisi time: {e}")
        dt = datetime.now()
        return dt.strftime("%H:%M"), dt.hour

def get_random_image():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    image_dir = os.path.join(current_dir, 'static', 'images')

    try:
        images = [f for f in os.listdir(image_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if not images:
            print("No images found in directory:", image_dir)
            return None
        return random.choice(images)
    except Exception as e:
        print(f"Error accessing images directory {image_dir}: {e}")
        return None

def get_love_quote():
    try:
        if not os.getenv('OPENAI_API_KEY'):
            return "ნიალო ფული გათავდააა! ❤️"

        time_str, hour = get_tbilisi_time()
        time_of_day = get_time_of_day(hour)

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system",
                 "content": f"""ახლა არის {time_str} საათი, {time_of_day}. თქვენ ხართ, "
                           კომპლიმენტების და მოტივაციური წერილების დაწერის ნამდვილი ოსტატი. თქვენი მიზანია, ახალგაზრდა გოგონა ნია 
                           ქუსიკაშვილისთვის კრეატიული და გულთბილი კომპლიმენტები და სამოტივაციო წერილები მოიფიქროთ, რომელიც მის 
                           ხასიათს და უნიკალურ სილამაზეს უსვამს ხაზს. ნია არის ქერათმიანი, 
                           ლურჯთვალება და ძალიან ლამაზი გოგონა, რომელიც სწავლობს სამედიცინოზე და აქვს ძალიან რთული გრაფიკი ის ძალიან ბევრს შრომობს და მიისწრაფვის წარმატებისკენ."""},
                {"role": "user",
                 "content": f""" გაითვალისწინე, ახლა არის {time_of_day}, {time_str} საათი. მკაცრად დაიცავი ქართული გრამატიკა, შექმენი ლამაზი კომპლიმენტი
                            და სამოტივაციო წერილი შემდეგი პრინციპით: პირველ რიგში - თუ დილაა (06-12), უსურვე ბედნიერი დღე; 
                           თუ შუადღეა (12-18), ჰკითხე როგორ მიდის დღე; თუ საღამოა (18-24), ჰკითხე 
                           როგორ ჩაიარა დღემ; თუ შუაღამეა (00-06), უსურვე ტკბილი ძილი. შემდეგ შექმენი ლამაზი კომპლიმენტი და სამოტივაციო წერილი მოკლედ და ლამაზი სიტყვებით. მაქსიმუმ სამი წინადადება ლამაზად და ლაკონურად"""}
            ],
            temperature=0.9,
            max_tokens=500)
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error getting quote: {e}")
        return f"Ooopს რაღაც ერორია {e} ❤️"