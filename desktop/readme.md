# Jars

Hello!


### Quirks
- Running this app in Firefox with resistFingerprinting turned on will spoof your timezone offset, distorting some results if you're not located in UTC+0000. The app relies on accurate reporting of your local time, and does not attempt to outmaneuver your browser.
- This app requires a PHP server to run. The app will prompt the user for an API URL, and assume [this](https://github.com/mevdschee/php-crud-api) functionality. Refusing this prompt will set the app in localStorage mode, where entries are stored locally.
- The gregorian calendar is assumed.
- A lifespan of 80 years is assumed.
