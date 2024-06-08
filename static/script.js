function findWords() {
    var randomString = document.getElementById('randomString').value.toUpperCase();
    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (randomString.length <= 1 || !randomString.match(/^[A-Z]+$/)) {
        resultsContainer.innerHTML = '<p style="color: red;">Error: The string must have a size greater than 1 and contain only capital letters.</p>';
        return;
    }

    fetch('/find_words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ randomString: randomString }),
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResults(words) {
    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (words.length === 0) {
        resultsContainer.innerHTML = '<p>No words found.</p>';
    } else {
        var table = document.createElement('table');
        words.forEach(function(word) {
            var row = table.insertRow();
            var cell = row.insertCell();
            var button = document.createElement('button');
            button.textContent = word;
            button.onclick = function() {
                fetchMeaning(word);
            };
            cell.appendChild(button);
        });
        resultsContainer.appendChild(table);
    }
}

function fetchMeaning(word) {
    fetch('/get_meaning', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word }),
    })
    .then(response => response.json())
    .then(data => {
        showPopup(data.word, data.meaning);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showPopup(word, meaning) {
    var popup = document.getElementById('popup');
    document.getElementById('popup-word').textContent = word;
    document.getElementById('popup-meaning').textContent = meaning;
    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = "none";
}
