const express = require('express'),
 app = express(),
 bodyParser = require('body-parser'),
 assert = require('assert'),
 favicon = require('serve-favicon'),
 compression = require('compression'),
 mongoose = require('mongoose')

const port = process.env.PORT || 3000,
	routesPath = './app/routes/',
	apiVersion = 1

// Routes
const item = require(`${routesPath}item`),
	imdb = require(`${routesPath}imdb`),
	authentication = require(`${routesPath}authentication`)

// mongoose.connect('mongodb://localhost:27017/trakker')
mongoose.connect('mongodb://heroku_4zl85rkd:698dt04esv2i1f1o3n50ao677u@ds035816.mlab.com:35816/heroku_4zl85rkd')

// Use native ES6 promises as the Mongoose promise library
mongoose.Promise = global.Promise

// Favicon
app.use(favicon(__dirname + '/app/public/favicon.ico'))

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Compression
app.use(compression())

// Static files
app.use(express.static(__dirname + '/app/public'))

// Mount routes
app.use('/api/v' + apiVersion, item)
app.use('/api/v' + apiVersion, imdb)
app.use('/api/v' + apiVersion, authentication)

const server = app.listen(port, () =>{
	console.log('Listening on port ' + port + '...')
})
