"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("../DataStruc/HashMap");
var Stack_1 = require("../DataStruc/Stack");
var Context = /** @class */ (function () {
    function Context(IP) {
        if (IP === void 0) { IP = 0; }
        this.Mem = new HashMap_1.HashMap();
        this.IP = IP;
    }
    return Context;
}());
exports.Context = Context;
var KapussinoVirtualMachine = /** @class */ (function () {
    function KapussinoVirtualMachine(quads, funcTable, constantMemory) {
        this._constantUnderLimit = 0;
        this._quads = quads;
        this._funcTable = funcTable;
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
        this._ctxt = new Context();
        this._funcPile = new Stack_1.Stack();
    }
    KapussinoVirtualMachine.prototype.resolve = function () {
        while (this._ctxt.IP < this._quads.length) {
            var el = this._quads[this._ctxt.IP];
            this.resolveIt(el);
        }
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
        var next;
        this._ctxt.IP += 1;
        switch (row.v1) {
            case "=":
                origin = this.resolvePointer(row.v2);
                destiny = this.resolvePointer(row.v4);
                data = this.getMemoryContent(origin);
                this._ctxt.Mem.set(destiny, data);
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
                this._ctxt.Mem.set(destiny, data);
                break;
            case "-":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) -
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 + ond2;
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case "*":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) *
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 + ond2;
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case "/":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) /
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 + ond2;
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case ">":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) >
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 > ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                console.log(">>> " + ond1 + " > " + ond2 + " = " + data);
                this._ctxt.Mem.set(destiny, data);
                break;
            case "WRITE":
                var dat = this.getMemoryContent(this.resolvePointer(row.v4));
                console.log(dat);
                break;
            case "JUMP":
                next = this.getInt(row.v4);
                if (!next)
                    throw "Error: JUMP fuera de los limites";
                this._ctxt.IP = next;
                break;
            case "JUMPF":
                if (this.getMemoryContent(this.resolvePointer(row.v2))
                    == "false") {
                    next = this.getInt(row.v4);
                    if (!next)
                        throw "Error: JUMP fuera de los limites";
                    this._ctxt.IP = next;
                }
                break;
            case "GOSUB":
                this._funcPile.push(this._funcTable.get(row.v4).id);
                var ctxt = new Context(this._funcTable.get(row.v4).ip);
                ctxt.SonCtxt = this._ctxt;
                this._ctxt = ctxt;
                break;
            case "ENDFUNCTION":
                var pile = this._funcPile.pop();
                if (pile) {
                    var func = this._funcTable.get(pile);
                    var dir = func.value;
                    this._ctxt.SonCtxt.Mem.set(dir, this._ctxt.Mem.get(dir));
                }
                if (this._ctxt.SonCtxt) {
                    this._ctxt = this._ctxt.SonCtxt;
                }
                break;
            default:
                break;
        }
    };
    KapussinoVirtualMachine.prototype.resolvePointer = function (dir) {
        if (dir[0] == "*") {
            return this._ctxt.Mem.get(dir.slice(1));
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
            data = this._ctxt.Mem.get(dir);
        }
        return data;
    };
    return KapussinoVirtualMachine;
}());
exports.KapussinoVirtualMachine = KapussinoVirtualMachine;
