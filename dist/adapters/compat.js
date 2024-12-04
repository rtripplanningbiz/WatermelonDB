"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Result = require("../utils/fp/Result");
var DatabaseAdapterCompat = exports.default = /*#__PURE__*/function () {
  function DatabaseAdapterCompat(adapter) {
    this.underlyingAdapter = adapter;
  }
  var _proto = DatabaseAdapterCompat.prototype;
  _proto.find = function (table, id) {
    var _this = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this.underlyingAdapter.find(table, id, callback);
    });
  };
  _proto.query = function (_query) {
    var _this2 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this2.underlyingAdapter.query(_query, callback);
    });
  };
  _proto.queryIds = function (query) {
    var _this3 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this3.underlyingAdapter.queryIds(query, callback);
    });
  };
  _proto.unsafeQueryRaw = function (query) {
    var _this4 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this4.underlyingAdapter.unsafeQueryRaw(query, callback);
    });
  };
  _proto.count = function (query) {
    var _this5 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this5.underlyingAdapter.count(query, callback);
    });
  };
  _proto.batch = function (operations) {
    var _this6 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this6.underlyingAdapter.batch(operations, callback);
    });
  };
  _proto.getDeletedRecords = function (tableName) {
    var _this7 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this7.underlyingAdapter.getDeletedRecords(tableName, callback);
    });
  };
  _proto.destroyDeletedRecords = function (tableName, recordIds) {
    var _this8 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this8.underlyingAdapter.destroyDeletedRecords(tableName, recordIds, callback);
    });
  };
  _proto.unsafeLoadFromSync = function (jsonId) {
    var _this9 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this9.underlyingAdapter.unsafeLoadFromSync(jsonId, callback);
    });
  };
  _proto.provideSyncJson = function (id, syncPullResultJson) {
    var _this10 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this10.underlyingAdapter.provideSyncJson(id, syncPullResultJson, callback);
    });
  };
  _proto.unsafeResetDatabase = function () {
    var _this11 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this11.underlyingAdapter.unsafeResetDatabase(callback);
    });
  };
  _proto.unsafeExecute = function (work) {
    var _this12 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this12.underlyingAdapter.unsafeExecute(work, callback);
    });
  };
  _proto.getLocal = function (key) {
    var _this13 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this13.underlyingAdapter.getLocal(key, callback);
    });
  };
  _proto.setLocal = function (key, value) {
    var _this14 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this14.underlyingAdapter.setLocal(key, value, callback);
    });
  };
  _proto.removeLocal = function (key) {
    var _this15 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this15.underlyingAdapter.removeLocal(key, callback);
    });
  }

  // untyped - test-only code
  ;
  _proto.testClone = function (options) {
    return new Promise(function ($return, $error) {
      return Promise.resolve(this.underlyingAdapter.testClone(options)).then(function ($await_1) {
        try {
          // $FlowFixMe
          return $return(new DatabaseAdapterCompat($await_1));
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }, $error);
    }.bind(this));
  };
  return (0, _createClass2.default)(DatabaseAdapterCompat, [{
    key: "schema",
    get: function get() {
      return this.underlyingAdapter.schema;
    }
  }, {
    key: "dbName",
    get: function get() {
      return this.underlyingAdapter.dbName;
    }
  }, {
    key: "migrations",
    get: function get() {
      return this.underlyingAdapter.migrations;
    }
  }]);
}();