const electron = require('electron');

const {AppEventConstants} = require('./appEventConstants');
const {EffectTypesConstants} = require('./effectTypesConstants');
const {app} = electron;

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
                    label: 'Vanilla',
                    click: _ => {
                        mainWindow.webContents.send(
                            AppEventConstants.EFFECT_CHOOSE
                        );
                    }
                },
                {
                    label: 'Ascii',
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
