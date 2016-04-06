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

Before start you should also build main.css styles using
> gulp styles

command.

After this you can open http://localhost:3001/ in browser if you set up database correctly.

If you want to change *.scss files (because we write styles in scss), then you need to type

> gulp

in other Terminal window, to run watcher, which builds css files on the fly.

## DataBase dev setup info

Get installation here: http://www.enterprisedb.com/products-services-training/pgdownload </br>
Installer version: Version 9.2

During installation enter password: AdminUser1** </br>
Leave port field with value 5432 </br>
Then in pgAdmin connect to DB server on localhost and create 'storehouse' database </br>
After this you can uncomment these line in index.js to create (almost) empty tables in db.
> require('./db_setup/setup')({ ... });

Then run server and immediately comment it back.

## Useful docs

1. http://docs.sequelizejs.com/en/latest/ - nodejs ORM for PostgreSQL
2. http://postgresql.ru.net/manual/
3. https://docs.angularjs.org/guide
4. https://docs.angularjs.org/api

## GIT

1. Before commit run 'gulp lint' in terminal. Commit only in case of 0 problems in response.
2. Create new branch for every task from Taiga and name it appropriately
3. Commit as often as you need (at least once a day)
4. After finishing task create Pull Request in base branch and assign it to a responsible person
5. Write useful comments to commit, not just 'some updates', or 'minor fix'. Don't be afraid of long comments.
6. To be continued...

## General

We are using: </br>
1. WebStorm for development </br>
2. ESlint for same coding style. How to setup in WebStorm: http://prntscr.com/amox9y </br>
3. TODOs comments as " // TODO SH ... " for easing search of project-specific tasks </br>
4. https://tree.taiga.io/project/olgafedo-foodbox/ as task tracking system </br>

## Account information

Server mail:
 email - storehousefoodbox@gmail.com
 password - ael,jrc123
 
