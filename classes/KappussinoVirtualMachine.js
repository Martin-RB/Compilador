"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("../DataStruc/HashMap");
var Stack_1 = require("../DataStruc/Stack");
var readline_1 = require("readline");
var rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout
});
var Context = /** @class */ (function () {
    function Context(IP, mem) {
        if (IP === void 0) { IP = 0; }
        if (mem === void 0) { mem = new HashMap_1.HashMap(); }
        this.Mem = mem;
        this.IP = IP;
        this.FunctionName = "main";
    }
    return Context;
}());
exports.Context = Context;
var KapussinoVirtualMachine = /** @class */ (function () {
    function KapussinoVirtualMachine(quads, funcTable, constantMemory) {
        this._constantUnderLimit = 0;
        this._isDebug = false;
        this._functionKontext = 20000;
        this._quads = quads;
        this._funcTable = funcTable;
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
        this._ctxt = new Context();
        this._funcPile = new Stack_1.Stack();
        this._contextPile = new Stack_1.Stack();
    }
    KapussinoVirtualMachine.prototype.resolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._ctxt.IP < this._quads.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.resolveIter(this._ctxt.IP)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.awaiter(1)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    KapussinoVirtualMachine.prototype.awaiter = function (n) {
        return new Promise(function (res) {
            setTimeout(res, n);
        });
    };
    KapussinoVirtualMachine.prototype.resolveIter = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        el = this._quads[ip];
                        return [4 /*yield*/, this.resolveIt(el)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KapussinoVirtualMachine.prototype.isMemInsideKnstn = function (dir) {
        var memoryIndex = (dir);
        var numIdx = parseInt(memoryIndex);
        return (this._constantUnderLimit <= numIdx
            && this._constantUperLimit > numIdx);
    };
    KapussinoVirtualMachine.prototype.resolveIt = function (row) {
        return __awaiter(this, void 0, void 0, function () {
            var origin, destiny, data, ond1, ond2, isNumber, next, _a, dat, toWrite, _b, _c, func, pile, func_1, dir;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.debug("IP:", this._ctxt.IP);
                        this._ctxt.IP += 1;
                        _a = row.v1;
                        switch (_a) {
                            case "=": return [3 /*break*/, 1];
                            case "+": return [3 /*break*/, 2];
                            case "-": return [3 /*break*/, 3];
                            case "*": return [3 /*break*/, 4];
                            case "/": return [3 /*break*/, 5];
                            case ">": return [3 /*break*/, 6];
                            case "<": return [3 /*break*/, 7];
                            case ">=": return [3 /*break*/, 8];
                            case "<=": return [3 /*break*/, 9];
                            case "==": return [3 /*break*/, 10];
                            case "!=": return [3 /*break*/, 11];
                            case "WRITE": return [3 /*break*/, 12];
                            case "READ": return [3 /*break*/, 13];
                            case "JUMP": return [3 /*break*/, 15];
                            case "JUMPF": return [3 /*break*/, 16];
                            case "ERA": return [3 /*break*/, 17];
                            case "PARAM": return [3 /*break*/, 18];
                            case "GOSUB": return [3 /*break*/, 19];
                            case "ENDFUNCTION": return [3 /*break*/, 20];
                        }
                        return [3 /*break*/, 21];
                    case 1:
                        origin = this.resolvePointer(row.v2);
                        destiny = this.resolvePointer(row.v4);
                        data = this.getMemoryContent(origin);
                        this.debug(">>> " + destiny + " = " + data + ": " + origin);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 2:
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
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 3:
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
                        this.debug(">>> " + ond1 + ":" + this.resolvePointer(row.v2) + ":" + row.v2 + " - " + ond2 + ":" + this.resolvePointer(row.v3) + ":" + row.v3 + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 4:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " * " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 5:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " / " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 6:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " > " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 7:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " < " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 8:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " >= " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 9:
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
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 10:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " == " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 11:
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
                        this.debug(">>> " + ond1 + ": " + this.resolvePointer(row.v2) + " != " + ond2 + ": " + this.resolvePointer(row.v3) + " = " + data + ":" + destiny);
                        this.setValueOnMemory(destiny, data);
                        return [3 /*break*/, 22];
                    case 12:
                        dat = this.getMemoryContent(this.resolvePointer(row.v4));
                        console.log(">", dat);
                        return [3 /*break*/, 22];
                    case 13:
                        toWrite = this.resolvePointer(row.v4);
                        _b = this.setValueOnMemory;
                        _c = [toWrite];
                        return [4 /*yield*/, this.readLine()];
                    case 14:
                        _b.apply(this, _c.concat([_d.sent()]));
                        return [3 /*break*/, 22];
                    case 15:
                        next = this.getInt(row.v4);
                        this.debug(">>> DETECTADO JUMP. SALTANDO A " + next);
                        if (!next)
                            throw "Error: JUMP fuera de los limites";
                        this._ctxt.IP = next;
                        return [3 /*break*/, 22];
                    case 16:
                        if (this.getMemoryContent(this.resolvePointer(row.v2))
                            == "false") {
                            next = this.getInt(row.v4);
                            this.debug(">>> DETECTADO FALSE. SALTANDO A " + next);
                            if (!next)
                                throw "Error: JUMP fuera de los limites";
                            this._ctxt.IP = next;
                        }
                        return [3 /*break*/, 22];
                    case 17:
                        this._funcPile.push(this._funcTable.get(row.v4).id);
                        this._contextPile.push(new Context(this._funcTable.get(row.v4).ip));
                        this._contextPile.peek().FunctionName = row.v4;
                        this.debug(">>> Creando contexto para " + row.v4);
                        return [3 /*break*/, 22];
                    case 18:
                        func = this._funcTable.get(this._funcPile.peek());
                        this._contextPile.peek().Mem.set(func.args[parseInt(row.v4)].dir, this.getMemoryContent(this.resolvePointer(row.v2)));
                        this.debug(">>> Parametro " + row.v4 + ": " + row.v2);
                        return [3 /*break*/, 22];
                    case 19:
                        this._contextPile.peek().SonCtxt = this._ctxt;
                        this._ctxt = this._contextPile.pop();
                        this.debug(">>> Cambiando contexto a " + this._funcPile.peek() + ". Saltando a " + this._ctxt.IP);
                        return [3 /*break*/, 22];
                    case 20:
                        pile = this._funcPile.pop();
                        if (pile) {
                            func_1 = this._funcTable.get(pile);
                            dir = func_1.value;
                            this.setValueOnMemory(dir, this.getMemoryContent(dir));
                        }
                        if (this._ctxt.SonCtxt) {
                            this._ctxt = this._ctxt.SonCtxt;
                        }
                        this.debug(this._ctxt.FunctionName);
                        return [3 /*break*/, 22];
                    case 21: return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        });
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
    KapussinoVirtualMachine.prototype.setValueOnMemory = function (dir, val) {
        var ctxt;
        ctxt = this._ctxt;
        if (this._functionKontext > parseInt(dir)) {
            while (ctxt.SonCtxt != undefined) {
                ctxt = ctxt.SonCtxt;
            }
        }
        if (!ctxt)
            throw "No Context";
        ctxt.Mem.set(dir, val);
        //this.debug(`>>> Saved ${this.getMemoryContent(dir)} (${dir}) on context ${ctxt.FunctionName}`);
    };
    KapussinoVirtualMachine.prototype.getMemoryContent = function (dir) {
        var data;
        var ctxt;
        var ctxtName = "";
        if (this.isMemInsideKnstn(dir)) {
            data = this._constantMemory.getFromDir(dir);
        }
        else {
            ctxt = this._ctxt;
            do {
                if (!ctxt)
                    throw "";
                data = ctxt.Mem.get(dir);
                ctxtName = ctxt.FunctionName;
                ctxt = ctxt.SonCtxt;
            } while (data == undefined && ctxt != undefined);
        }
        //this.debug(`>>> GOT ${data} (${dir}) on context ${ctxtName}`);
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
    KapussinoVirtualMachine.prototype.readLine = function () {
        return new Promise(function (res) {
            rl.question("<", function (answ) {
                res(answ);
            });
        });
    };
    return KapussinoVirtualMachine;
}());
exports.KapussinoVirtualMachine = KapussinoVirtualMachine;
