Pré-requisitos

- Java JDK (17+ recomendado). Configure a variável de ambiente JAVA_HOME apontando para a pasta do JDK.
- Android SDK (command-line tools) e Android Studio instalados. Configure ANDROID_SDK_ROOT (ou ANDROID_HOME) apontando para o SDK.
- Node.js (versão compatível; Node 16+ recomendado) e npm.

Objetivo

Este documento descreve como deixar o projeto `MobiTec` pronto para abrir no Android Studio e gerar o APK (debug ou release).

Passos automáticos (Windows — arquivo já pronto: `prepare-android.bat`)

1) Abra um `cmd.exe` na pasta do projeto (ex: `C:\Users\mateu\Projeto\MobiTec`).
2) Rode o script:

   prepare-android.bat

O script executa (sequência):
- `npm install`
- `npm run build` (Next.js export → gera a pasta `out/` conforme `next.config.ts`)
- `npx cap sync android` (sincroniza o conteúdo web gerado com o projeto Android)

Após o script indicar que tudo foi preparado, abra o Android Studio.

Importar no Android Studio

1) No Android Studio: File → Open... → selecione a pasta `android` do projeto (ex: `C:\Users\mateu\Projeto\MobiTec\android`).
2) Deixe o Android Studio sincronizar Gradle e baixar dependências.
3) Para gerar APK debug (rápido): Build → Build Bundle(s) / APK(s) → Build APK(s).
   O APK gerado ficará em:
   `android/app/build/outputs/apk/debug/app-debug.apk`.
4) Para gerar release assinado: Build → Generate Signed Bundle / APK → siga o assistente e forneça o keystore.

Gerar APK sem abrir o Android Studio (opcional)

Se preferir gerar pelo terminal (Windows), depois de `npx cap sync android` rode:

   cd android
   gradlew.bat assembleDebug

O comando usa o Gradle wrapper presente no projeto (`android/gradlew.bat`).

Resolução de problemas comuns

- Erro: "JAVA_HOME is not set" → Instale o JDK e defina a variável de ambiente. Exemplo:
  setx JAVA_HOME "C:\Program Files\Java\jdk-17"
  Feche e reabra o terminal/Android Studio.

- Erro: SDK ausente, `sdkmanager` não encontrado → instale o Android SDK command-line tools e configure `ANDROID_SDK_ROOT`.

- Erro no `npm run build` relacionado ao Next.js (rotas dinâmicas/SSG) → confirme que seu app está preparado para `output: 'export'` (veja `next.config.ts`) e que todas as rotas são exportáveis; corrija chamadas de API/SSR para usar geração estática.

Notas específicas deste repositório

- `capacitor.config.json` tem `webDir: "out"` — o `npm run build` do Next (com `output: 'export'`) deve gerar a pasta `out/` com os arquivos estáticos.
- Projeto já contém a pasta `android/` e o Gradle wrapper (`android/gradlew.bat`), logo você pode abrir diretamente no Android Studio.

Ajuda adicional

Se algum passo falhar, cole as mensagens de erro aqui e eu te direi o ajuste exato (ex.: comandos para instalar partes do SDK, como baixar build-tools, ou configurações faltantes).