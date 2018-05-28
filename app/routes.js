var user = require('../app/models/user');
module.exports = (app, passport) => {

	// index routes
	app.get('/', (req, res) => {
		res.render('index');
	});

	//login view
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // gives a message
	}));

	//profile view
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});

	app.get('/profile/edit', isLoggedIn, function(req, res) {
    res.render('edit', {
        user : req.user
    });
});

app.post('/profile/edit', isLoggedIn, function(req, res) {
	user.update({_id: req.session.passport.user}, {
			name: req.body.name,
			image: req.body.image
	}, function(err, numberAffected, rawResponse) {
		 console.log('new profile update error');
	});
	res.render('profile', {
			user : req.user,

	});
});


	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}
