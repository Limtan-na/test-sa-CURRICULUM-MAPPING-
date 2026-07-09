const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const BACKEND_DIR = path.join(__dirname, '..', 'backend');
const FLASK_PORT = 5000;
const APP_URL = `http://localhost:${FLASK_PORT}`;

let mainWindow = null;
let pythonServer = null;

function findPython() {
  const candidates = [
    'python',
    'python3',
    path.join('C:', 'Python312', 'python.exe'),
    path.join('C:', 'Program Files', 'Python312', 'python.exe'),
    path.join('C:', 'Users', process.env.USERNAME, 'AppData', 'Local', 'Programs', 'Python', 'Python312', 'python.exe'),
  ];
  return candidates.find(candidate => {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return true;
    } catch {
      try {
        fs.accessSync(candidate);
        return true;
      } catch {
        return false;
      }
    }
  });
}

function startFlaskServer() {
  const pythonBin = findPython();
  if (!pythonBin) {
    dialog.showErrorBox(
      'Python Not Found',
      'Could not find Python executable. Please make sure Python 3.12+ is installed.\n\n' +
      'Default search paths:\n' +
      '- C:\\Python312\\python.exe\n' +
      '- PATH environment variable'
    );
    app.quit();
    return;
  }

  pythonServer = spawn(pythonBin, [
    path.join(BACKEND_DIR, 'run.py'),
  ], {
    cwd: BACKEND_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  });

  pythonServer.stdout.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  pythonServer.stderr.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  pythonServer.on('error', (err) => {
    console.error('Failed to start Python server:', err);
    dialog.showErrorBox('Server Error', `Failed to start Python server:\n${err.message}`);
    app.quit();
  });

  pythonServer.on('close', (code) => {
    console.log(`Python server exited with code ${code}`);
  });
}

function waitForServer(url, retries = 60, interval = 1000) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      if (remaining <= 0) {
        reject(new Error('Server did not start in time'));
        return;
      }
      http.get(url, (res) => {
        resolve();
      }).on('error', () => {
        setTimeout(() => check(remaining - 1), interval);
      });
    };
    check(retries);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    title: 'CQI Monitoring System',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  startFlaskServer();

  try {
    await waitForServer(`http://localhost:${FLASK_PORT}/`);
    console.log('Flask server is ready');
  } catch (err) {
    console.error('Warning: Server may not be ready yet', err.message);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (pythonServer) {
    pythonServer.kill();
    pythonServer = null;
  }
});
