const Strategy = require('passport-http-bearer').Strategy;
import { Token } from '../app/models';

const Passport = (passport) => {
	passport.use(
		new Strategy((token, cb) => {
			Token.find({ token: token }, (err, user) => {
				console.log(user);
				if (err) {
					return cb(err);
				}
				if (Object.keys(user).length === 0) {
					return cb(null, false);
				}
				return cb(null, user);
			});
		})
	);
};

export default Passport;
