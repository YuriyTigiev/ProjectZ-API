"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _guards = require("../guards");

var _UserModel = _interopRequireDefault(require("../../models/UserModel"));

var _UserType = _interopRequireDefault(require("../types/UserType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const RootQuery = new _graphql.GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: _UserType.default,
      resolve: async (root, args, {
        user
      }) => await _UserModel.default.findOne({
        id: user.id
      })
    },
    users: {
      type: new _graphql.GraphQLList(_UserType.default),
      resolve: (0, _guards.authenticated)(async () => await _UserModel.default.find({}))
    }
  }
});
const Mutation = new _graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: _UserType.default,
      args: {
        email: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        },
        password: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        },
        steamURL: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        },
        blizzardURL: {
          type: _graphql.GraphQLString
        }
      },
      resolve: async (root, args) => {
        args.password = await _bcrypt.default.hash(args.password, 12);
        let {
          email,
          password,
          steamURL,
          blizzardURL
        } = args;
        let user = await new _UserModel.default({
          email,
          password,
          steamURL,
          blizzardURL: blizzardURL || ''
        });
        console.log('User registered : ', user);
        return await user.save();
      }
    },
    login: {
      type: _graphql.GraphQLString,
      args: {
        email: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        },
        password: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        }
      },
      resolve: async (root, {
        email,
        password
      }) => {
        const user = await _UserModel.default.findOne({
          email
        });
        if (!user) throw new Error('No user with that email');
        const valid = await _bcrypt.default.compare(password, user.password);
        if (!valid) throw new Error('Incorrect password');
        const {
          id
        } = user;

        const token = _jsonwebtoken.default.sign({
          user: {
            id,
            email
          }
        }, process.env.SECRET, {
          expiresIn: '1d'
        });

        return token;
      }
    }
  }
});

var _default = new _graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

exports.default = _default;