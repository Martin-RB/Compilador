"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("../DataStruc/HashMap");
var KapussinoVirtualMachine = /** @class */ (function () {
    function KapussinoVirtualMachine(quads, funcTable, constantMemory) {
        this._constantUnderLimit = 0;
        this._quads = quads;
        this._funcTable = funcTable;
        this._mainMemory = new HashMap_1.HashMap();
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
    }
    KapussinoVirtualMachine.prototype.resolve = function () {
        var _this = this;
        this._quads.forEach(function (el) {
            _this.resolveIt(el);
        });
    };
    KapussinoVirtualMachine.prototype.isMemInsideKnstn = function (dir) {
        var memoryIndex = (dir);
        var numIdx = parseInt(memoryIndex);
        return (this._constantUnderLimit <= numIdx
            && this._constantUperLimit > numIdx);
    };
    KapussinoVirtualMachine.prototype.resolveIt = function (row) {
        var origin;
        var destiny;
        var data;
        var ond1;
        var ond2;
        var isNumber;
        switch (row.v1) {
            case "=":
                origin = this.resolvePointer(row.v2);
                destiny = this.resolvePointer(row.v4);
                console.log("origin : ", origin);
                console.log("saved on:", destiny);
                data = this.getMemoryContent(origin);
                this._mainMemory.set(destiny, data);
                break;
            case "+":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) +
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 + ond2;
                }
                console.log(ond1 + " + " + ond2);
                console.log("sum result: ", data);
                console.log("saved on:", destiny);
                this._mainMemory.set(destiny, data);
                break;
            case "-":
                ond1 = this.getMemoryContent(row.v2);
                ond2 = this.getMemoryContent(row.v3);
                destiny = row.v4;
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) -
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 + ond2;
                }
                this._mainMemory.set(destiny, data);
                break;
            case "*":
                ond1 = this.getMemoryContent(row.v2);
                ond2 = this.getMemoryContent(row.v3);
                destiny = row.v4;
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) *
                        this.getNumber(ond2);
                }
                else {
                    throw "Error: Tipos incorrectos";
                }
                this._mainMemory.set(destiny, data);
                break;
            case "/":
                ond1 = this.getMemoryContent(row.v2);
                ond2 = this.getMemoryContent(row.v3);
                destiny = row.v4;
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) /
                        this.getNumber(ond2);
                }
                else {
                    throw "Error: Tipos incorrectos";
                }
                this._mainMemory.set(destiny, data);
                break;
            case "WRITE":
                var dat = this._mainMemory.get(row.v4);
                console.log(dat);
                break;
            default:
                break;
        }
        console.log("ENDED: " + row.v1 + "\n");
    };
    KapussinoVirtualMachine.prototype.resolvePointer = function (dir) {
        if (dir[0] == "*") {
            console.log(this._mainMemory.get(dir.slice(1)));
            return this._mainMemory.get(dir.slice(1));
        }
        return dir;
    };
    KapussinoVirtualMachine.prototype.isNumber = function (v) {
        return this.isFloat(v) != undefined;
    };
    KapussinoVirtualMachine.prototype.getNumber = function (v) {
        return parseFloat(v);
    };
    KapussinoVirtualMachine.prototype.getInt = function (value) {
        var final;
        if (this.isInt(value)) {
            final = parseInt(value);
        }
        return final;
    };
    KapussinoVirtualMachine.prototype.getFloat = function (value) {
        var final;
        if (this.isFloat(value)) {
            final = parseInt(value);
        }
        return final;
    };
    KapussinoVirtualMachine.prototype.getConvertedData = function (value) {
        var final;
        if (this.isInt(value)) {
            final = parseInt(value);
        }
        else if (this.isFloat(value)) {
            final = parseFloat(value);
        }
        else {
            final = value;
        }
        return final;
    };
    KapussinoVirtualMachine.prototype.isInt = function (val) {
        var res;
        try {
            res = parseInt(val);
        }
        catch (error) {
        }
        return res != undefined;
    };
    KapussinoVirtualMachine.prototype.isFloat = function (val) {
        var res;
        try {
            res = parseFloat(val);
        }
        catch (error) {
        }
        return res != undefined;
    };
    KapussinoVirtualMachine.prototype.getMemoryContent = function (dir) {
        var data;
        if (this.isMemInsideKnstn(dir)) {
            data = this._constantMemory.getFromDir(dir);
        }
        else {
            data = this._mainMemory.get(dir);
        }
        return data;
    };
    return KapussinoVirtualMachine;
}());
exports.KapussinoVirtualMachine = KapussinoVirtualMachine;
