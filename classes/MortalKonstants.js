"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("../DataStruc/HashMap");
// Constant's memory
var MortalKonstants = /** @class */ (function () {
    function MortalKonstants(offset, size) {
        this._constants = offset;
        this._max = size;
        this._registered = new HashMap_1.HashMap();
        this._dirRelation = new HashMap_1.HashMap();
    }
    MortalKonstants.prototype.request = function (constant) {
        var val = this._registered.get(constant);
        if (!val) {
            var mem = this.getNewMemory();
            this._registered.set(constant, mem);
            this._dirRelation.set(mem.toString(), constant);
            val = this._registered.get(constant);
        }
        return "" + val;
    };
    MortalKonstants.prototype.getFromDir = function (dir) {
        return this._dirRelation.get(dir);
    };
    MortalKonstants.prototype.getMax = function () {
        return this._max;
    };
    MortalKonstants.prototype.getNewMemory = function () {
        var num = this._constants;
        this._constants++;
        if (this._constants >= this._max) {
            throw "Sobrecarga de memoria para enteros";
        }
        return num;
    };
    return MortalKonstants;
}());
exports.MortalKonstants = MortalKonstants;
