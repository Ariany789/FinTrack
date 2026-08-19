# Distribuição para Inno Setup

## Gerar a pasta de distribuição

Em uma máquina de desenvolvimento com Python 3.12+ e Node.js instalado:

```bash
npm install
python -m pip install -r backend/requirements-build.txt
npm run dist
```

O resultado é `dist/FINTRACK/`. Essa pasta já contém o runtime do Electron, o backend Python empacotado e o frontend compilado.

## Entrada do Inno Setup

Use `dist/FINTRACK/` como origem dos arquivos. O atalho deve apontar para `FINTRACK.exe`.

```iss
Source: "dist\FINTRACK\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs
Name: "{autoprograms}\FINTRACK"; Filename: "{app}\FINTRACK.exe"
```

## Dados e diagnóstico

O aplicativo guarda o banco SQLite, logs e dados persistentes em `%AppData%\FINTRACK`. Não inclua essa pasta na desinstalação automática: ela preserva os dados financeiros do usuário entre atualizações e reinstalações.

## Alterar a versão

Atualize o campo `version` em `package.json` antes de executar `npm run dist`.
