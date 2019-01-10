"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticated = void 0;

const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new Error(`Unauthenticated!`);
  }

  return next(root, args, context, info);
};

exports.authenticated = authenticated;