const express = require('express'),
			router = express.Router(),
			assert = require('assert'),
			Item = require('../models/item.js'),
			passport = require('passport'),
			imdb = require('imdb-api')
const requireAuth = passport.authenticate('jwt', { session: false })

const route = '/item'

router.get(`${route}`, requireAuth, (req, res) => {
	Item.find({'userId': req.user._id}, (err, docs) => {
		if (err)
			res.send(err)
		res.json(docs)
	})
})

router.get(`${route}/:id`, requireAuth, (req, res) => {
	Item.findById({'_id':req.params.id, 'userId': req.user._id}, (err, docs) => {
		if (err)
			res.send(err)
		res.json(docs)
	})
})

router.post(`${route}`, requireAuth, (req, res) => {
	const body = req.body;
	imdb.getReq({"name": body.name}, (err, data) => {
		const newItem = new Item({
			name: body.name,
			type: body.type,
			status: body.status,
			updatedDate: body.updatedDate,
			progress: body.progress,
			imageURL: body.imageURL,
			imdb: data ? data.imdbid: null,
			userId: req.user._id
		}).save((err, result) => {
			if (err)
				res.send(err)
			console.log('Inserted a document')
			res.sendStatus(201)
		})
	})
})

router.delete(`${route}/:id`, requireAuth, (req, res) => {
	Item.find({'_id': req.params.id, 'userId': req.user._id}).remove( (err, docs) => {
		if (err)
			res.send(err)
		console.log('Deleted document', docs)
		res.sendStatus(200)
	})
})

router.put(`${route}/:id`, requireAuth, (req, res) => {
	delete req.body._id
	console.log(`Updating object with id ${req.params.id} to the object:`, req.body)
	const body = req.body

	Item.findById(req.params.id, (err, newItem) => {
		if (err)
			res.send(err)

		newItem.name = body.name
		newItem.type = body.type
		newItem.status = body.status
		newItem.updatedDate = body.updatedDate
		newItem.progress = body.progress,
		newItem.imageURL = body.imageURL,
		newItem.imdb = body.imdb

		newItem.save((err) => {
			if (err)
				res.send(err)
			console.log('Update successful')
			res.json(body)
		})
	})
})

module.exports = router
