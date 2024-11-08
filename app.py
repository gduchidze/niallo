from os import environ

from flask import Flask, render_template, jsonify, url_for
from const import get_random_image, get_love_quote

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_content')
def get_content():
    image = get_random_image()
    quote = get_love_quote()
    return jsonify({
        'image': image,
        'quote': quote
    })

if __name__ == '__main__':
    port = int(environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)