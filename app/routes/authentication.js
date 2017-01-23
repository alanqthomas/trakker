const passport = require('passport')
const jwt = require('jwt-simple')
const passportService = require('../services/passport')
const User = require('../models/user')
const config = require('../config')
const router = require('express').Router()
const requireSignin = passport.authenticate('local', { session: false })

const tokenForUser = (user) => {
	const timestamp = new Date().getTime()
	return jwt.encode({
		sub: user.id,
		iat: timestamp
	}, config.secret)
}

const signin = (req, res, next) => {
	// User has already had their email and password auth'd
	// We just need to give them a token
	res.send({
		token: tokenForUser(req.user)
	})
}

const signup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({
			error: 'You must provide an email and password'
		})
	}

	// See if a user with the given email exists
	User.findOne({
		email: email
	}, function (err, existingUser) {
		if (err) {
			return next(err);
		}

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({
				error: "Someone's already using that email!"
			})
		}
	});

	// If a user with email does NOT exist, create and save user record
	const user = new User({
		email: email,
		password: password
	});

	user.save(function (err) {
		if (err) {
			return next(err)
		}

		// Respond to request indicating the user was created
		res.json({
			token: tokenForUser(user)
		})
	});
}

// Local & JWT Authentication
router.post('/signin', requireSignin, signin)
router.post('/signup', signup)

// Google Authentication
router.get('/google',
	passport.authenticate('google', { scope: ['openid email profile']}));
router.get('/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/landing'
	})
);

module.exports = router
