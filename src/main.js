const electron = require('electron');

const images = require('./images');
const menuTemplate = require('./menu');
const {AppEventConstants} = require('./appEventConstants');

const {app, BrowserWindow, ipcMain: ipc, Menu} = electron;

let mainWindow = null;

app.on(AppEventConstants.READY, _ => {
    mainWindow = new BrowserWindow({
        width: 893,
        height: 725,
        resizable: false
    });

    mainWindow.loadURL(`file://${__dirname}/capture.html`);

    images.mkdir(images.getPicturesDir(app));

    mainWindow.on(AppEventConstants.CLOSED, _ => {
        // Null out mainWindow variable when window is closed for proper garbage collection
        mainWindow = null;
    });

    const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow));
    Menu.setApplicationMenu(menuContents);
});

ipc.on(AppEventConstants.IMAGE_CAPTURED, (evt, contents) => {
    images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
        images.cache(imgPath);
    });
});

ipc.on(AppEventConstants.IMAGE_REMOVE, (evt, index) => {
    images.rm(index, _ => {
        evt.sender.send(AppEventConstants.IMAGE_REMOVED, index);
    });
});
