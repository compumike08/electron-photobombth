const electron = require('electron');

const {app, BrowserWindow, ipcMain: ipc} = electron;
const images = require('./images');
const {AppEventConstants} = require('./eventConstants');

let mainWindow = null;

app.on(AppEventConstants.READY, _ => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 725,
        resizable: false
    });

    mainWindow.loadURL(`file://${__dirname}/capture.html`);

    // Automatically open dev tools for easier debugging
    mainWindow.webContents.openDevTools();

    images.mkdir(images.getPicturesDir(app));

    mainWindow.on(AppEventConstants.CLOSED, _ => {
        // Null out mainWindow variable when window is closed for proper garbage collection
        mainWindow = null;
    });
});

ipc.on(AppEventConstants.IMAGE_CAPTURED, (evt, contents) => {
    images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
        images.cache(imgPath);
    });
});
