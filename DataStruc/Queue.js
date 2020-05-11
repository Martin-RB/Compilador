"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = /** @class */ (function () {
    function Queue() {
        this._array = [];
    }
    Queue.prototype.push = function (element) {
        this._array = [element].concat(this._array);
    };
    Queue.prototype.pop = function () {
        return this._array.pop();
    };
    Queue.prototype.peek = function () {
        return this._array[this._array.length - 1];
    };
    Queue.prototype.isEmpty = function () {
        return this._array.length == 0;
    };
    Queue.prototype.clear = function () {
        this._array = [];
    };
    return Queue;
}());
exports.Queue = Queue;
