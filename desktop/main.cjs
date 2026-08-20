const { app, BrowserWindow, dialog } = require('electron')
const { createServer } = require('node:net')
const { spawn } = require('node:child_process')
const { request, createServer: createHttpServer } = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

let backendProcess
let frontendServer

app.setName('FINTRACK')

function logDesktopError(message) {
  fs.appendFileSync(path.join(app.getPath('userData'), 'desktop.log'), `${new Date().toISOString()} ${message}\n`)
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

function waitForBackend(port) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 30000
    const attempt = () => {
      const req = request(`http://127.0.0.1:${port}/api/v1/health`, response => {
        response.resume()
        response.statusCode === 200 ? resolve() : retry()
      })
      req.on('error', retry)
      req.setTimeout(1000, () => req.destroy())
      req.end()
    }
    const retry = () => Date.now() < deadline ? setTimeout(attempt, 250) : reject(new Error('A inicialização do FinTrack demorou mais que o esperado.'))
    attempt()
  })
}

function startFrontendServer(frontendDirectory) {
  return new Promise((resolve, reject) => {
    const rootDirectory = path.resolve(frontendDirectory)
    const contentTypes = {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
    }
    frontendServer = createHttpServer((request, response) => {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
      const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^[/\\]+/, '')
      const filePath = path.resolve(rootDirectory, relativePath)
      if (!filePath.startsWith(`${rootDirectory}${path.sep}`)) {
        response.writeHead(403).end()
        return
      }
      fs.readFile(filePath, (error, content) => {
        if (error) {
          response.writeHead(404).end()
          return
        }
        response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' })
        response.end(content)
      })
    })
    frontendServer.on('error', reject)
    frontendServer.listen(0, '127.0.0.1', () => {
      const { port } = frontendServer.address()
      resolve(`http://127.0.0.1:${port}/index.html`)
    })
  })
}

async function createWindow() {
  const port = await findAvailablePort()
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'FinTrackBackend.exe')
    : path.join(app.getAppPath(), 'desktop', 'backend', 'FinTrackBackend.exe')
  backendProcess = spawn(backendPath, ['--data-dir', app.getPath('userData'), '--port', String(port)], { windowsHide: true })
  backendProcess.on('error', error => dialog.showErrorBox('FinTrack', `Não foi possível iniciar o aplicativo.\n\n${error.message}`))
  await waitForBackend(port)

  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      additionalArguments: [`--api-url=http://127.0.0.1:${port}/api/v1`],
    },
  })
  window.once('ready-to-show', () => window.show())
  const frontendDirectory = app.isPackaged
    ? path.join(process.resourcesPath, 'frontend', 'dist')
    : path.join(app.getAppPath(), 'frontend', 'dist')
  window.webContents.on('did-fail-load', (_, code, description) => {
    logDesktopError(`Renderer load failed: ${description} (${code})`)
    dialog.showErrorBox('FinTrack', `Não foi possível abrir a interface.\n\n${description} (${code})`)
  })
  window.webContents.on('console-message', (_, level, message, line, sourceId) => {
    if (level >= 2) logDesktopError(`Renderer console: ${message} (${sourceId}:${line})`)
  })
  window.webContents.on('render-process-gone', (_, details) => logDesktopError(`Renderer process gone: ${details.reason}`))
  const frontendUrl = await startFrontendServer(frontendDirectory)
  logDesktopError(`Loading frontend from: ${frontendUrl}`)
  await window.loadURL(frontendUrl)
}

app.whenReady().then(createWindow).catch(error => dialog.showErrorBox('FinTrack', error.message))
app.on('window-all-closed', () => app.quit())
app.on('before-quit', () => {
  backendProcess?.kill()
  frontendServer?.close()
})
