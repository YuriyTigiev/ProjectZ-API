"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloErrors = require("apollo-errors");

const errors = {
  AuthorizationError: (0, _apolloErrors.createError)('AuthorizationError', {
    message: 'You are not authorized here'
  })
};
var _default = errors;
exports.default = _default;