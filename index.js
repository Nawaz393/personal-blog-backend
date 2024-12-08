const express = require('express')
const cors = require('cors')
const apiRouter = require('./routes')

const mongoose = require('mongoose')
require("dotenv").config()
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use("/api", apiRouter)
mongoose.connect(process.env.DB_URL).then(() => console.log("connected to db")).catch(err => console.log(err))
app.listen(port, () => console.log(`app listening on port ${port}!`))


