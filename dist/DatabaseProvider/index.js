"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.withDatabase = exports.DatabaseProvider = exports.DatabaseContext = exports.DatabaseConsumer = void 0;
var _withDatabase = _interopRequireDefault(require("../react/withDatabase"));
exports.withDatabase = _withDatabase.default;
var _DatabaseContext = _interopRequireWildcard(require("../react/DatabaseContext"));
exports.DatabaseContext = _DatabaseContext.default;
exports.DatabaseConsumer = _DatabaseContext.DatabaseConsumer;
var _DatabaseProvider = _interopRequireDefault(require("../react/DatabaseProvider"));
exports.DatabaseProvider = _DatabaseProvider.default;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }