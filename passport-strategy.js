
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt")
const JWTStrategy   = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const  { userLogin } = require('./dbrequests') 

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    function (username, password, cb) {
        console.log(username, password)
         //in the first vid, Thomas RETURNS the promise...
        return userLogin(username, password).then(
            user => {
                if(!user) {
                    return cb(null, false, {message: 'Incorrect username or password.'})
                } else {
                    return cb(null, { id: user.id, username }, {message: 'Logged In Successfully'})
                }
            }
        ).catch(err=> cb(err))
        //and here, a .catch(err=> cb(err))
    }
))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload, cb) {
    const user = jwtPayload
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return cb(null, user)
}))
