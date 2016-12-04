const fs = require('fs');
const path = require('path');
const { remote, shell, clipboard } = require('electron');
const currentWindow = remote.getCurrentWindow();

let currentFile = null;
let originalContent = '';

const getTextStatistics = require('./lib/generate-statistics');

const content = document.getElementById('content');
const lineCount = document.getElementById('line-count');
const wordCount = document.getElementById('word-count');
const readingTime = document.getElementById('reading-time');
const openFile = document.getElementById('open-file');
const saveFile = document.getElementById('save-file');
const copyToClipboard = document.getElementById('copy-to-clipboard');

const updateUserInterface = (content) => {
  const { lines, words, text } = getTextStatistics(content);
  wordCount.textContent = words;
  lineCount.textContent = lines;
  readingTime.textContent = text;

  currentWindow.setDocumentEdited(content !== originalContent);
};

const updateCurrentFile = (file, text) => {
  currentFile = file;
  content.value = text;
  originalContent = text;

  remote.app.addRecentDocument(file);

  currentWindow.setTitle(file);
  currentWindow.setRepresentedFilename(file);

  updateUserInterface(text);
};

content.addEventListener('keyup', () => {
  updateUserInterface(content.value);
});

openFile.addEventListener('click', () => {
  const files = remote.dialog.showOpenDialog(currentWindow, {
    title: 'Open File',
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown', extensions: ['markdown', 'md'] }
    ]
  });

  if (!files) { return; }

  const file = files[0];
  const text = fs.readFileSync(file).toString();

  updateCurrentFile(file, text);
});

saveFile.addEventListener('click', () => {
  const file = currentFile || remote.dialog.showSaveDialog(currentWindow, {
    title: 'Save File',
    defaultPath: remote.app.getPath('documents'),
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown', extensions: ['markdown', 'md'] }
    ]
  });

  if (!file) { return; }

  fs.writeFileSync(file, content.value);
  updateCurrentFile(file, content.value);
  shell.showItemInFolder(file);
});

copyToClipboard.addEventListener('click', () => {
  clipboard.writeText(content.value);
});
