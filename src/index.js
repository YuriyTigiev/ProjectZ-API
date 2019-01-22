import '@babel/polyfill'
import express from 'express'
import express_graphql from 'express-graphql'
import mongoose from 'mongoose'
import schema from './graphql/schema'
import jwt from 'jsonwebtoken'
import cors from 'cors'
require('dotenv').config()
const app = express()

// Env variables
const SECRET = process.env.SECRET
const DBUSER = process.env.DB_USER
const DBPWD = process.env.DB_PASSWORD
const DBURL = process.env.DB_URL
const PORT = process.env.PORT || 4000

mongoose.connect(
  `mongodb://${DBUSER}:${DBPWD}@${DBURL}`,
  { useNewUrlParser: true }
)
mongoose.set('useCreateIndex', true)

mongoose.connection.once('open', () => {
  console.log('Database successfully connected')
})

const tradeTokenForUser = async (req) => {
  let authToken = null
  let user = null

  try {
    authToken = req.headers['authorization']

    if (authToken) {
      user = await jwt.verify(authToken, SECRET)
    }
  } catch (e) {
    console.warn(`Unable to authenticate using auth token: ${authToken}`)
  }

  return { user: user }
}

app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(
  '/graphql',
  express_graphql(async (req) => ({
    schema,
    context: await tradeTokenForUser(req),
    graphiql: true
  }))
)

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`)
})
