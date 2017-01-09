const express = require('express'),
	router = express.Router(),
	ObjectId = require('mongodb').ObjectId,
	assert = require('assert'),
	imdb = require('imdb-api')

const route = '/imdb'

router.get(`${route}/id/:id`, (req, res) => {
	imdb.getReq({ "id": req.params.id}, (err, data) => {
		res.send(data)
	})
})

router.get(`${route}/title/:title`, (req, res) => {
	imdb.getReq({ "name": req.params.title}, (err, data) => {
		res.send(data)
	})
})

module.exports = router
