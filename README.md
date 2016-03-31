# This is the readme file

To run this locally, please install all npm and bower dependencies and gulp

> npm install

> bower install

> npm install --global gulp-cli

then, to be able to run it in browser, you need to <br/>
1. Run node server

> node index.js

<b>But</b> if you want to write some server side logic without pain, we suggest you to have Nodemon installed globally on your system.
You can install it with this command

> npm install -g nodemon

then you can just type

>npm start

in terminal and be free of restarting server every time after changing 'foo' to 'bar'.

After this you can open http://localhost:3001/ in browser

If you want to change *.scss files (because we write styles in scss), then you need to type

> gulp

in other Terminal window, to run watcher, which builds css files on the fly.

## DataBase setup info

will be available soon

## Useful docs

1. http://docs.sequelizejs.com/en/latest/ - nodejs ORM for PostgreSQL
2. http://postgresql.ru.net/manual/
3. https://docs.angularjs.org/guide
4. https://docs.angularjs.org/api