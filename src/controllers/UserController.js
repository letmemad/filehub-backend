const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function generateToken(id) {
    return jwt.sign({
        sub: id,
        admin: false,
        type: 'User'
    }, process.env.SECRET, { expiresIn: '1y' })
}

module.exports = {
    async index(req, res) {
        const users = await User.find({})
        return res.json({ users })
    },

    async create(req, res) {
        const { first_name, last_name, email, password } = req.body;
        if(!first_name || !last_name || !email || !password) return res.status(400).json({ 
            error: "Please, fill in all the inputs."
        })

        if(await User.findOne({ email })) return res.status(400).json({ 
            error: "Email is alredy registered."
         })

         const user = await User.create({
             first_name,
             last_name,
             email,
             password: await bcrypt.hash(password, 12)
         })

         return res.json({ user, token: generateToken(user._id) })
    },

    async store(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ error: "User not found" })

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) return res.status(400).json({ error: "Invalid password." })

        return res.json({ user, token: generateToken(user._id) })
    },

    async getUser(req, res) {
        return res.json({ user: req.user })
    }
}