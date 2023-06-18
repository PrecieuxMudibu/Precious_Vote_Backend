import passportJwt from 'passport-jwt';
import passport from 'passport';
import User from '../models/userModel.js';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// TO DO : PLACE IT IN ENV VARIABLE
const secret = 'NEVER GIVE UP';

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

const auth_middleware = passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        User.findOne({ _id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
);

export default auth_middleware;
