const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../Models/User')

module.exports = passport.use(new JwtStrategy({
    secretOrKey: process.env.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
    const user = await User.findOne({ _id: payload.sub })
    if(!user) {
        return done(null, false)
    } else {
        return done(null, user)
    }
}))