"use strict";

exports.__esModule = true;
exports.createTimestampsFor = void 0;
exports.fetchDescendants = fetchDescendants;
var _fp = require("../utils/fp");
var Q = _interopRequireWildcard(require("../QueryDescription"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var createTimestampsFor = exports.createTimestampsFor = function (model) {
  var date = Date.now();
  var timestamps = {};
  if ('createdAt' in model) {
    timestamps.created_at = date;
  }
  if ('updatedAt' in model) {
    timestamps.updated_at = date;
  }
  return timestamps;
};
function getChildrenQueries(model) {
  var associationsList = Object.entries(model.constructor.associations);
  var hasManyAssociations = associationsList.filter(function ([, value]) {
    return 'has_many' === value.type;
  });
  var childrenQueries = hasManyAssociations.map(function ([key, value]) {
    var childCollection = model.collections.get(key);
    return childCollection.query(Q.where(value.foreignKey, model.id));
  });
  return childrenQueries;
}
function fetchDescendantsInner(model) {
  return new Promise(function ($return, $error) {
    var childPromise, childrenQueries, results;
    childPromise = function (query) {
      return new Promise(function ($return, $error) {
        var children, grandchildren;
        return Promise.resolve(query.fetch()).then(function ($await_1) {
          try {
            children = $await_1;
            return Promise.resolve((0, _fp.allPromises)(fetchDescendantsInner, children)).then(function ($await_2) {
              try {
                grandchildren = $await_2;
                return $return((0, _fp.unnest)(grandchildren).concat(children));
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }, $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      });
    };
    childrenQueries = getChildrenQueries(model);
    return Promise.resolve((0, _fp.allPromises)(childPromise, childrenQueries)).then(function ($await_3) {
      try {
        results = $await_3;
        return $return((0, _fp.unnest)(results));
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
}
function fetchDescendants(model) {
  return new Promise(function ($return, $error) {
    var descendants;
    return Promise.resolve(fetchDescendantsInner(model)).then(function ($await_4) {
      try {
        descendants = $await_4;
        // We need to deduplicate because we can have a child accessible through multiple parents
        // TODO: Use fp/unique after updating it not to suck
        return $return(Array.from(new Set(descendants)));
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
}