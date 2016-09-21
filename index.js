const express = require('express'),
 app = express(),
 bodyParser = require('body-parser'),
 assert = require('assert'),
 MongoClient = require('mongodb').MongoClient,
 expressMongoDb = require('express-mongo-db'),
 favicon = require('serve-favicon')

const port = 3000,
	routesPath = './app/routes/',
	apiVersion = 1

// Routes
const item = require(`${routesPath}v${apiVersion}/item`),
	imdb = require(`${routesPath}v${apiVersion}/imdb`)

// Favicon
app.use(favicon(__dirname + '/app/public/favicon.ico'))

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Static files
app.use(express.static(__dirname + '/app/public'))

// MongoDB connection sharing
app.use(expressMongoDb('mongodb://localhost:27017/trakker'))

// Mount routes
app.use('/api/v' + apiVersion, item)
app.use('/api/v' + apiVersion, imdb)

const server = app.listen(port, () =>{
	console.log('Listening on port ' + port + '...')
})
