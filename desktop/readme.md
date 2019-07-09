# Jars

Hello!


### Quirks
- Running this app in Firefox with resistFingerprinting turned on will spoof your timezone offset, distorting some results if you're not located in UTC+0000. The app relies on accurate reporting of your local time, and does not attempt to outmaneuver your browser.
- `--allow-file-access-from-files` runtime flag is required to access localStorage in Chrome when lauched as simple html file.
- This app requires a PHP server to run. The app will prompt the user for an API URL, and assume [this](https://github.com/mevdschee/php-crud-api) functionality. Refusing this prompt will set the app in localStorage mode, where entries are stored locally.
- The visualiser module does not support localStorage mode.
- The gregorian calendar is assumed.
- A lifespan of 80 years is assumed.
