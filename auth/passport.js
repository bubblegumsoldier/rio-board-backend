const User = require("../models").user;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var md5 = require('md5');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        return User.findOne({where: {
            email: email,
            password: md5(password)
        },
        raw: true
        })
           .then(user => {
               if (!user) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
                }
               console.log("user was found!");
               return cb(null, user, {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : require("./secret")
},
    (jwtPayload, cb) => {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findByPk(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));