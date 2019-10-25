![Sweet promotional banner](design/jars-v2.0.0.jpg)

# Jars

For the longest time I used three markdown files that I kept in an always-open text editor to organize my life. I built _Jars_, so named after the [Chris Crawford ritual](http://www.erasmatazz.com/personal/self/sixty.html), as an answer to those markdown files.

Jars runs off of a CRUD capable server that spits out JSON. Through this, one can save tasks and view them wherever. The server need not be the particular one I've elected to use, so long as the endpoint functionality is the same.

Alternatively, it can run without an internet connection entirely with localStorage. Some features (such as the visualiser) do not work in this mode.

The `react` branch includes compatible localisations for major portions of Jars.

View the `/desktop` directory to install.

## Credits

This app contains no external dependencies, but relies on some modern Javascript to do so. An ES6+ capable browser that understands async/await, fetch() et al. should do fine if you so desire to run it without electron.

A prominent component of this version of Jars utilises a calendar representation written by [Alexey Botkov](https://github.com/nomand/). Jars' visual design, raison d'etre and current programming ethos were heavily inpired by [a close friend's log](https://v-os.ca/timekeeping) and associated projects.

Jars contains code from the following repos:
* [PHP CRUD API](https://github.com/mevdschee/php-crud-api), (c) 2019 Maurits van der Schee, [MIT](https://github.com/mevdschee/php-crud-api/blob/master/LICENSE)
* [Letnice](https://github.com/nomand/Letnice), (c) 2018 Alexey Botkov, [MIT](https://github.com/nomand/Letnice/blob/master/LICENSE.md)

Additional reading regarding Crawford: [Kotaku](https://kotaku.com/30-years-later-one-mans-still-trying-to-fix-video-gam-1490377821)

## License

[MIT](licence.md)
