#define MyAppName "FINTRACK"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "FinTrack"
#define MyAppExeName "FINTRACK.exe"

[Setup]
AppId={{B84D6D0D-0A20-458C-ADE5-78B4A4D8A1E7}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=..\installer
OutputBaseFilename=FINTRACK-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayName={#MyAppName}
DisableProgramGroupPage=yes
WizardStyle=modern

[Files]
Source: "..\dist\FINTRACK\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Criar atalho na área de trabalho"; GroupDescription: "Atalhos adicionais:"; Flags: unchecked

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Abrir FINTRACK"; Flags: nowait postinstall skipifsilent
