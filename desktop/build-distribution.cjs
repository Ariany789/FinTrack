const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const output = path.join(root, 'dist', 'FINTRACK')
const appDirectory = path.join(output, 'resources', 'app')
const electronDirectory = path.join(root, 'node_modules', 'electron', 'dist')
const backendExecutable = path.join(root, 'desktop', 'backend', 'FinTrackBackend.exe')
const frontendDirectory = path.join(root, 'frontend', 'dist')

for (const requiredPath of [electronDirectory, backendExecutable, frontendDirectory]) {
  if (!fs.existsSync(requiredPath)) throw new Error(`Arquivo de produção não encontrado: ${requiredPath}`)
}

fs.rmSync(output, { recursive: true, force: true })
fs.mkdirSync(appDirectory, { recursive: true })
fs.cpSync(electronDirectory, output, { recursive: true })
fs.renameSync(path.join(output, 'electron.exe'), path.join(output, 'FINTRACK.exe'))
fs.mkdirSync(path.join(appDirectory, 'desktop'), { recursive: true })
fs.cpSync(path.join(root, 'desktop', 'main.cjs'), path.join(appDirectory, 'desktop', 'main.cjs'), { recursive: true })
fs.cpSync(path.join(root, 'desktop', 'preload.cjs'), path.join(appDirectory, 'desktop', 'preload.cjs'), { recursive: true })
fs.cpSync(frontendDirectory, path.join(appDirectory, 'frontend', 'dist'), { recursive: true })
fs.mkdirSync(path.join(output, 'resources', 'backend'), { recursive: true })
fs.copyFileSync(backendExecutable, path.join(output, 'resources', 'backend', 'FinTrackBackend.exe'))
fs.writeFileSync(
  path.join(appDirectory, 'package.json'),
  JSON.stringify({ name: 'fintrack', version: '1.0.0', main: 'desktop/main.cjs' }, null, 2),
)
console.log(`Pasta de distribuição criada em ${output}`)
