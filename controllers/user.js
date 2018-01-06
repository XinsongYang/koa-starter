const User = require('./../models/user');
const APIError = require('../middlewares/response').APIError;

module.exports = {
    
    async signup(ctx, next) {
        const { username, password } = ctx.request.body;
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        ctx.ok({ message: 'Success!' });
    },

    async login(ctx, next) {
        const { username, password } = ctx.request.body;
        const user = await User.findOne({ username });
        if (!user) {
            throw new APIError('auth:user_not_found', 'User not found!');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new APIError('auth:password_not_correct', 'Password not correct!');
        }
        ctx.session.user = user;
        ctx.ok({message: 'Success!'});
    },

    async logout(ctx, next) {
        ctx.session.user = null;
        ctx.ok({message: 'Success!'});
    }

}