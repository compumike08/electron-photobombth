const electron = require('electron');

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
        }
    ];

    return template;
};
