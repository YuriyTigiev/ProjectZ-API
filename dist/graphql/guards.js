"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticated = void 0;

var _errors = require("./errors");

const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new _errors.AuthorizationError();
  }

  return next(root, args, context, info);
};

exports.authenticated = authenticated;