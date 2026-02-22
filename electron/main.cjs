const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createMenu(mainWindow) {
  const template = [
    {
      label: 'App',
      submenu: [
        { role: 'quit', label: 'Afslut' }
      ]
    },
    {
      label: 'Vis',
      submenu: [
        {
          label: 'Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        { role: 'reload', label: 'Genindlæs' },
        { role: 'forceReload', label: 'Genindlæs (tvunget)' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Create custom menu
  createMenu(mainWindow);

  // Handle geolocation and clipboard permission requests
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation' || permission === 'clipboard-read' || permission === 'clipboard-write') {
      callback(true); // Allow geolocation and clipboard
    } else {
      callback(false);
    }
  });

  // Handle clipboard permissions for Electron
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'clipboard-read' || permission === 'clipboard-sanitized-write') {
      return true;
    }
    return false;
  });

  // Load the index.html directly from the file system
  const indexPath = path.join(__dirname, '..', 'index.html');
  await mainWindow.loadFile(indexPath);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});
