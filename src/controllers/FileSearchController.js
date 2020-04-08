const File = require('../Models/File')

module.exports = {
    async search(req, res) {
        const user = req.user
        const { name, type } = req.query;

        const file = await File.find({
            "author_id": user._id,
            "originalname": {
                $in: new RegExp(name)
            },
            
            "type": {
                $in: new RegExp(type)
            }
        })

        return res.json(file)
    },
}