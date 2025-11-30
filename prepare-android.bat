@echo off
REM Script para preparar o projeto MobiTec antes de abrir no Android Studio (Windows)
REM Uso: abra um cmd.exe como usuário, navegue para a pasta do projeto e rode este arquivo:
REM     C:\Users\mateu\Projeto\MobiTec\prepare-android.bat

setlocal
cd /d "%~dp0"
echo ===== Preparando o projeto MobiTec para Android Studio =====

echo 1) Checando java e variaveis de ambiente...
java -version
necho JAVA_HOME=%JAVA_HOME%
echo ANDROID_SDK_ROOT=%ANDROID_SDK_ROOT%
echo ANDROID_HOME=%ANDROID_HOME%

echo.
echo 2) Instalando dependencias Node (npm install)
npm install || (echo ERRO: npm install falhou & pause & exit /b 1)

echo.
echo 3) Gerando build web (Next.js export) → pasta "out"
npm run build || (echo ERRO: npm run build falhou & pause & exit /b 1)

echo.
echo 4) Sincronizando com Capacitor (copiando webDir para android)
npx cap sync android || (echo ERRO: npx cap sync android falhou & pause & exit /b 1)

echo.
echo 5) Pronto. Agora abra o Android Studio e importe o projeto Android na pasta:
echo    %CD%\android
echo
echo Sugestao: No Android Studio, escolha "Open" e selecione a pasta 'android'. Espere o Gradle sincronizar.
echo Em seguida: Build > Build Bundle(s) / APK(s) > Build APK(s) para gerar o APK debug ou Generate Signed Bundle/APK para release.
echo
echo APK debug gerado (apos build no Android Studio):
echo    %CD%\android\app\build\outputs\apk\debug\app-debug.apk
echo
echo Se quiser gerar o APK aqui via gradle wrapper automaticamente, rode:
echo cd android && gradlew.bat assembleDebug

echo ===== Pronto =====
pause
endlocal
