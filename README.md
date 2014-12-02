node-serverPrototype
====================

Prototype node js server (rest server)
This project is a prototype made ​​in node js server based on routes and services.
The purpose of this server is to show how layers can organize routes ,
services, database connectors , validation schemes , and logger configuration 
files within a common project.

You can clone the project. To put into operation must realziar the following:
clone the github proyect
npm install ( all packages)
There is a script that allows chell launch the project :
backend.sh
or you may jump by :
single.js node in stand alone mode or in cluster ,
node cluster.js

This server requires a local database mongodb configured on port 27017.
The config file (lib/config.js) 
E2e test folder , shows how to implement a POST call to the server.
Also can be used to generate the post postman call.
The configuration file used to define the http and https ports server 
operation as well as the maximum number of parallel processes that can 
be used by each call to the post method.

Example:
http://localhost:3000/ws3/hello or https://localhost:3443/ws3/hello
Method post, x-www-form-urlencoded,
parameters: from es
			to en
			message hola mundo!
			
you must obtain:
{
    "source": "hola mundo!",
    "target": "hello world!"
}

This REST use google translator facility (thanks google!)
