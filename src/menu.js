const electron = require('electron');

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
                }
            ]
        }
    ];

    return template;
};
