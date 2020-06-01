"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KapussinoVirtualMachine = /** @class */ (function () {
    function KapussinoVirtualMachine(quads, funcTable) {
        this._quads = quads;
        this._funcTable = funcTable;
    }
    KapussinoVirtualMachine.prototype.resolve = function () {
        var _this = this;
        this._quads.forEach(function (el) {
            _this.resolveIt(el);
        });
    };
    KapussinoVirtualMachine.prototype.resolveIt = function (row) {
        switch (row.v1) {
            case "WRITE":
                console.log(row.v4);
                break;
            default:
                break;
        }
    };
    return KapussinoVirtualMachine;
}());
exports.KapussinoVirtualMachine = KapussinoVirtualMachine;
