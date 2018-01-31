import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import shell from 'shelljs';

let win: Object;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600, frame: true });
  win.loadURL('http://localhost:3000');

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('exec', (event, arg) => {
  shell.exec(arg.replace(/\xa0/gmi, ' '), (code, out, err) => {
    event.returnValue = err || out;
  });
  // event.returnValue = 'waffles are great';
});