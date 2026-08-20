# Instalador Windows — FINTRACK

O processo automático usa `electron-builder` e NSIS integrado; o Inno Setup não é necessário.

```bash
npm run build-installer
```

O instalador é gerado em `installer\FINTRACK-Setup.exe`.

O banco SQLite e os logs não ficam na pasta instalada. Eles são criados automaticamente em `%AppData%\FINTRACK`, onde permanecem após atualização, reinstalação ou desinstalação do aplicativo.

Para gerar uma nova versão, atualize `version` em `package.json` e execute novamente `npm run build-installer`.
