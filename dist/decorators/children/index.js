"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _makeDecorator = _interopRequireDefault(require("../../utils/common/makeDecorator"));
var _logError = _interopRequireDefault(require("../../utils/common/logError"));
var _invariant = _interopRequireDefault(require("../../utils/common/invariant"));
var Q = _interopRequireWildcard(require("../../QueryDescription"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Defines a model property that queries records that *belong_to* this model
// Pass name of the table with desired records. (The model defining a @children property must
// have a has_many association defined with this table)
//
// Example: a Task has_many Comments, so it may define:
//   @children('comment') comments: Query<Comment>
var children = (0, _makeDecorator.default)(function (childTable) {
  return function () {
    return {
      get: function () {
        // $FlowFixMe
        var that = this;
        // Use cached Query if possible
        that._childrenQueryCache = that._childrenQueryCache || {};
        var cachedQuery = that._childrenQueryCache[childTable];
        if (cachedQuery) {
          return cachedQuery;
        }

        // Cache new Query
        var model = that.asModel;
        var childCollection = model.collections.get(childTable);
        var association = model.constructor.associations[childTable];
        (0, _invariant.default)(association && 'has_many' === association.type, "@children decorator used for a table that's not has_many");
        var query = childCollection.query(Q.where(association.foreignKey, model.id));
        that._childrenQueryCache[childTable] = query;
        return query;
      },
      set: function () {
        (0, _logError.default)('Setter called on a @children-marked property');
      }
    };
  };
});
var _default = exports.default = children;