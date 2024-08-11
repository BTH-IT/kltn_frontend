import path from 'path';
import { app, ipcMain } from 'electron';
import { createWindow } from './helpers';

require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

(async () => {
  if (isProd) {
    const { default: serve } = await import('electron-serve');
    serve({ directory: 'app' });
  } else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
  }

  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./');
  } else {
    const port = process.argv[2] || 8888;
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});
