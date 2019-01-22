"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _schema = _interopRequireDefault(require("./graphql/schema"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const app = (0, _express.default)(); // Env variables

const SECRET = process.env.SECRET;
const DBUSER = process.env.DB_USER;
const DBPWD = process.env.DB_PASSWORD;
const DBURL = process.env.DB_URL;
const PORT = process.env.PORT || 4000;

_mongoose.default.connect(`mongodb://${DBUSER}:${DBPWD}@${DBURL}`, {
  useNewUrlParser: true
});

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.connection.once('open', () => {
  console.log('Database successfully connected');
});

const tradeTokenForUser = async req => {
  let authToken = null;
  let user = null;

  try {
    authToken = req.headers['authorization'];

    if (authToken) {
      user = await _jsonwebtoken.default.verify(authToken, SECRET);
    }
  } catch (e) {
    console.warn(`Unable to authenticate using auth token: ${authToken}`);
  }

  return {
    user: user
  };
};

app.use((0, _cors.default)());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/graphql', (0, _expressGraphql.default)(async req => ({
  schema: _schema.default,
  context: await tradeTokenForUser(req),
  graphiql: true
})));
app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});