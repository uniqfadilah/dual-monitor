const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

function createWindows(url1, url2) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const secondMonitor = screen.getAllDisplays().find(display => display.bounds.x !== 0 || display.bounds.y !== 0);

  // Create the first window on the primary monitor
  let mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(url1);

  // Create the second window on the second monitor
  if (secondMonitor) {
    let secondWindow = new BrowserWindow({
      width: secondMonitor.size.width,
      height: secondMonitor.size.height,
      x: secondMonitor.bounds.x,
      y: secondMonitor.bounds.y,
      fullscreen: true,
    });
    secondWindow.loadURL(url2);
  }
}

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('open-urls', (event, urls) => {
    createWindows(urls.url1, urls.url2);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});