import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import { spawn } from 'child_process';
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

ipcMain.on('cd', (event, arg) => {
  // const shellInstance = shell.cd(arg);
});

ipcMain.on('exec', (event, arg) => {
  console.log('====> ', arg.command);
  const thingsToExec = arg.command.split(/\xa0/);
  const shellInstance = spawn(thingsToExec[0], thingsToExec.slice(1));
  shellInstance.stdout.on('data', data => {
    console.log('----->', data);
    event.sender.send('output', data);
  });
});