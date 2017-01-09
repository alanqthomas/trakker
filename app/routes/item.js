const express = require('express'),
			router = express.Router(),
			assert = require('assert'),
			Item = require('../models/item.js'),
			passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

const route = '/item'

router.get(`${route}`, requireAuth, (req, res) => {
	console.log('req', req.user)
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
	console.log('req', req.user._id)
	const body = req.body;
	const newItem = new Item({
		name: body.name,
		type: body.type,
		status: body.status,
		updatedDate: body.updatedDate,
		progress: body.progress,
		imageURL: body.imageURL,
		imdb: body.imdb,
		userId: req.user._id
	}).save((err, result) => {
		if (err)
			res.send(err)
		console.log('Inserted a document')
		res.sendStatus(201)
	})
})

router.delete(`${route}/:id`, requireAuth, (req, res) => {
	console.log('req', req.user)
	Item.find({'_id': req.params.id, 'userId': req.user._id}).remove( (err, docs) => {
		if (err)
			res.send(err)
		console.log('Deleted document', docs)
		res.sendStatus(200)
	})
})

router.put(`${route}/:id`, requireAuth, (req, res) => {
	console.log('req', req.user)
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
