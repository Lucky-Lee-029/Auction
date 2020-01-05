const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const bidderModel = require('../models/bidders.model');
const config = require('../config/default.json');
const facebookConfig = require('../config/facebook-login.json');
var Recaptcha = require('express-recaptcha').RecaptchaV2;
var recaptcha = new Recaptcha('6LdVh8wUAAAAACNjGKuimXNdTvWOI6ySPQ_9ntBb', '6LdVh8wUAAAAANLiBeI__ch1NzC381x4a2lfw37W');
module.exports = function (app, passport) {


    passport.use('local', new LocalStrategy(async function (email, password, done) {
        try {
            let user = await bidderModel.singleByEmail(email);
            if (user.length == 0)
                return done(null, false);
            user = user[0];
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false);
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }));

    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        var user = await bidderModel.single(id);
        return done(null, user[0]);
    });

    // app.post('/login', passport.authenticate('local', { failureRedirect: '/about', successRedirect: '/' }))

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', function (err, user) {
            if (err) return next(err);
            if (!user) {
                req.session.loginModal = true;
                req.session.loginMessage = "Invalid username or password";
                return res.redirect(req.query.url);
            }
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.redirect(req.query.url);
            })
        })(req, res, next);

    })

    app.get('/logout', (req, res) => {
        req.logOut();
        res.redirect('/');
    });

    //register
    app.get('/register', recaptcha.middleware.render, (req, res) => {
        res.render('guest/Register', {
            captcha: res.recaptcha
        });
    });
    app.post('/register', recaptcha.middleware.verify, async (req, res) => {
        if (!req.recaptcha.error) {
            let user = await bidderModel.singleByEmail(req.body.email);
            if (user.length > 0) // existed
            {
                req.session.hasRegisterError = true;
                req.session.errorMessage = "Invalid username or password";
                return res.redirect("/register");
            } else {
                let hashPassword = bcrypt.hashSync(req.body.password, config.bcrypt.init);
                console.log(req.body);
                var name = req.body.name;
                var birthday = req.body.birthday;
                var email = req.body.email;
                var address = req.body.address;
                var password = req.body.password;
                var entity = {
                    'name': name,
                    'birthday': birthday,
                    'email': email,
                    'address': address,
                    'password': password
                }
                entity.password = hashPassword;
                await bidderModel.add(entity);
                req.session.loginModal = true;
                res.redirect('/');
            }
        } else {
            req.flash("message", "recaptcha is incorred");
            res.redirect("back");
        }
    });
    //Check whether email has exists ? 
    app.post('/validateEmail', async (req, res) => {
        let user = await bidderModel.singleByEmail(req.body.email);
        if (user.length == 0)
            return res.json({
                valid: true
            });
        else
            return res.json({
                valid: false
            });
    })
    //login with facebook
    passport.use(new FacebookStrategy({
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL,
        profileFields: ['id', 'emails', 'name']
    }, async function (accessToken, refreshToken, profile, cb) {
        try {
            let user = await bidderModel.singleByFacebookId(profile.id);
            console.log(user)
            if (user.length == 0) {
                var findByEmail = await bidderModel.singleByEmail(profile.emails[0].value);
                if (findByEmail.length > 0) { //has account with email
                    user = findByEmail[0];
                    user.facebook_id = profile.id;
                    await bidderModel.patch(user);
                } else { //dont have account with email
                    var entity = {
                        facebook_id: profile.id,
                        name: profile.name.familyName + " " + profile.name.givenName,
                        email: profile.emails[0].value,
                    };
                    await bidderModel.add(entity);
                }
                user = await bidderModel.singleByFacebookId(profile.id);
            }
            return cb(null, user[0]);
        } catch (e) {
            return cb(e, false);
        }
    }))
    app.get('/login/facebook',
        passport.authenticate('facebook', {
            scope: ["email"]
        }));

    app.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/about'
        }),
        function (req, res) {
            if (req.user.password.length == 0)
                req.session.newFBAccount = true;
            res.redirect('/facebook/set-password');
        });
    app.get('/facebook/set-password', isAuth, (req, res) => {
        console.log(req.user);
        if (req.session.newFBAccount) {
            delete req.session.newFBAccount;
            return res.render('bidder/update-password', {
                newFBAccount: true
            })
        }
        res.redirect('/');
    })

    app.post('/facebook/set-password', isAuth, async (req, res) => {
        var entity = req.user;
        entity.password = bcrypt.hashSync(req.body.newPassword, config.bcrypt.init);
        await bidderModel.patch(entity);
        res.redirect('/');
    })

    app.get('/update-password', isAuth, (req, res) => {
        if (req.user.password.length == 0)
            return res.redirect('/facebook/set-password');
        res.render('bidder/update-password');
    })

    app.post('/update-password', isAuth, async (req, res) => {
        if (bcrypt.compareSync(req.body.oldPassword, req.user.password)) {
            var entity = req.user;
            entity.password = bcrypt.hashSync(req.body.newPassword, config.bcrypt.init);
            await bidderModel.patch(entity);
            res.redirect('/');
        } else {
            //set update password error on session
            res.redirect('/update-password');
        }
    })

    function isAuth(req, res, next) {
        if (req.user) {
            next();
        } else {
            req.session.loginModal = true;
            res.redirect('/');
        }
    }

    app.get('/profile', isAuth, (req, res) => {
        res.render('profile');
    })
}