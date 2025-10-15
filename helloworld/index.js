const express = require('express');
const fs = require('fs');
const path = require('path');

const server = express();
const port = 3000;


function updateHitcounter() {
  const filePath = path.join(__dirname, 'hits.txt');
  let hits = 0;

  // Read the hit count from file if it exists
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    hits = parseInt(data) || 0;
  }

  
  hits++;

 
  fs.writeFileSync(filePath, hits.toString());
  return hits;
}


server.get('/hits', (req, res) => {
  const hits = updateHitcounter();
  res.json({ hits });
});


function getRandomWord() {
  const filePath = path.join(__dirname, 'allwords.txt');

  if (!fs.existsSync(filePath)) {
    return { error: 'Word file not found' };
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const lines = data.split('\n').filter(line => line.trim() !== '');

  if (lines.length === 0) {
    return { error: 'No words found' };
  }

  const randomLine = lines[Math.floor(Math.random() * lines.length)];
  const [word, part, defn] = randomLine.split('\t'); 

  return {
    word: word || '',
    part: part || '',
    definition: defn || ''
  };
}


server.get('/word', (req, res) => {
  const wordInfo = getRandomWord();
  res.json(wordInfo);
});


server.listen(port, function() {
  console.log(`Listening at http://localhost:${port}`);
});
