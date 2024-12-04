"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.tableSchema = exports.tableName = exports.localStorageKey = exports.columnName = exports.associations = exports.appSchema = exports.Relation = exports.Query = exports.Q = exports.Model = exports.Database = exports.Collection = void 0;
var Q = _interopRequireWildcard(require("./QueryDescription"));
exports.Q = Q;
var _Collection = _interopRequireDefault(require("./Collection"));
exports.Collection = _Collection.default;
var _Database = _interopRequireDefault(require("./Database"));
exports.Database = _Database.default;
var _Relation = _interopRequireDefault(require("./Relation"));
exports.Relation = _Relation.default;
var _Model = _interopRequireWildcard(require("./Model"));
exports.Model = _Model.default;
exports.associations = _Model.associations;
var _Query = _interopRequireDefault(require("./Query"));
exports.Query = _Query.default;
var _Schema = require("./Schema");
exports.tableName = _Schema.tableName;
exports.columnName = _Schema.columnName;
exports.appSchema = _Schema.appSchema;
exports.tableSchema = _Schema.tableSchema;
var _LocalStorage = require("./Database/LocalStorage");
exports.localStorageKey = _LocalStorage.localStorageKey;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }