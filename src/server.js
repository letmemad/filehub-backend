const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const cors = require('cors')
const { errors } = require('celebrate')

// App config
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    // origin: process.env.FRONT_URL
}))
app.use(errors())
env.config()

// Route
app.use('/', require('./routes'))

// Initialize database
mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    // Initialize the app
    app.listen(process.env.PORT || 3333, () => console.log('SERVER STARTED'))
})
