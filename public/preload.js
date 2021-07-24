const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'rpc', {
        req: (channel, data) => {
            // whitelist channels
            let validChannels = ['fullScreen'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        reqSync: (channel, data) => {
            // whitelist channels
            let validChannels = ['openFileDialogSync', 'saveFile', 'readFile'];
            if (validChannels.includes(channel)) {
                return ipcRenderer.sendSync(channel, data);
            }
        },

        // currently not used, draft for if needed:
        // response: (channel, func) => {
        //     let validChannels = ['fromMain'];
        //     if (validChannels.includes(channel)) {
        //         // Deliberately strip event as it includes `sender` 
        //         ipcRenderer.on(channel, (event, ...args) => func(...args));
        //     }
        // }
    }
);