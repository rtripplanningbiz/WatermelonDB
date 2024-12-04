"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _invariant = _interopRequireDefault(require("../utils/common/invariant"));
var _publishReplayLatestWhileConnected = _interopRequireDefault(require("../utils/rx/publishReplayLatestWhileConnected"));
var _lazy = _interopRequireDefault(require("../decorators/lazy"));
var _helpers = require("./helpers");
var _class, _descriptor, _Relation;
// Defines a one-to-one relation between two Models (two tables in db)
// Do not create this object directly! Use `relation` or `immutableRelation` decorators instead
var Relation = exports.default = (_class = (_Relation = /*#__PURE__*/function () {
  function Relation(model, relationTableName, columnName, options) {
    (0, _initializerDefineProperty2.default)(this, "_cachedObservable", _descriptor, this);
    this._model = model;
    this._relationTableName = relationTableName;
    this._columnName = columnName;
    this._isImmutable = options.isImmutable;
  }
  var _proto = Relation.prototype;
  _proto.fetch = function () {
    var {
      id: id
    } = this;
    if (id) {
      return this._model.collections.get(this._relationTableName).find(id);
    }
    return Promise.resolve(null);
  };
  _proto.then = function (onFulfill, onReject) {
    // $FlowFixMe
    return this.fetch().then(onFulfill, onReject);
  };
  _proto.set = function (record) {
    this.id = null === record || void 0 === record ? void 0 : record.id;
  };
  _proto.observe = function () {
    return this._cachedObservable;
  };
  return (0, _createClass2.default)(Relation, [{
    key: "id",
    get: function get() {
      return this._model._getRaw(this._columnName);
    },
    set: function set(newId) {
      if (this._isImmutable) {
        (0, _invariant.default)('create' === this._model._preparedState, "Cannot change property marked as @immutableRelation ".concat(Object.getPrototypeOf(this._model).constructor.name, " - ").concat(this._columnName));
      }
      this._model._setRaw(this._columnName, newId || null);
    }
  }]);
}(), _Relation._wmelonTag = 'relation', _Relation), _descriptor = (0, _applyDecoratedDescriptor2.default)(_class.prototype, "_cachedObservable", [_lazy.default], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _helpers.createObservable)(this).pipe(_publishReplayLatestWhileConnected.default).refCount();
  }
}), _class);