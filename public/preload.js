const { contextBridge, ipcRenderer } = require('electron');


const bindableRendererEvents = ['startOpenFile', 'deleteTodoItem'];
const validBindableChannel = (channel) => bindableRendererEvents.includes(channel);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'rpc', {
        req: (channel, data) => {
            // whitelist channels
            let validChannels = ['fullScreen', 'showGlobalContextMenu', 'showTodoItemContextMenu'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        reqSync: (channel, data) => {
            // whitelist channels
            let validChannels = ['openFileDialogSync', 'saveFileDialogSync', 'readFile', 'saveFile'];
            if (validChannels.includes(channel)) {
                return ipcRenderer.sendSync(channel, data);
            }
        },

        bind: (channel, func) => {
            if (validBindableChannel(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (_event, ...args) => func(...args));
            }
        },
        unbindAll: (channel) => {
            if (validBindableChannel(channel)) {
                ipcRenderer.removeAllListeners(channel);
            }
        },
    }
);