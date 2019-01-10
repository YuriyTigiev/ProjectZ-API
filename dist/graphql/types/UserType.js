"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

const UserType = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: _graphql.GraphQLID
    },
    email: {
      type: _graphql.GraphQLString
    },
    password: {
      type: _graphql.GraphQLString
    },
    steamURL: {
      type: _graphql.GraphQLString
    },
    blizzardURL: {
      type: _graphql.GraphQLString
    }
  })
});
var _default = UserType;
exports.default = _default;