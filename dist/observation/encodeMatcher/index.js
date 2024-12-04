"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = encodeMatcher;
var _allPass = _interopRequireDefault(require("../../utils/fp/allPass"));
var _anyPass = _interopRequireDefault(require("../../utils/fp/anyPass"));
var _invariant = _interopRequireDefault(require("../../utils/common/invariant"));
var _operators = _interopRequireDefault(require("./operators"));
var _canEncode = _interopRequireWildcard(require("./canEncode"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
var encodeWhereDescription = function (description) {
  return function (rawRecord) {
    var left = rawRecord[description.left];
    var {
      comparison: comparison
    } = description;
    var operator = _operators.default[comparison.operator];
    var compRight = comparison.right;
    var right;

    // TODO: What about `undefined`s ?
    if (compRight.value !== undefined) {
      right = compRight.value;
    } else if (compRight.values) {
      right = compRight.values;
    } else if (compRight.column) {
      right = rawRecord[compRight.column];
    } else {
      throw new Error('Invalid comparisonRight');
    }
    return operator(left, right);
  };
};
var _encodeWhere = function (where) {
  switch (where.type) {
    case 'where':
      return encodeWhereDescription(where);
    case 'and':
      return (0, _allPass.default)(where.conditions.map(_encodeWhere));
    case 'or':
      return (0, _anyPass.default)(where.conditions.map(_encodeWhere));
    case 'on':
      throw new Error('Illegal Q.on found -- nested Q.ons require explicit Q.experimentalJoinTables declaration');
    default:
      throw new Error("Illegal clause ".concat(where.type));
  }
};
var encodeConditions = function (conditions) {
  return (0, _allPass.default)(conditions.map(_encodeWhere));
};
function encodeMatcher(query) {
  (0, _invariant.default)((0, _canEncode.default)(query), _canEncode.forbiddenError);
  return encodeConditions(query.where);
}