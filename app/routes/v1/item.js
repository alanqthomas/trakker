const express = require('express'),
			router = express.Router(),
			assert = require('assert'),
			Item = require('../../models/item.js');

const route = '/item'

router.get(`${route}`, (req, res) => {
	Item.find({}, (err, docs) => {
		if (err)
			res.send(err)
		res.json(docs)
	})
})

router.get(`${route}/:id`, (req, res) => {
	Item.findById(req.params.id, (err, docs) => {
		if (err)
			res.send(err)
		res.json(docs)
	})
})

router.post(`${route}`, (req, res) => {
	const body = req.body;
	const newItem = new Item({
		name: body.name,
		type: body.type,
		status: body.status,
		updatedDate: body.updatedDate,
		progress: body.progress,
		imageURL: body.imageURL,
		imdb: body.imdb
	}).save((err, result) => {
		if (err)
			res.send(err)
		console.log('Inserted a document')
		res.sendStatus(201)
	})
})

router.delete(`${route}/:id`, (req, res) => {
	Item.remove({_id: req.params.id}, (err, docs) => {
		if (err)
			res.send(err)
		console.log('Deleted document', docs)
		res.sendStatus(200)
	})
})

router.put(`${route}/:id`, (req, res) => {
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
