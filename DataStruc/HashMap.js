"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tuple_1 = require("./Tuple");
var HashMap = /** @class */ (function () {
    function HashMap() {
        this._array = [];
    }
    HashMap.prototype.get = function (key) {
        for (var i = 0; i < this._array.length; i++) {
            var el = this._array[i];
            if (el.v1 == key) {
                return el.v2;
            }
        }
        return undefined;
    };
    HashMap.prototype.set = function (key, value) {
        for (var i = 0; i < this._array.length; i++) {
            var el = this._array[i];
            if (el.v1 == key) {
                el.v2 = value;
                return;
            }
        }
        this._array.push(new Tuple_1.Tuple(key, value));
    };
    /**
     * exist
     */
    HashMap.prototype.exist = function (key) {
        for (var i = 0; i < this._array.length; i++) {
            var el = this._array[i];
            if (el.v1 == key) {
                return true;
            }
        }
        return false;
    };
    HashMap.prototype.print = function () {
        this._array.forEach(function (el) {
            el.print();
        });
    };
    HashMap.prototype.buildFromJSON = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                if (typeof element == "object") {
                    var actual = new HashMap();
                    actual.buildFromJSON(element);
                    this._array.push(new Tuple_1.Tuple(key, actual));
                }
                else {
                    this._array.push(new Tuple_1.Tuple(key, element));
                }
            }
        }
    };
    return HashMap;
}());
exports.HashMap = HashMap;
