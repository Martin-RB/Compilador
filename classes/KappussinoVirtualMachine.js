"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("../DataStruc/HashMap");
var Stack_1 = require("../DataStruc/Stack");
var Context = /** @class */ (function () {
    function Context(IP, mem) {
        if (IP === void 0) { IP = 0; }
        if (mem === void 0) { mem = new HashMap_1.HashMap(); }
        this.Mem = mem;
        this.IP = IP;
    }
    return Context;
}());
exports.Context = Context;
var KapussinoVirtualMachine = /** @class */ (function () {
    function KapussinoVirtualMachine(quads, funcTable, constantMemory) {
        this._constantUnderLimit = 0;
        this._isDebug = true;
        this._quads = quads;
        this._funcTable = funcTable;
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
        this._ctxt = new Context();
        this._funcPile = new Stack_1.Stack();
        this._contextPile = new Stack_1.Stack();
    }
    KapussinoVirtualMachine.prototype.resolve = function () {
        var _this = this;
        if (this._ctxt.IP < this._quads.length)
            setTimeout(function () {
                ;
                _this.resolveIter(_this._ctxt.IP);
                _this.resolve();
            }, 1);
    };
    KapussinoVirtualMachine.prototype.resolveIter = function (ip) {
        var el = this._quads[ip];
        this.resolveIt(el);
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
        this.debug("IP:", this._ctxt.IP);
        this._ctxt.IP += 1;
        switch (row.v1) {
            case "=":
                origin = this.resolvePointer(row.v2);
                destiny = this.resolvePointer(row.v4);
                data = this.getMemoryContent(origin);
                this.debug(">>> " + destiny + " = " + data + ": " + origin);
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
                this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " + " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                this._ctxt.Mem.set(destiny, data);
                this.debug(">>> " + data);
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
                this._ctxt.Mem.set(destiny, data);
                break;
            case "<":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) <
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 < ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case ">=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) >=
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 >= ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case "<=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) <=
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 <= ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " <= " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                this._ctxt.Mem.set(destiny, data);
                break;
            case "==":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) ==
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 == ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case "!=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3));
                destiny = this.resolvePointer(row.v4);
                isNumber = this.isNumber(ond1) &&
                    this.isNumber(ond2);
                if (isNumber) {
                    data = this.getNumber(ond1) !=
                        this.getNumber(ond2);
                }
                else {
                    data = ond1 != ond2;
                }
                if (data) {
                    data = "true";
                }
                else {
                    data = "false";
                }
                this._ctxt.Mem.set(destiny, data);
                break;
            case "WRITE":
                var dat = this.getMemoryContent(this.resolvePointer(row.v4));
                console.log("===PROGRAM SAYS", dat);
                break;
            case "JUMP":
                next = this.getInt(row.v4);
                this.debug(">>> DETECTADO JUMP. SALTANDO A " + next);
                if (!next)
                    throw "Error: JUMP fuera de los limites";
                this._ctxt.IP = next;
                break;
            case "JUMPF":
                if (this.getMemoryContent(this.resolvePointer(row.v2))
                    == "false") {
                    next = this.getInt(row.v4);
                    this.debug(">>> DETECTADO FALSE. SALTANDO A " + next);
                    if (!next)
                        throw "Error: JUMP fuera de los limites";
                    this._ctxt.IP = next;
                }
                break;
            case "ERA":
                this._funcPile.push(this._funcTable.get(row.v4).id);
                this._contextPile.push(new Context(this._funcTable.get(row.v4).ip));
                break;
            case "PARAM":
                var func = this._funcTable.get(this._funcPile.peek());
                this._contextPile.peek().Mem.set(func.args[parseInt(row.v4)].dir, this.getMemoryContent(this.resolvePointer(row.v2)));
                break;
            case "GOSUB":
                this._contextPile.peek().SonCtxt = this._ctxt;
                this._ctxt = this._contextPile.pop();
                break;
            case "ENDFUNCTION":
                var pile = this._funcPile.pop();
                if (pile) {
                    var func_1 = this._funcTable.get(pile);
                    var dir = func_1.value;
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
    KapussinoVirtualMachine.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._isDebug)
            console.log.apply(console, args);
    };
    return KapussinoVirtualMachine;
}());
exports.KapussinoVirtualMachine = KapussinoVirtualMachine;
