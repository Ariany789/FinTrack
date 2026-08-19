const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('fintrack', { apiBaseUrl: process.argv.find(argument => argument.startsWith('--api-url='))?.slice(10) })
