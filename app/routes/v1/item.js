const express = require('express'),
			router = express.Router(),
			ObjectId = require('mongodb').ObjectId,
			assert = require('assert')

const route = '/item'

router.get(`${route}`, (req, res) => {
	req.db.collection('items').find({}).toArray((err, docs) => {
		res.send(docs)
	})
})

router.get(`${route}/:id`, (req, res) => {
	req.db.collection('items').find({"_id": new ObjectId(req.params.id)}).toArray((err, docs) => {
		res.send(docs)
	})
})

router.post(`${route}`, (req, res) => {
	req.db.collection('items').insert(req.body, (err, result) => {
		assert.equal(err, null)
		console.log("Inserted a document")
		res.send(req.body)
	});
})

router.delete(`${route}/:id`, (req, res) => {
	req.db.collection('items').remove({"_id": new ObjectId(req.params.id)}, (err, result) =>{
		assert.equal(err, null)
		console.log("Deleted document:")
		console.log(result)
		res.sendStatus(200)
	})
})

router.put(`${route}/:id`, (req, res) => {
	delete req.body._id
	console.log(`Updating object with id ${req.params.id} to the object:`, req.body)
	req.db.collection('items').replaceOne({"_id": new ObjectId(req.params.id)}, req.body, (err, result) => {
		assert.equal(err, null)
		console.log('Update successful', result)
		res.sendStatus(200)
	})
})

module.exports = router
