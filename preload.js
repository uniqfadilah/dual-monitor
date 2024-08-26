const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const configPath = path.join(__dirname, 'config.json');

// Load the saved URLs from the file
function loadUrls() {
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath);
    const urls = JSON.parse(data);
    document.getElementById('url1').value = urls.url1 || '';
    document.getElementById('url2').value = urls.url2 || '';
  }
}

// Save the URLs to a file
function saveUrls(url1, url2) {
  const urls = { url1, url2 };
  fs.writeFileSync(configPath, JSON.stringify(urls));
}

window.addEventListener('DOMContentLoaded', () => {
  loadUrls();

  document.getElementById('run-button').addEventListener('click', () => {
    const url1 = document.getElementById('url1').value;
    const url2 = document.getElementById('url2').value;
    saveUrls(url1, url2); // Save URLs before opening them
    ipcRenderer.send('open-urls', { url1, url2 });
  });
});
