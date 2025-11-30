@echo off
REM check-env.bat - Verifica pré-requisitos essenciais para build Android (Windows)

setlocal
cd /d "%~dp0"
echo ===== Verificando ambiente para build Android =====

echo Java:
java -version 2>nul
n=%ERRORLEVEL%
if %n% neq 0 (
  echo ERRO: comando 'java' nao encontrado. Verifique se o JDK esta instalado e JAVA_HOME configurado.
) else (
  echo OK: java encontrado.
)

necho JAVA_HOME=%JAVA_HOME%

necho Android SDK (ANDROID_SDK_ROOT): %ANDROID_SDK_ROOT%
echo Android SDK (ANDROID_HOME): %ANDROID_HOME%

necho Node:
node -v 2>nul
n=%ERRORLEVEL%
if %n% neq 0 (
  echo ERRO: node nao encontrado. Instale Node.js (16+ recomendado).
) else (
  node -v
)

necho NPM:
cmd /c "npm -v" 2>nul
n=%ERRORLEVEL%
if %n% neq 0 (
  echo ERRO: npm nao encontrado. Instale Node.js para obter npm.
) else (
  npm -v
)

necho Gradle wrapper presente?
if exist "android\gradlew.bat" (
  echo OK: android\gradlew.bat encontrado.
) else (
  echo AVISO: android\gradlew.bat nao encontrado. Verifique se a pasta android existe e foi adicionada ao repo.
)

necho ===== Verificacao concluida =====
endlocal
pause
