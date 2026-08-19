# Inno Setup — FINTRACK

1. Execute `npm run dist` na raiz do projeto.
2. Abra `desktop\FINTRACK.iss` no Inno Setup.
3. Clique em **Compile**.
4. O instalador será gerado em `installer\FINTRACK-Setup.exe`.

O script já utiliza automaticamente a pasta `dist\FINTRACK`, preserva toda a estrutura de runtime e cria atalhos no Menu Iniciar e, se escolhido durante a instalação, na Área de Trabalho.

O banco SQLite e os logs não ficam na pasta instalada. Eles são criados automaticamente em `%AppData%\FINTRACK`, onde permanecem após atualização, reinstalação ou desinstalação do aplicativo.

Para gerar uma nova versão, atualize `version` em `package.json`, ajuste `MyAppVersion` em `desktop\FINTRACK.iss` e execute novamente `npm run dist` antes de compilar o script.
