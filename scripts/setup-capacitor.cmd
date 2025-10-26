@echo off
rem Script de conveniência para iniciar o fluxo Capacitor no Windows (cmd.exe)
rem 1) Gera a pasta out/ (export estático) — só funciona se o projeto for exportável
rem 2) Inicializa Capacitor, adiciona Android, copia os assets e abre no Android Studio

echo 1/4 - Tentando gerar saída estática (next build && next export -> out/)
npm run mobile:export

echo 2/4 - Inicializando Capacitor (se já existir, este passo pode falhar e pode ser ignorado)
npx @capacitor/cli@5.6.5 init MobiTec com.lira.mobitec --webDir=out

echo 3/4 - Adicionando plataforma Android
npx cap add android

echo 4/4 - Copiando assets web e abrindo Android Studio
npx cap copy
npx cap open android

echo Pronto. Se algum passo falhar, leia docs/Capacitor-Android.md para opções e solução de problemas.
pause
