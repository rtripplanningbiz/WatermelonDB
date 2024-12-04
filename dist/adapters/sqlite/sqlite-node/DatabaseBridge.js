"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _DatabaseDriver = _interopRequireDefault(require("./DatabaseDriver"));
var DatabaseBridge = /*#__PURE__*/function () {
  function DatabaseBridge() {
    this.connections = {};
  }
  var _proto = DatabaseBridge.prototype;
  // MARK: - Asynchronous connections
  _proto.connected = function (tag, driver) {
    this.connections[tag] = {
      driver: driver,
      queue: [],
      status: 'connected'
    };
  };
  _proto.waiting = function (tag, driver) {
    this.connections[tag] = {
      driver: driver,
      queue: [],
      status: 'waiting'
    };
  };
  _proto.initialize = function (tag, databaseName, schemaVersion, resolve, reject) {
    var driver;
    try {
      this.assertNoConnection(tag);
      driver = new _DatabaseDriver.default();
      driver.initialize(databaseName, schemaVersion);
      this.connected(tag, driver);
      resolve({
        code: 'ok'
      });
    } catch (error) {
      if (driver && 'SchemaNeededError' === error.type) {
        this.waiting(tag, driver);
        resolve({
          code: 'schema_needed'
        });
      } else if (driver && 'MigrationNeededError' === error.type) {
        this.waiting(tag, driver);
        resolve({
          code: 'migrations_needed',
          databaseVersion: error.databaseVersion
        });
      } else {
        this.sendReject(reject, error, 'initialize');
      }
    }
  };
  _proto.setUpWithSchema = function (tag, databaseName, schema, schemaVersion, resolve) {
    var driver = new _DatabaseDriver.default();
    driver.setUpWithSchema(databaseName, schema, schemaVersion);
    this.connectDriverAsync(tag, driver);
    resolve(true);
  };
  _proto.setUpWithMigrations = function (tag, databaseName, migrations, fromVersion, toVersion, resolve, reject) {
    try {
      var _driver = new _DatabaseDriver.default();
      _driver.setUpWithMigrations(databaseName, {
        from: fromVersion,
        to: toVersion,
        sql: migrations
      });
      this.connectDriverAsync(tag, _driver);
      resolve(true);
    } catch (error) {
      this.disconnectDriver(tag);
      this.sendReject(reject, error, 'setUpWithMigrations');
    }
  }

  // MARK: - Asynchronous actions
  ;
  _proto.find = function (tag, table, id, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'find', function (driver) {
      return driver.find(table, id);
    });
  };
  _proto.query = function (tag, table, _query, args, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'query', function (driver) {
      return driver.cachedQuery(table, _query, args);
    });
  };
  _proto.queryIds = function (tag, query, args, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'queryIds', function (driver) {
      return driver.queryIds(query, args);
    });
  };
  _proto.unsafeQueryRaw = function (tag, query, args, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'unsafeQueryRaw', function (driver) {
      return driver.unsafeQueryRaw(query, args);
    });
  };
  _proto.count = function (tag, query, args, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'count', function (driver) {
      return driver.count(query, args);
    });
  };
  _proto.batch = function (tag, operations, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'batch', function (driver) {
      return driver.batch(operations);
    });
  };
  _proto.unsafeResetDatabase = function (tag, schema, schemaVersion, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'unsafeResetDatabase', function (driver) {
      return driver.unsafeResetDatabase({
        version: schemaVersion,
        sql: schema
      });
    });
  };
  _proto.getLocal = function (tag, key, resolve, reject) {
    this.withDriver(tag, resolve, reject, 'getLocal', function (driver) {
      return driver.getLocal(key);
    });
  }

  // MARK: - Helpers
  ;
  _proto.withDriver = function (tag, resolve, reject, functionName, action) {
    var _this = this;
    try {
      var connection = this.connections[tag];
      if (!connection) {
        throw new Error("No driver for with tag ".concat(tag, " available"));
      }
      if ('connected' === connection.status) {
        var result = action(connection.driver);
        resolve(result);
      } else if ('waiting' === connection.status) {
        // consoleLog('Operation for driver (tagID) enqueued')
        // try again when driver is ready
        connection.queue.push(function () {
          _this.withDriver(tag, resolve, reject, functionName, action);
        });
      }
    } catch (error) {
      this.sendReject(reject, error, functionName);
    }
  };
  _proto.connectDriverAsync = function (tag, driver) {
    var {
      queue = []
    } = this.connections[tag];
    this.connections[tag] = {
      driver: driver,
      queue: [],
      status: 'connected'
    };
    queue.forEach(function (operation) {
      return operation();
    });
  };
  _proto.disconnectDriver = function (tag) {
    var {
      queue = []
    } = this.connections[tag];
    delete this.connections[tag];
    queue.forEach(function (operation) {
      return operation();
    });
  };
  _proto.assertNoConnection = function (tag) {
    if (this.connections[tag]) {
      throw new Error("A driver with tag ".concat(tag, " already set up"));
    }
  };
  _proto.sendReject = function (reject, error, functionName) {
    if (reject) {
      reject("db.".concat(functionName, ".error"), error.message, error);
    } else {
      throw new Error("db.".concat(functionName, " missing reject (").concat(error.message, ")"));
    }
  };
  return DatabaseBridge;
}();
var databaseBridge = new DatabaseBridge();
var _default = exports.default = databaseBridge;