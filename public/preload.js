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

        bind: (channel, func) => {
            let validChannels = ['startOpenFile'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        unbindAll: (channel, func) => {
            let validChannels = ['startOpenFile'];
            if (validChannels.includes(channel)) {
                ipcRenderer.removeAllListeners(channel);
            }
        },
    }
);