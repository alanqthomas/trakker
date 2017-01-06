const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
	name: String,
	type: String,
	status: String,
	updatedDate: { type: Date, default: Date.now },
	progress: {
		season: Number,
		episode: Number
	},
	imageURL: String,
	imdb: Schema.Types.Mixed
});

const model = mongoose.model('item', itemSchema)

module.exports = model
