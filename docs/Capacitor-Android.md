# Capacitor + Android — instruções para MobiTec

## Resumo rápido

Este documento descreve como empacotar o app Next.js no Android usando Capacitor. O repositório atual usa Next.js com "server actions" (`'use server'`), então uma exportação 100% estática geralmente NÃO funcionará sem refatoração. Por isso há três caminhos possíveis — eu descrevo cada um e os passos necessários no Windows (cmd.exe).

## Opções disponíveis

1. Capacitor + site hospedado (recomendado quando o site já está em produção)

   - Capacitor carrega uma URL remota (sua versão hospedada). Fácil, suporta todas as features do Next (SSR, server actions).
   - Offline limitado, pois depende do servidor.

2. Capacitor + servidor local (bom para desenvolvimento)

   - O app Android carrega `http://10.0.2.2:3000` (emulador Android usa esse IP para se conectar ao host), enquanto você executa `next dev` ou `next start` localmente.
   - Requer que o servidor esteja rodando durante o uso do app. Útil para testar sem hospedar.

3. Capacitor + arquivos estáticos (apenas se `next export` funcionar)
   - Se o projeto não usar recursos de servidor, você pode executar `next export` para gerar `out/` e empacotar esses arquivos. No projeto atual provavelmente falhará por causa de server actions.

## O que eu adicionei ao repositório

- Scripts no `package.json` (atalhos úteis):
  - `npm run mobile:cap:init` — inicializa Capacitor (usa `out` como `webDir`).
  - `npm run mobile:cap:add-android` — adiciona plataforma Android.
  - `npm run mobile:cap:copy` — copia arquivos web para o projeto nativo.
  - `npm run mobile:cap:open-android` — abre o Android Studio para o projeto Android.
  - `npm run mobile:serve` — inicia `next start` em `:3000` (útil para dev/device)
  - `npm run mobile:export` — tenta `next build && next export -o out` (pode falhar).

## Pré-requisitos (no Windows)

- Node.js e npm instalados
- Android Studio com Android SDK instalado
- Variáveis de ambiente configuradas (JAVA_HOME, ANDROID_SDK_ROOT etc.)
- Acesso ao emulador (AVD) ou um dispositivo Android em modo desenvolvedor

## Passos — opção 1: usar site hospedado (rápido, produção)

1. Hospede o site Next.js (Vercel, Netlify, Firebase Hosting, etc.) e anote a URL pública, por exemplo https://meusite.com
2. No Android (Capacitor), configure o `server.url` para essa URL (ver abaixo). Exemplos:

   - Abra `android/app/src/main/res/xml/` (ou onde o Capacitor gera o config) e defina o URL padrão.
   - Alternativamente, dentro do Android Studio, em `MainActivity` ou no `capacitor.config.json`, defina:

     {
     "server": { "url": "https://meusite.com", "cleartext": false }
     }

3. Abra o projeto Android e gere o APK/AAB no Android Studio (`Build > Build Bundle(s) / APK(s)`).

## Passos — opção 2: servidor local (desenvolvimento)

1. No PC, rode o servidor Next:

   ```cmd
   npm run dev
   rem or for production-like: npm run build && npm run mobile:serve
   ```

2. No Capacitor, configure o app para usar `http://10.0.2.2:3000` (emulador Android usa esse IP para se conectar ao host):

   - Crie/edite `capacitor.config.json` no root do projeto (ou use `npx cap init` primeiro) com:

     {
     "appId": "com.lira.mobitec",
     "appName": "MobiTec",
     "webDir": "out",
     "server": {
     "url": "http://10.0.2.2:3000",
     "cleartext": true
     }
     }

3. Adicione Android e abra o projeto:

   ```cmd
   npx @capacitor/cli init MobiTec com.lira.mobitec --webDir=out
   npx cap add android
   npx cap open android
   ```

4. No Android Studio: Build e Run no emulador (aplicativo abrirá a URL do servidor local).

## Observações sobre rede e dispositivos reais

- Emulador Android (Android Studio): use `10.0.2.2` para acessar o host Windows.
- Em um dispositivo real conectado via USB, use o IP local da sua máquina (ex.: `http://192.168.1.100:3000`) e garanta firewall aberto.

## Passos — opção 3: export estático (pode falhar)

1. Tente gerar export estático:

   ```cmd
   npm run mobile:export
   ```

2. Se a exportação funcionar, você terá `out/` com os arquivos estáticos. Então:

   ```cmd
   npm run mobile:cap:init
   npm run mobile:cap:add-android
   npm run mobile:cap:copy
   npm run mobile:cap:open-android
   ```

3. No Android Studio: Gere o APK/AAB.

## Notas importantes e limitações

- O projeto atual contém arquivos com `'use server'` (server actions). Isso geralmente impede `next export` e torna a opção 3 inviável sem refatoração.
- Se você precisa que o app funcione offline sem servidor, considere migrar partes do app para rodar no cliente ou usar APIs locais.
- Alternativa mais simples para publicar no Play Store: gerar um TWA (Trusted Web Activity) apontando para a URL hospedada — isso evita empacotar o Next server e funciona bem para apps que dependem de SSR.

## Como eu posso ajudar agora

- Posso preparar o projeto Android dentro do repositório (rodando os comandos do Capacitor) se você me confirmar que tem Android Studio/SDK instalado no seu Windows e quer que eu gere o AAB localmente.
- Ou posso apenas preparar tudo no repositório (scripts e este guia) e você compila localmente.

Recomendo: se você NÃO tem um backend hospedado, começe com a opção 2 (desenvolvimento) para testar no emulador; para produção prefira TWA (se site hospedado) ou refatoração para export estático.

FIM
