# APK для сайта

Файл для распространения: **`public/downloads/zov-oceana.apk`**.
Кнопка на странице `/app` скачивает его по `/downloads/zov-oceana.apk`.
Текущая подписанная release-сборка уже скопирована сюда.

## Обновить приложение

1. При выпуске следующей версии увеличить `versionCode` и `versionName` в
   `android-app/app/build.gradle`. Сохранить прежний ключ подписи.
2. Из корня фронтенда выполнить в PowerShell 7:

   ```powershell
   ./android-app/scripts/build.ps1 -Variant Release
   ```

   Скрипт собирает подписанный APK, выполняет Android lint и автоматически
   копирует результат в `public/downloads/zov-oceana.apk`.
   Ключ уже создан; повторно запускать создание ключа не нужно.

3. Проверить веб-сборку:

   ```shell
   npm run build
   ```

4. Включить обновлённый APK вместе с изменениями сайта в Git/контекст сборки и
   запустить обычный процесс развёртывания фронтенда.

Если APK собран в Android Studio или другим способом, вручную скопировать
подписанный release-файл в `public/downloads/zov-oceana.apk` **до** сборки сайта.
Не использовать debug-сборку. При смене сертификата подписи также обновить
`static/.well-known/assetlinks.json`.

## Как файл попадает в контейнер

```text
Подписанная release-сборка Android
  → public/downloads/zov-oceana.apk
  → npm run build (Vite копирует public/)
  → dist/downloads/zov-oceana.apk
  → COPY dist из build-stage в /frontend-dist контейнера Nginx
  → https://zovoceana.ru/downloads/zov-oceana.apk
```

Android SDK, исходники оболочки и приватный ключ не нужны для Docker-сборки
фронтенда. `android-app/` и `.android-tools/` исключены из Docker-контекста.
Приватные ключи и `signing.properties` нельзя класть в `public/`.

Если APK отсутствует, веб-сборка завершится понятной ошибкой, вместо публикации
неработающей кнопки. Файл исключён из precache service worker. Nginx отдаёт его
как вложение с MIME `application/vnd.android.package-archive` и перепроверкой кеша.

После развёртывания проверить:

- `/app` открывается и ссылка есть в футере;
- `/downloads/zov-oceana.apk` скачивается как APK, а не HTML;
- `/.well-known/assetlinks.json` доступен без редиректов и авторизации;
- на iPhone: Safari → «Поделиться» → «На экран “Домой”» → «Добавить».

Docker в ходе подготовки этих изменений не собирался.
