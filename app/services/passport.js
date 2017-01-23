const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this email and password, call doen with the user
	// if it is the correct email and password.
	// Otherwise, call done with false
	User.findOne({ email: email }, function(err, user) {
		console.log('user', user)
		if (err) { return done(err); }
		if (!user) { return done(null, false, { message: "That user doesn't exist. Did you enter the right email?"}); }

		// compare passwords - is 'password' equal to user.password?
		user.comparePassword(password, function(err, isMatch) {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false, { message: "The password was incorrect. Try again if you're not a hacker."}); }

			return done(null, user);
		});
	});
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// See if the user ID in the payload exists in our database
	// If it does, call 'done' with that user
	// otherwise, call done without a user object

	User.findById(payload.sub, function(err, user) {
		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

const googleOptions = {
	clientID: config.googleAuth.clientId,
	clientSecret: config.googleAuth.clientSecret,
	callbackURL: config.googleAuth.callbackURL,
	passReqToCallback: false
};

// Setup Google OAuth2
const googleLogin = new GoogleStrategy(googleOptions,
	function(token, refreshToken, profile, done) {
		console.log('token', token)
		console.log('refreshToken', refreshToken)
		console.log('profile', profile)

		User.findOne({'google.id': profile.id}, function(err, user) {
			// Error
			if (err)
				return done(err);
			// Found match
			if (user) {
				return done(null, profile);
			} else {
				const newUser = new User({
					google: {
						id: profile.id,
						token: token,
						name: profile.displayName,
						email: profile.emails[0].value
					}
				})

				newUser.save(function(err) {
					if (err)
						throw err;
					return done(null, profile);
				});
			}

		})
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);
