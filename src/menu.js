const electron = require('electron');

const images = require('./images');
const {AppEventConstants} = require('./appEventConstants');
const {EffectTypesConstants} = require('./effectTypesConstants');
const {ValueConstants} = require('./valueConstants');

const {app} = electron;

function enabledCycleEffect(items) {
    const selectedIndex = items.findIndex(item => item.checked);
    const nextIndex = selectedIndex + 1 < items.length ? selectedIndex + 1 : ValueConstants.NON_EFFECT_MENU_OFFSET;
    items[nextIndex].checked = true;
}

module.exports = mainWindow => {
    const appName = app.getName();
    const template = [
        {
            label: appName,
            submenu: [
                {
                    label: 'About ' + appName,
                    role: 'about'
                },
                { type: 'separator' },
                {
                    label: 'Hide ' + appName,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Ctrl+Q',
                    click: _ => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Effects',
            submenu: [
                {
                    label: 'Cycle',
                    accelerator: 'Shift+CmdOrCtrl+E',
                    click: menuItem => {
                        enabledCycleEffect(menuItem.menu.items);
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CYCLE
                        );
                    }
                },
                { type: 'separator' },
                {
                    label: 'Vanilla',
                    type: 'radio',
                    click: _ => {
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CHOOSE
                        );
                    }
                },
                {
                    label: 'Ascii',
                    type: 'radio',
                    click: _ => {
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CHOOSE,
                            EffectTypesConstants.ASCII
                        );
                    }
                },
                {
                    label: 'Daltonize',
                    type: 'radio',
                    click: _ => {
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CHOOSE,
                            EffectTypesConstants.DALTONIZE
                        );
                    }
                },
                {
                    label: 'Hex',
                    type: 'radio',
                    click: _ => {
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CHOOSE,
                            EffectTypesConstants.HEX
                        );
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Photos Directory',
                    click: _ => {
                        images.openDir(images.getPicturesDir(app));
                    }
                }
            ]
        }
    ];

    return template;
};
