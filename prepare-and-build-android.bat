@echo off
REM prepare-and-build-android.bat - Prepara o projeto e gera APK debug (Windows)
REM Uso: abra cmd.exe, navegue para a pasta do projeto e rode este arquivo.

setlocal
ncd /d "%~dp0"
echo ===== Preparando e gerando APK (debug) para MobiTec =====
echo 1) Verificando ambiente basico
call check-env.bat
nif %ERRORLEVEL% NEQ 0 (
  echo ERRO: falha na verificacao de ambiente. Corrija e rode novamente.
  pause
  exit /b 1
)

necho.
echo 2) Instalando dependencias Node
npm install || (echo ERRO: npm install falhou & pause & exit /b 1)

necho.
echo 3) Gerando build web (Next.js export → pasta "out")
npm run build || (echo ERRO: npm run build falhou & pause & exit /b 1)

necho.
echo 4) Sincronizando com Capacitor para Android
npx cap sync android || (echo ERRO: npx cap sync android falhou & pause & exit /b 1)

necho.
echo 5) Executando Gradle wrapper para gerar APK debug
cd android
ngradlew.bat assembleDebug || (echo ERRO: gradle assembleDebug falhou & pause & exit /b 1)

necho.
echo APK gerado (caminho esperado):
echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk

necho ===== Concluido =====
pause
endlocal
