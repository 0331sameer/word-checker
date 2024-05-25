function findWords() {
    var randomString = document.getElementById('randomString').value.toUpperCase();
    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

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
        table.classList.add('flex-table');

        // Create table header
        var headerRow = table.insertRow();
        var wordHeader = headerRow.insertCell();
        var meaningHeader = headerRow.insertCell();
        wordHeader.textContent = 'Word';
        meaningHeader.textContent = 'Meaning';

        // Create table rows for each word
        words.forEach(function(wordObj) {
            var row = table.insertRow();
            var wordCell = row.insertCell();
            var meaningCell = row.insertCell();
            wordCell.textContent = wordObj.word;
            meaningCell.textContent = wordObj.meaning;
        });

        resultsContainer.appendChild(table);
    }
}
