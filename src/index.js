require('dotenv').config()
import express from 'express'
const app = express()
import express_graphql from 'express-graphql'
import mongoose from 'mongoose'
import schema from './graphql/schema'
import jwt from 'jsonwebtoken'

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
  let authToken = null;
  let user = null;

  try {
    authToken = req.headers['authorization'];

    if (authToken) {
      user = await jwt.verify(authToken, SECRET);
    }
  } catch (e) {
    console.warn(`Unable to authenticate using auth token: ${authToken}`);
  }

  return { user: user }
}

app.use(
  '/graphql',
  express_graphql(async req => ({
    schema,
    context: await tradeTokenForUser(req),
    graphiql: true
  }))
)

app.listen(4000, () => {
  console.log(`Express listening on port ${PORT}`)
})
