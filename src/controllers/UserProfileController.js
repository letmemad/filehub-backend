const User = require('../Models/User')

module.exports = {
    async update(req, res) {
        const { first_name, last_name } = req.body;
        const user = await User.findOne({ _id: req.user._id })

        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return res.json({ user })
    },

    async uploadPhoto(req, res) {
        const file = req.file.gCloudFile
        const user = await User.findOne({ _id: req.user._id })
    
        const url = `https://storage.googleapis.com/${file.bucket}/${file.name}`
        user.picture_url = url
        user.save()
        return res.json({ user })
    }
}