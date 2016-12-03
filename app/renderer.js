const getTextStatistics = require('./lib/get-statistics');

const content = document.getElementById('content');
const lineCount = document.getElementById('line-count');
const wordCount = document.getElementById('word-count');
const readingTime = document.getElementById('reading-time');
const openFile = document.getElementById('open-file');
const saveFile = document.getElementById('save-file');
const copyToClipboard = document.getElementById('copy-to-clipboard');

const renderStatistics = () => {
  const { lines, words, text } = getTextStatistics(content.value);
  wordCount.textContent = words;
  lineCount.textContent = lines;
  readingTime.textContent = text;
};

content.addEventListener('keyup', renderStatistics);
