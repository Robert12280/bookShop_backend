const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");
const Cart = require("../models/Cart");

passport.serializeUser;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URI}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({ googleId: profile.id }).exec();
            if (user) {
                return done(null, user);
            } else {
                const userObject = {
                    name: profile.displayName,
                    googleId: profile.id,
                    email: profile.emails[0].value,
                };
                const newUser = await User.create(userObject);
                if (newUser) {
                    const cartObject = {
                        userId: newUser._id,
                        bookList: [],
                    };

                    // create new cart
                    const newCart = await Cart.create(cartObject);
                    if (newCart) {
                        done(null, newUser);
                    }
                }
            }
        }
    )
);
