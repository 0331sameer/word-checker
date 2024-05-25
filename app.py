from flask import Flask, render_template, request, jsonify
from itertools import permutations
import csv

app = Flask(__name__)

def load_dictionary(file_path):
    dictionary = {}
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            if len(row) >= 2:
                word = row[0].strip().upper()  # Convert word to uppercase to ensure case-insensitive matching
                definition = row[3].strip()
                dictionary[word] = definition
    return dictionary

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_words', methods=['POST'])
def find_words():
    random_string = request.json.get('randomString', '')
    if not random_string:
        return jsonify([])

    dictionary = load_dictionary('OPTED-Dictionary.csv')
    all_permutations = set([''.join(perm).upper() for i in range(2, len(random_string) + 1) for perm in permutations(random_string, i)])
    
    words = [{'word': word, 'meaning': dictionary.get(word, 'Not found')} for word in all_permutations if word in dictionary]
    return jsonify(words)

if __name__ == '__main__':
    app.run(debug=True)
