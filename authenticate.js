const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //strategy constructor from the local strategy library
const User = require('./models/user'); //user schema has access to the passport local mongoose plugin
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; //extract JW Token from request object
const jwt = require('jsonwebtoken'); //node module used to create, sign and verify tokens
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require('./config.js');

//add specific strategy plugin to passport implementation
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//serialization and deserialization are necessary when using sessions to passport
passport.serializeUser(User.serializeUser()); //needed to store session data from request object
passport.deserializeUser(User.deserializeUser()); //when user is successfully verified and added to request object

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });//web token api created token with 1 hour limit
};

//configure JWT strategy for passport
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts, //object configuration options
        (jwt_payload, done) => { //verify callback function
            User.findOne({ _id: jwt_payload._id })
                .then(user => {
                    if (user) {
                        // Check if user object is valid
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => {
                    console.error(err);
                    return done(err, false);
                });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false }); //use jwt passport strategy without session

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};

passport.use(new GoogleStrategy({
    clientID: config.google.GOOGLE_CLIENT_ID,
    clientSecret: config.google.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/user/auth/google/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOne({ googleId: profile.id })
            .then(user => {
                if (user) {
                    return cb(null, user);
                } else {
                    user = new User({ username: profile.emails[0].value });
                    user.googleId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save()
                        .then(user => {
                            if (user) {
                                return cb(null, user);
                            }
                        })
                        .catch(err => cb(err, false));
                }
            })
            .catch(err => cb(err, false));
    }
));