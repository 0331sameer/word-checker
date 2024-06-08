from flask import Flask, render_template, request, jsonify
from itertools import permutations
import requests

app = Flask(__name__)

# Load words from file once on startup
with open('words.txt', 'r') as file:
    words = {line.strip().upper() for line in file}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_words', methods=['POST'])
def find_words():
    random_string = request.json.get('randomString', '')
    if not random_string:
        return jsonify([])

    all_permutations = set(
        [''.join(perm).upper() for i in range(2, len(random_string) + 1) for perm in permutations(random_string, i)]
    )
    found_words = [word for word in all_permutations if word in words]
    return jsonify(found_words)

@app.route('/get_meaning', methods=['POST'])
def get_meaning():
    word = request.json.get('word', '').upper()
    api_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{word}"

    response = requests.get(api_url)
    if response.status_code == 200:
        meaning_data = response.json()
        meaning = meaning_data.get('extract', 'No definition found')
    else:
        meaning = 'No definition found'

    return jsonify({'word': word, 'meaning': meaning})

if __name__ == '__main__':
    app.run(debug=True)
