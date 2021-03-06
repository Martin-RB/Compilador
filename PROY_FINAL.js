"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("./DataStruc/HashMap");
var Tuple_1 = require("./DataStruc/Tuple");
var Stack_1 = require("./DataStruc/Stack");
var FuncTable_1 = require("./classes/FuncTable");
var MortalKonstants_1 = require("./classes/MortalKonstants");
var KappussinoVirtualMachine_1 = require("./classes/KappussinoVirtualMachine");
// COlumnas: Nombre, tipo, scope, valor(es), length
var PROY_FINAL;
(function (PROY_FINAL) {
    var MemoryChunk = /** @class */ (function () {
        function MemoryChunk(initialOffset, totalSize) {
            this._integer = 0;
            this._float = 0;
            this._char = 0;
            this._bool = 0;
            this._void = 0;
            this._initialOffset = initialOffset;
            this._sizePerSection = totalSize / 4;
        }
        MemoryChunk.prototype.requestInteger = function (size) {
            var num = this._integer;
            this._integer += size;
            if (this._integer >= this._sizePerSection) {
                throw "Error: Sobrecarga de memoria para enteros";
            }
            return this._initialOffset + num;
        };
        MemoryChunk.prototype.requestFloat = function (size) {
            var num = this._float;
            this._float += size;
            if (this._float >= this._sizePerSection) {
                throw "Error: Sobrecarga de memoria para flotantes";
            }
            return this._initialOffset + num + this._sizePerSection;
        };
        MemoryChunk.prototype.requestChar = function (size) {
            var num = this._char;
            this._char += size;
            if (this._char >= this._sizePerSection) {
                throw "Error: Sobrecarga de memoria para caracteres";
            }
            return this._initialOffset + num + this._sizePerSection * 2;
        };
        MemoryChunk.prototype.requestBool = function (size) {
            var num = this._bool;
            this._bool += size;
            if (this._bool >= this._sizePerSection) {
                throw "Error: Sobrecarga de memoria para boleanos";
            }
            return this._initialOffset + num + this._sizePerSection * 3;
        };
        MemoryChunk.prototype.requestVoid = function (size) {
            var num = this._void;
            this._void += size;
            if (this._void >= this._sizePerSection) {
                throw "Error: Sobrecarga de memoria para void";
            }
            return this._initialOffset + num + this._sizePerSection * 4;
        };
        MemoryChunk.prototype.getMemoryUsed = function () {
            return this._integer + this._float + this._char + this._bool;
        };
        return MemoryChunk;
    }());
    var Memory = /** @class */ (function () {
        function Memory(initialOffset, localSize, tempSize) {
            this._initialOffset = initialOffset;
            this._localSize = localSize;
            this._tempSize = tempSize;
            this._local = new MemoryChunk(initialOffset, localSize);
            this._temp = new MemoryChunk(initialOffset + localSize, tempSize);
            this._father = null;
        }
        Memory.prototype.setFather = function (father) {
            this._father = father;
        };
        Memory.prototype.getFather = function () {
            if (this._father)
                return this._father;
            else
                return null;
        };
        Memory.prototype.getMemoryUsed = function (type) {
            switch (type) {
                case Memory.TEMP_MEM:
                    return this._temp.getMemoryUsed();
            }
        };
        Memory.prototype.requestMemory = function (location, type, size) {
            if (location == Memory.LOCAL_MEM) {
                return "" + this.getFromTypeAndChunk(this._local, type, size);
            }
            else if (location == Memory.TEMP_MEM) {
                // + _localSize to set offset
                return "" + (this.getFromTypeAndChunk(this._temp, type, size) + this._localSize);
            }
            else if (location == Memory.GLOBAL_MEM) {
                if (this._father != null) {
                    return this._father.requestMemory(Memory.GLOBAL_MEM, type, size);
                }
                else {
                    return "" + this.getFromTypeAndChunk(this._local, type, size);
                }
            }
            else {
                throw "UNRECOGNIZED MEMORY LOCATION REQUEST: " + location;
            }
        };
        Memory.prototype.getFromTypeAndChunk = function (chunk, type, size) {
            switch (type) {
                case Memory.INTEGER:
                    return chunk.requestInteger(size);
                case Memory.FLOAT:
                    return chunk.requestFloat(size);
                case Memory.CHAR:
                    return chunk.requestChar(size);
                case Memory.BOOL:
                    return chunk.requestBool(size);
                case Memory.VOID:
                    return chunk.requestVoid(size);
                default:
                    throw "NOT DETECTED TYPE";
            }
        };
        Memory.prototype.getNextFree = function () {
            return this._initialOffset + this._localSize + this._tempSize;
        };
        Memory.LOCAL_MEM = 0;
        Memory.TEMP_MEM = 1;
        Memory.GLOBAL_MEM = 2;
        Memory.INTEGER = 10;
        Memory.FLOAT = 11;
        Memory.CHAR = 12;
        Memory.BOOL = 13;
        Memory.VOID = 14;
        return Memory;
    }());
    var VarTable = /** @class */ (function (_super) {
        __extends(VarTable, _super);
        function VarTable() {
            var _this = _super.call(this) || this;
            _this._fatherTable = null;
            return _this;
        }
        VarTable.prototype.setFatherTable = function (fatherTable) {
            this._fatherTable = fatherTable;
        };
        VarTable.prototype.getFatherTable = function () {
            if (this._fatherTable)
                return this._fatherTable;
            else
                return null;
        };
        VarTable.prototype.get = function (key) {
            for (var i = 0; i < this._array.length; i++) {
                var el = this._array[i];
                if (el.v1 == key) {
                    return el.v2;
                }
            }
            var father = this.getFatherTable();
            if (father) {
                return father.get(key);
            }
            return undefined;
        };
        VarTable.prototype.exist = function (key) {
            for (var i = 0; i < this._array.length; i++) {
                var el = this._array[i];
                if (el.v1 == key) {
                    return true;
                }
            }
            var father = this.getFatherTable();
            if (father) {
                return father.exist(key);
            }
            return false;
        };
        return VarTable;
    }(HashMap_1.HashMap));
    var YYKontext = /** @class */ (function () {
        function YYKontext() {
            var _this = this;
            this.state = "global";
            this.squats = new Array();
            /*Nombre, tipo, scope, length, val*/
            //varTable : HashMap<Tuple<string, string, string, string /**Puesto de manera auxiliar */, any | HashMap<any> | undefined>> = new HashMap<Tuple<string, string, string, string, any | HashMap<any> | undefined>>();
            //varTable = new HashMap<vTableRow>();
            this.varTable = new VarTable();
            this.funcTable = new FuncTable_1.FuncTable();
            this.memGVarSize = 5000;
            this.memGTempSize = 10000;
            this.memGConstSize = 5000;
            this.constantsMemory = new MortalKonstants_1.MortalKonstants(0, this.memGConstSize);
            this.actualMemory = new Memory(this.memGConstSize, this.memGVarSize, this.memGTempSize);
            this.actualFunction = null;
            this.qb = new HashMap_1.HashMap();
            this.pileVals = new Stack_1.Stack();
            this.pileOps = new Stack_1.Stack();
            this.pileJump = new Stack_1.Stack();
            this.pileFromTo = new Stack_1.Stack();
            this.pileFromToType = new Stack_1.Stack();
            this.pileType = new Stack_1.Stack();
            this.pileFunc = new Stack_1.Stack();
            // [["type", [["var1", "dimention"], [var2, dimention]], [type, []]]
            this.addFromString = function (array, state) {
                array.forEach(function (t) {
                    if (!t)
                        return;
                    var type = t.t;
                    t.vs.forEach(function (v) {
                        if (!v)
                            return;
                        _this.addVariableToTable(v.n, type, state, v.d);
                    });
                });
            };
            this.pushCorchState = function () {
                _this.pileOps.push(";C;");
                _this.pileVals.push(";C;");
            };
            this.popCorchState = function () {
                var ops = _this.pileOps.peek() != ";C;";
                var vals = _this.pileVals.peek() != ";C;";
                if (ops || vals) {
                    throw new Error("CORCH ENDED UNEXPECTEDLY");
                }
                _this.pileOps.pop();
                _this.pileVals.pop();
            };
            this.pushFuncState = function () {
                _this.pileOps.push(";F;");
                _this.pileVals.push(";F;");
            };
            this.popFuncState = function () {
                var ops = _this.pileOps.peek() != ";F;";
                var vals = _this.pileVals.peek() != ";F;";
                if (ops || vals) {
                    throw new Error("FUNCTION ARG ENDED UNEXPECTEDLY");
                }
                _this.pileOps.pop();
                _this.pileVals.pop();
            };
            this.pushParthState = function () {
                _this.pileOps.push(";P;");
                _this.pileVals.push(";P;");
            };
            this.popParthState = function () {
                var ops = _this.pileOps.peek() != ";P;";
                var vals = _this.pileVals.peek() != ";P;";
                if (ops || vals) {
                    throw new Error("PARENTHESIS ENDED UNEXPECTEDLY");
                }
                _this.pileOps.pop();
                _this.pileVals.pop();
            };
            this.addVariableToTable = function (name, type, scope, dimSize) {
                if (!dimSize)
                    dimSize = "1";
                _this.varTable.set(name, { name: name, type: type, scope: scope, dimSize: dimSize, dir: _this.actualMemory.requestMemory(Memory.LOCAL_MEM, _this.getMemoryType(type), parseInt(dimSize)) });
            };
            this.setVariableDir = function (name, idx) {
            };
            this.functionAddArgs = function (args) {
                var actualID = _this.pileFunc.peek();
                if (!actualID)
                    throw "ERROR: NO PROPER FUNCTION STABLISMENT";
                var r = _this.funcTable.get(actualID);
                if (!r)
                    throw "No se encontró la función especificada: " + actualID;
                r.args = args;
                for (var i = 0; i < r.args.length; i++) {
                    var arg = r.args[i];
                    arg.dir = _this.actualMemory.requestMemory(Memory.LOCAL_MEM, _this.getMemoryType(arg.type), 1);
                    var variable = { name: arg.name, dimSize: "1",
                        dir: arg.dir, scope: "local", type: arg.type };
                    _this.varTable.set(arg.name, variable);
                }
            };
            this.functionProc = function (id, type) {
                _this.pileFunc.push(id);
                _this.actualFunction = id;
                var mem = _this.actualMemory.requestMemory(Memory.LOCAL_MEM, _this.getMemoryType(type), 1);
                var r = { id: id, args: [], type: type,
                    ip: undefined, numLocalVars: undefined,
                    numTempVars: undefined, value: mem, k: 0 };
                _this.funcTable.set(id, r);
                if (type != "void") {
                    var memory = _this.actualMemory
                        .requestMemory(Memory.GLOBAL_MEM, _this.getMemoryType(type), 1);
                    _this.varTable.set(id, { name: id, dimSize: "1",
                        dir: memory, scope: "global", type: type });
                }
                var newVarTable = new VarTable();
                newVarTable.setFatherTable(_this.varTable);
                _this.varTable = newVarTable;
                var offset = _this.actualMemory.getNextFree();
                var newMemory = new Memory(offset, _this.memGVarSize / 2, _this.memGTempSize / 2);
                newMemory.setFather(_this.actualMemory);
                _this.actualMemory = newMemory;
            };
            this.setLocalVarNumber = function () {
                if (!_this.actualFunction)
                    throw "NO FUNCTION";
                var actualFunc = _this.funcTable.get(_this.actualFunction);
                var declaredVars = _this.varTable._array.length;
                var argNumber = actualFunc.args.length;
                _this.funcTable.get(_this.actualFunction).numLocalVars =
                    declaredVars - argNumber;
                _this.funcTable.get(_this.actualFunction).ip = _this.squats.length;
            };
            this.endFuncProc = function () {
                var used = _this.actualMemory.getMemoryUsed(Memory.TEMP_MEM);
                if (!_this.actualFunction)
                    throw "NO FUNCTION";
                var actualFunc = _this.funcTable.get(_this.actualFunction);
                actualFunc.numTempVars = used;
                var fatherMem = _this.actualMemory.getFather();
                if (fatherMem != null)
                    _this.actualMemory = fatherMem;
                else
                    throw "INNER: NO FATHER MEMORY";
                var fatherVarTable = _this.varTable.getFatherTable();
                if (fatherVarTable != null)
                    _this.varTable = fatherVarTable;
                else
                    throw "INNER: NO FATHER VAR TABLE";
                _this.squats.push(new Tuple_1.Tuple("ENDFUNCTION", "", "", ""));
            };
            /* 		getLastValue = () => {
                        return this.pileVals.pop();
                    } */
            this.checkOperation = function (opType) {
                var op = _this.pileOps.peek();
                if (opType == "0") {
                    while (op == "=") {
                        _this.addQuaddProc(op, true);
                        op = _this.pileOps.peek();
                    }
                }
                else if (opType == "1") {
                    if (op == "*" || op == "/") {
                        _this.addQuaddProc(op);
                    }
                }
                else if (opType == "2") {
                    if (op == "-" || op == "+") {
                        _this.addQuaddProc(op);
                    }
                }
                else if (opType == "3") {
                    if (op == "<" || op == ">" || op == "<=" || op == ">=" || op == "==" || op == "!=") {
                        _this.addQuaddProc(op);
                    }
                }
                else if (opType == "4") {
                    if (op == "||" || op == "&&") {
                        _this.addQuaddProc(op);
                    }
                }
                else {
                    throw "Error: Operando " + op + " no identificado";
                }
            };
            this.pushVal = function (value) {
                var name = "";
                if (typeof value == "object") {
                    name = value.n;
                }
                else {
                    name = value;
                }
                _this.pileVals.push(name);
            };
            this.getKnstSavedMemory = function (konstant) {
                var mem = _this.constantsMemory.request(konstant);
                return mem;
            };
            this.getVarSavedMemory = function (id, dim) {
                var _a;
                if (!_this.varTable.exist(id)) {
                    throw "Error: Variable " + id + " no declarada";
                }
                var varr = _this.varTable.get(id);
                var dir = varr.dir;
                if (varr.dimSize != "1") {
                    if (dim == undefined)
                        throw "Error: Debes especificar la dimension de la variable " + varr.name;
                    var typeDim = _this.pileType.pop();
                    if (!typeDim || (typeDim != "int" && typeDim != "float"))
                        throw "Error: Valor de dimensión no es entero o flotante";
                    _this.squats.push(new Tuple_1.Tuple("VERFY", dim, _this.constantsMemory.request("0"), _this.constantsMemory.request(varr.dimSize)));
                    var memSpace = (_a = _this.actualMemory.requestMemory(Memory.TEMP_MEM, _this.getMemoryType("int"), 1)) === null || _a === void 0 ? void 0 : _a.toString();
                    _this.squats.push(new Tuple_1.Tuple("+", _this.constantsMemory.request(dir), dim, memSpace));
                    _this.pileVals.push("*" + memSpace);
                    _this.pushType("int");
                    var type = _this.pileType.pop();
                    if (!(type == "int" || type == "float"))
                        throw "Error: Valor de dimensión no es entero o flotante";
                    dir = _this.pileVals.pop();
                }
                return dir;
            };
            this.getFuncSavedMemory = function (id) {
                if (!_this.funcTable.exist(id)) {
                    throw "Error: Función " + id + " no declarada";
                }
                var func = _this.funcTable.get(id);
                var mem = _this.actualMemory.requestMemory(Memory.GLOBAL_MEM, _this.getMemoryType(func.type), 1);
                _this.squats.push(new Tuple_1.Tuple("=", func.value, "_", mem));
                return mem;
            };
            this.endOperation = function () {
                _this.pileVals.pop();
            };
            this.pushOp = function (op) {
                _this.pileOps.push(op);
            };
            this.fromToComp = function (v1, v2) {
                _this.pushVal(v1);
                _this.pushVal(v2);
                _this.pushOp("<=");
                _this.checkOperation("3");
                _this.pileType.pop();
            };
            this.fromToSum = function () {
                var varDir = _this.pileFromTo.pop();
                var varType = _this.pileFromToType.pop();
                if (varDir == undefined || varType == undefined) {
                    throw "Error: Procedimiento 'de ... hasta' require una variable valida.";
                }
                _this.pileVals.push(varDir);
                _this.pileType.push(varType);
                _this.pushOp("=");
                _this.pileVals.push(varDir);
                _this.pileType.push(varType);
                _this.pileVals.push(_this.constantsMemory.request("1"));
                _this.pileType.push("int");
                _this.pushOp("+");
                _this.checkOperation("2");
                _this.checkOperation("0");
                _this.pileType.pop();
            };
            this.fromToEndProc = function () {
            };
            this.callFunction_start = function (id) {
                if (!_this.funcTable.exist(id)) {
                    throw "Función " + id + " no declarada";
                }
                _this.pileFunc.push(id);
                _this.funcTable.get(id).k = 0;
                _this.squats.push(new Tuple_1.Tuple("ERA", "", "", id));
            };
            this.callFunction_pushParam = function (dir, type) {
                var id = _this.pileFunc.peek();
                if (!id) {
                    throw "Llamada función sin nombre";
                }
                if (!_this.funcTable.exist(id)) {
                    throw "Función " + id + " no declarada";
                }
                var func = _this.funcTable.get(id);
                var arg = func.args[func.k];
                if (arg && arg.type == type) {
                    _this.squats.push(new Tuple_1.Tuple("PARAM", dir, "_", func.k.toString()));
                }
                else {
                    throw "Incompatible type " + type + " on " + func.k + " parameter at function " + id;
                }
                func.k++;
            };
            this.callFunction_end = function () {
                var id = _this.pileFunc.peek();
                if (!id) {
                    throw "Llamada función sin nombre";
                }
                if (!_this.funcTable.exist(id)) {
                    throw "Función " + id + " no declarada";
                }
                var func = _this.funcTable.get(id);
                if (func.args.length != func.k) {
                    throw "Numero incorrecto de parametros. Se pusieron " + func.k + ", se esperaban " + func.args.length + ".";
                }
                _this.squats.push(new Tuple_1.Tuple("GOSUB", "", "", _this.pileFunc.pop()));
                _this.pileType.push(func.type);
                return id;
            };
            this.setWriteProc = function (ids) {
                ids.forEach(function (el) {
                    _this.squats.push(new Tuple_1.Tuple("WRITE", "_", "_", el));
                });
            };
            this.setReadProc = function (ids) {
                ids.forEach(function (el) {
                    _this.squats.push(new Tuple_1.Tuple("READ", "_", "_", el));
                });
            };
            this.functionReturnProc = function (value, type) {
                var id = _this.pileFunc.peek();
                if (!id)
                    throw "No hay función a la cual asignar 'regresa'";
                var func = _this.funcTable.get(id);
                if (!func)
                    throw "No hay funci\u00F3n declarada llamada '" + id + "'";
                if (func.type != type)
                    throw "Se ha regresado un tipo '" + type + "' en la funci\u00F3n '" + id + "' de tipo '" + func.type + "'.";
                _this.squats.push(new Tuple_1.Tuple("=", value, "", func.value));
                _this.squats.push(new Tuple_1.Tuple("ENDFUNCTION", "", "", ""));
            };
            this.addJumpT = function (eValue, destiny) {
                var _dest = "_";
                if (destiny) {
                    _dest = _this.pileJump.pop();
                }
                _this.squats.push(new Tuple_1.Tuple("JUMPT", eValue, "", _dest));
                if (!destiny) {
                    _this.pileJump.push((_this.squats.length - 1).toString());
                }
            };
            this.addJumpF = function (eValue, destiny) {
                var _dest = "_";
                if (destiny) {
                    _dest = _this.pileJump.pop();
                }
                _this.squats.push(new Tuple_1.Tuple("JUMPF", eValue, "", _dest));
                if (!destiny) {
                    _this.pileJump.push((_this.squats.length - 1).toString());
                }
            };
            this.addJump = function (dontAwait) {
                var _dest = "_";
                if (dontAwait) {
                    _dest = _this.pileJump.pop();
                }
                _this.squats.push(new Tuple_1.Tuple("JUMP", "", "", _dest));
                if (!dontAwait) {
                    _this.pileJump.push((_this.squats.length - 1).toString());
                }
            };
            this.addJumpSavepoint = function () {
                _this.pileJump.push((_this.squats.length).toString());
            };
            this.resolveJump = function (customIdx, destiny) {
                var idx;
                if (!customIdx) {
                    var jump = _this.pileJump.pop();
                    if (!jump)
                        throw new Error("NO JUMPS IN STACK");
                    idx = parseInt(jump);
                }
                else {
                    idx = customIdx;
                }
                if (destiny) {
                    _this.squats[idx].v4 = destiny.toString();
                }
                else {
                    _this.squats[idx].v4 = _this.squats.length.toString();
                }
            };
            this.elseIntersectionProc = function () {
                var idxFix = _this.pileJump.pop();
                if (!idxFix)
                    throw new Error("NO JUMPS IN STACK");
                _this.addJump();
                _this.resolveJump(parseInt(idxFix));
            };
            this.getVariableType = function (name) {
                var variable = _this.varTable.get(name);
                if (!variable) {
                    throw "Variable " + name + " no existente";
                }
                return variable.type;
            };
            this.getFunctionType = function (name) {
                var func = _this.funcTable.get(name);
                if (!func) {
                    throw "Funci\u00F3n " + name + " no existente";
                }
                return func.type;
            };
            this.pushType = function (type) {
                _this.pileType.push(type);
            };
            this.decisionCheck = function () {
                var t = _this.pileType.pop();
                if (t != "bool") {
                    throw "Tipo " + t + " no esperado. Se esperaba 'bool'";
                }
            };
            this.printQuads = function () {
                _this.squats.forEach(function (el, i) {
                    console.log(i + ": " + el.v1 + "\t" + el.v2 + "\t" + el.v3 + "\t" + el.v4 + ";");
                });
            };
            this.setQB = function () {
                var r = new HashMap_1.HashMap();
                var XD = {
                    "int": {
                        "int": {
                            "+": "int",
                            "-": "int",
                            "*": "float",
                            "/": "float",
                            "<": "bool",
                            ">": "bool",
                            "<=": "bool",
                            ">=": "bool",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "int"
                        },
                        "float": {
                            "+": "float",
                            "-": "float",
                            "*": "float",
                            "/": "float",
                            "<": "bool",
                            ">": "bool",
                            "<=": "bool",
                            ">=": "bool",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "int"
                        },
                        "char": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "NOP"
                        },
                        "bool": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "NOP"
                        },
                        "void": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "NOP"
                        },
                    },
                    "float": {
                        "int": {
                            "+": "float",
                            "-": "float",
                            "*": "float",
                            "/": "float",
                            "<": "bool",
                            ">": "bool",
                            "<=": "bool",
                            ">=": "bool",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "float"
                        },
                        "float": {
                            "+": "float",
                            "-": "float",
                            "*": "float",
                            "/": "float",
                            "<": "bool",
                            ">": "bool",
                            "<=": "bool",
                            ">=": "bool",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "float"
                        },
                        "char": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "NOP"
                        },
                        "bool": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                            "=": "NOP"
                        },
                        "void": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                    },
                    "char": {
                        "int": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "float": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "char": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "bool": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "void": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                    },
                    "bool": {
                        "int": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "float": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "char": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "bool": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "bool",
                            "!=": "bool",
                            "&&": "bool",
                            "||": "bool",
                        },
                        "void": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                    },
                    "void": {
                        "int": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "float": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "char": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "bool": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                        "void": {
                            "+": "NOP",
                            "-": "NOP",
                            "*": "NOP",
                            "/": "NOP",
                            "<": "NOP",
                            ">": "NOP",
                            "<=": "NOP",
                            ">=": "NOP",
                            "==": "NOP",
                            "&&": "NOP",
                            "||": "NOP",
                        },
                    }
                };
                r.buildFromJSON(XD);
                _this.qb = r;
            };
            this.setQB();
        }
        YYKontext.prototype.addQuaddProc = function (op, vAssign) {
            if (vAssign === void 0) { vAssign = false; }
            var _a, _b, _c;
            this.pileOps.pop();
            var operator = op;
            var rightOnd = this.pileVals.pop();
            var leftOnd = this.pileVals.pop();
            if (!rightOnd || !leftOnd)
                throw "Error de valores: Cantidad de valores incorrecta";
            var rightType = this.pileType.pop();
            var leftType = this.pileType.pop();
            if (!rightType || !leftType)
                throw "Error de tipos: Cantidad de tipos incorrecta";
            var typeResult = (_b = (_a = this.qb.get(leftType)) === null || _a === void 0 ? void 0 : _a.get(rightType)) === null || _b === void 0 ? void 0 : _b.get(op);
            if (!typeResult || typeResult == "NOP")
                throw "Error de tipos:  " + leftOnd + ":" + leftType + " " + op + " " + rightOnd + rightType + " es incompatible";
            this.pushType(typeResult);
            if (!vAssign) {
                var memSpace = (_c = this.actualMemory.requestMemory(Memory.TEMP_MEM, this.getMemoryType(typeResult), 1)) === null || _c === void 0 ? void 0 : _c.toString();
                this.squats.push(new Tuple_1.Tuple(operator, leftOnd, rightOnd, memSpace));
                this.pileVals.push(memSpace);
            }
            else {
                this.squats.push(new Tuple_1.Tuple(operator, rightOnd, "", leftOnd));
                this.pileVals.push(leftOnd);
            }
        };
        YYKontext.prototype.getMemoryType = function (type) {
            switch (type) {
                case "int":
                    return Memory.INTEGER;
                case "bool":
                    return Memory.BOOL;
                case "char":
                    return Memory.CHAR;
                case "float":
                    return Memory.FLOAT;
                case "void":
                    return Memory.VOID;
                default:
                    throw "NOT RECOGNIZED TYPE" + type;
            }
        };
        return YYKontext;
    }());
    var jjson = require("jison");
    var Parser = jjson.Parser;
    var grammar = {
        "lex": {
            "rules": [
                ["programa", "return 'init_prgr';"],
                [";", "return 'e_stmt';"],
                ["'.'", "return 'char';"],
                ["\\(", "return 's_par';"],
                ["\\)", "return 'e_par';"],
                ["\\{", "return 's_bck';"],
                ["\\}", "return 'e_bck';"],
                ["%% \\w*", ""],
                ["funcion", "return 'func';"],
                ["principal", "return 'main_f';"],
                ["var", "return 'var_dec';"],
                ["(int|float|char|bool)", "return 'var_type';"],
                ["\\[", "return 's_corch';"],
                ["\\]", "return 'e_corch';"],
                [",", "return 'separ';"],
                ["\\:", "return 'definer';"],
                ["void", "return 'void';"],
                ["regresa", "return 'ret';"],
                ["lee", "return 'read';"],
                ["escribe", "return 'write';"],
                ["\\\"", "return 'comillasXD';"],
                ["entonces", "return 'then';"],
                ["'", "return 'simple_com';"],
                ["sino", "return 'else';"],
                ["si", "return 'if';"],
                ["mientras", "return 'while';"],
                ["haz", "return 'do';"],
                ["desde", "return 'from';"],
                ["hasta", "return 'to';"],
                ["hacer", "return 'dof';"],
                ["(\\+|\\-)", "return 'op_t2';"],
                ["[0-9]+\\.[0-9]+(e[0-9]+)?", "return 'float';"],
                ["[0-9]+", "return 'integer';"],
                ["(\\*|\\/)", "return 'op_t1';"],
                ["(\\&&|\\|\\|)", "return 'op_t4';"],
                ["(\\!\\=|\\=\\=|\\>\\=|\\<\\=|\\<|\\>)", "return 'op_t3';"],
                ["\\=", "return 'eq';"],
                ["[a-zA-Z_$]\\w*", "return 'id';"],
                ["\\s+", ""],
            ]
        },
        "bnf": {
            "S": [["init_prgr id e_stmt SS", "yy.addVariableToTable($2, `void`, `global`, `1`);"]],
            "SS": ["R_SS_VG R_SS_FD M"],
            /**/ "R_SS_VG": [["VG", "yy.addJump(false);"]],
            /**/ "R_SS_FD": [["FD", "yy.resolveJump();"]],
            "M": ["R_M_mainf s_par e_par VG R_M_B"],
            /**/ "R_M_mainf": [["main_f", "yy.functionProc('main', 'void');"]],
            /**/ "R_M_B": [["B", "yy.endFuncProc();"]],
            "B": ["s_bck ST e_bck"],
            /**/ "VG": [["var_dec TD", 'yy.addFromString($2, yy.state);'], ["", ""]],
            "TD": [["var_type definer TDL1 e_stmt TDR", "$$ = [{t:$1, vs:$3}].concat($5);"]],
            "TDR": [["TD", "$$ = $1"], ["", "$$ = undefined"]],
            "TDL1": [["NODIMID TDL2", "$$ = [$1].concat($2); yy.pileType.pop();"]],
            "TDL2": [["separ NODIMID TDL2", "$$ = [$2].concat($3); yy.pileType.pop();"], ["", '']],
            "FD": [["FD_DEC_R R_FD_VG R_FD_B FD", ""], ["", ""]],
            /**/ "R_FD_VG": [["VG", "yy.setLocalVarNumber();"]],
            /**/ "FD_DEC_R": [["R_DEC_func s_par R_FD_PDL1 e_par e_stmt", "yy.functionAddArgs($3);"]],
            /**/ "R_DEC_func": [["func FTYPE id", "yy.functionProc($3, $2);"]],
            /**/ "R_FD_PDL1": [["PDL1", "$$ = $1;"], ["", "$$ = [];"]],
            /**/ "R_FD_B": [["B", "yy.endFuncProc();"]],
            "PDL1": [["R_PDL1_type PDL2", "$$ = [$1].concat($2);"]],
            /**/ "R_PDL1_type": [["var_type id", "$$ = {name: $2, type: $1};"]],
            "PDL2": [["separ R_PDL1_type PDL2", "$$ = [$2].concat($3)"], ["", "$$ = [];"]],
            "ST": ["STDEF ST", ""],
            /**/ "STDEF": [["ASI e_stmt", "yy.pileType.pop();"], ["CALL e_stmt", ""], ["RET e_stmt", ""], ["REE e_stmt", ""], ["WRT e_stmt", ""], ["DEC", ""], ["REP", ""]],
            "CALL": [["R_CALL_ID R_CALL_S_PAR CALA R_CALL_E_PAR", "$$ = yy.callFunction_end();"]],
            "R_CALL_S_PAR": [["s_par", "yy.pushFuncState();"]],
            "R_CALL_E_PAR": [["e_par", "yy.popFuncState();"]],
            /**/ "R_CALL_ID": [["id", "yy.callFunction_start($1);"]],
            "CALA": [["R_CALA_XP0 CALA2", "yy.pileType.pop(); "], ["", ""]],
            "CALA2": [["separ R_CALA_XP0 CALA2", "yy.pileType.pop();"], ["", ""]],
            /**/ "R_CALA_XP0": [["XP0", "yy.callFunction_pushParam($1, yy.pileType.pop());"]],
            "ASI": [["ASI_DIMID_R ASI_EQ_R XP0", "yy.pushVal($3); yy.checkOperation(0); $$ = yy.pileVals.pop();"]],
            "ASI_DIMID_R": [["DIMID", 'yy.pushVal(yy.getVarSavedMemory($1.n, $1.d)); yy.pushType(yy.getVariableType($1.n));']],
            "ASI_EQ_R": [["eq", 'yy.pushOp($1)']],
            /**/ "ASI_": [["ASI_DIMID_R ASI_EQ_R", ''], ["", '']],
            "RET": [["RET_ s_par XP0 e_par", "yy.functionReturnProc($3, yy.pileType.pop()); "]],
            "RET_": [["ret", ""]],
            "REE": [["read s_par REE_ e_par", "yy.setReadProc($3);"]],
            /**/ "REE_": [["DIMID REE__", "$$ = [yy.getVarSavedMemory($1.n, $1.d)].concat($2);"]],
            "REE__": [["separ DIMID REE__", "$$ = [yy.getVarSavedMemory($2.n, $2.d)].concat($3);"], ["", "$$ = [];"]],
            "WRT": [["write s_par WL e_par", "yy.setWriteProc($3);"]],
            "WL": [["W_C WL1", "$$ = $1.concat($2);"]],
            "WL1": [["separ W_C WL1", "$$ = $2.concat($3);"], ["", "$$ = [];"]],
            "W_C": [["XP0", "$$ = [$1]; yy.pileType.pop()"]],
            "DEC": [["if s_par DEC_XP0_R e_par then B ELSE", 'yy.resolveJump()']],
            /**/ "DEC_XP0_R": [["XP0", "yy.decisionCheck(); yy.addJumpF($1);"]],
            /*--*/ "DEC_B_R": [["B", '']],
            "ELSE": ["ELSE_ELSE_R B", ""],
            /*--*/ "ELSE_B_R": [["B", '']],
            "ELSE_ELSE_R": [["else", 'yy.elseIntersectionProc()']],
            "REP": ["COND", "NCOND"],
            "COND": ["COND_WHILE_R s_par COND_XP0_R e_par do COND_B_R"],
            /**/ "COND_WHILE_R": [["while", "yy.addJumpSavepoint();"]],
            /**/ "COND_XP0_R": [["XP0", "yy.addJumpF($1); yy.pileVals.pop(); yy.pileType.pop()"]],
            /**/ "COND_B_R": [["B", "yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true);"]],
            "NCOND": [["from NCOND_P1_R dof B", "yy.fromToSum(); yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true)"]],
            /**/ "NCOND_P1_R": [["ASI to XP0", "yy.pileFromTo.push($1); yy.pileFromToType.push(yy.pileType.peek()); yy.addJumpSavepoint(); yy.fromToComp($1, $3); yy.addJumpF(yy.pileVals.pop()); "]],
            "DIMID": [["id DIMID_", '$$ = {n:$1, d:$2};']],
            /**/ "DIMID_": [["DIMID_S_CORCH_R XP0 DIMID_E_CORCH_R", '$$ = $2; ;'], ["", '']],
            "DIMID_S_CORCH_R": [["s_corch", 'yy.pushCorchState();']],
            "DIMID_E_CORCH_R": [["e_corch", 'yy.popCorchState();']],
            "NODIMID": [["id NODIMID_", '$$ = {n:$1, d:$2};']],
            /**/ "NODIMID_": [["s_corch INTEGER e_corch", '$$ = $2; yy.pileType.push("int")'], ["", '']],
            /**/ "XP0": [["XP1 XP0_", "$$ = yy.pileVals.peek(); yy.endOperation();"]],
            /**/ "XP0_": [["R_OP_T4 XP1 XP0_", "$$ = $2; "], ["", ""]],
            "R_OP_T4": [["op_t4", "$$ = $1; yy.pushOp($1)"]],
            "XP1": [["XP2 XP1_", "yy.checkOperation('4')"]],
            "XP1_": [["R_OP_T3 XP1", "$$ = $1 + $2;"], ["", "$$ =``;"]],
            "R_OP_T3": [["op_t3", "$$ = $1; yy.pushOp($1)"]],
            "XP2": [["XP3 XP2_", "yy.checkOperation('3')"]],
            "XP2_": [["R_OP_T2 XP2", "$$ = $1 + $2;"], ["", "$$ = ``"]],
            "R_OP_T2": [["op_t2", "$$ = $1; yy.pushOp($1)"]],
            "XP3": [["R_XP4 XP3_", "yy.checkOperation('2')"]],
            "XP3_": [["R_OP_T1 XP3", "$$ = $1 + $2;"], ["", "$$ = ``"]],
            "R_XP4": [["XP4", "yy.checkOperation('1')"]],
            "R_OP_T1": [["op_t1", "$$ = $1; yy.pushOp($1)"]],
            "XP4": [["XPP", "$$ = $1; yy.pushVal($1);"], ["DIMID", "$$ = $1; yy.pushVal(yy.getVarSavedMemory($1.n, $1.d)); yy.pushType(yy.getVariableType($1.n))"], ["CALL", "$$ = $1; yy.pushVal(yy.getFuncSavedMemory($1)); yy.pushType(yy.getFunctionType($1));"], ["char", "$$ = $1; yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`char`);"], ["INTEGER", "$$ = $1; yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`int`); "], ["FLOAT", "$$ = $1;yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`float`);"]],
            "XPP": [["XPP_S_PAR_R XP0 XPP_E_PAR_R", "$$ = $2"]],
            "XPP_S_PAR_R": [["s_par", 'yy.pushParthState();']],
            "XPP_E_PAR_R": [["e_par", 'yy.popParthState();']],
            "FTYPE": ["var_type", "void"],
            "INTEGER": [["op_t2 integer", "$$ = $1 + $2"], ["integer", "$$ = $1"]],
            "FLOAT": [["op_t2 float", "$$ = $1 + $2"], ["float", "$$ = $1"]],
        }
    };
    /**
     * TODO
     * Falta hacer que las dimensiones den la operacion en el arreglo recibido
     * Falta adaptar lo que se recibe de las reglas a lo que esta en la tabla de variables
     * Bitacora: Tarde un millon de años en saber como funcionan las reglas de bison
     * Arregle los errores de la antigua gramatica
     * Modifique las estructuras de datos a algo mas util porque necesitaba mas
     * Pase la gramatica y el lexico a computadora porque la hoja casi se me pierde
     * Me la pase buscando como poner el contexto actual con el de jison (con el yy)
     * Bitacora: Hice el diagrama visual de la gramatica con los puntos neuralgicos: https://www.lucidchart.com/invitations/accept/37bf2eb8-ff04-4caa-8572-6d12b5a26f83
     * Se hizo la tabla de variables. Algo complicado y tardo tiempo dado que el Jison
     * 	no soporta acciones entre reglas.
     *
     * Bitacora 4: Terminadas la producción de cuadruplos para estatutos lineales.
     * Se encontraron muchos errores en la producción dado que los corchetes requieren
     *  su propio separador en el stack de operadores/valores.
     * Se requirieron hacer reglas extra para hacer para poder establecer reglas.
     * Se intento hacer la estructura a=b=1+2 sin exito dado que la gramatica confunde el DIMID de la regla con el de XP0, haciendo imposible la integración
     * Se implementaron los cuadruplos del IF
     * Hay soporte para parentesis y corchetes
     *
     * Bitacora 5:
     * Terminada la producción de cuadruplos para estatutos no lineales. El desde v = n hasta r fue bastante demandante y se tuvo que agregar una pileVals
     * Falta hacer la validación de tipos y la administración de memoria
     *
     * Bitacora 6: Establecimiento de validación de tipos. OMG, esto es demasiado uwu
     *
     * Bitacora 7: Funciones ahora si funcionan
     * Fuie muy largo agregar toda la funcionalidad diseñada para las funciones pero funcionan\
     * El diseño tambien abrió muchas dudas que se resolvieron en el mismo.
     * El codigo extrañamente funciona bien con la implementación de las funciones
     * Tambien se agregó la funcionalidad de la memoria y sus espacios
     * También fue largo de implementar, especialmente porque es algo complejo
     * La memoria hace bien su trabajo. El sistema de padres establecido funciona de maravilla
     * Se ha logrado colocar los quads pero con memoria de constantes y temporales
     * Se ha logrado colocar los quads con memoria para funciones y variables de todo tipo
     * Ya funcionan los estatutos lee, escribe
     * Ya funciona el return y se asigna a la funcion correspondiente
     * Se comenzará a hacer la VM
     *
     * Bitacora final:
     * Arreglada memoria para que no tenga un asterisco. Ahora tiene 1 solo si es referencia a memoria.
     * Movida clase MortalKonstants a archivo independiente.

     */
    var p = new Parser(grammar);
    // Contexto interno
    p.yy = new YYKontext();
    /* console.log(p.parse(`
            programa XD;
            var int: a[1+2*3],b,c;float: g,f,a[(5 + 1) * 9];
            %% AASDASD

            funcion bool getAll();
            {
                a = 1;
            }

            funcion int holas(int X, float y, char a123123);
                var char: x,y,z[12];
            {
                holas(1,2,3);
                a = 123;
                b = 2;
                c = 123 - 1;
                si (a == b) entonces {
                    mientras(a[1] == 123 || a[3] > 3 && getAll()) haz
                    {
                        c[5] = -123.0123e5621 + ghg[4];
                    }
                    a = a * b;
                } sino {
                    desde g = 5 hasta 41 hacer
                    {
                        g = 7 + 4 * 47;
                    }
                    b= 'E';
                }
            }
            
            principal (){
                a = 0;
            }
    `.replace("\t", ""))); */
    /* 	console.log(p.parse(`
                programa XD;
                var int: a[3],b[1],c; float: r;
                %% AASDASD
                
                funcion bool getAll();
                {
                    a[1] = 1;
                    regresa (a[1] == 5);
                    escribe(a[0], a[1],a[2]);
                }
    
                funcion int holas(int X, float y, char a123123);
                    var char: x,y,z[12];
                {
                    holas(1,2.5,'c');
                    a[4] = 123;
                    b[1] = 2;
                    c = 123 - 1;
                    si (a[4] == b[4]) entonces {
                        mientras(a[1] == 123 || a[3] > 3 && getAll()) haz
                        {
                            c[5] = -123.0123e5621 + a[4];
                        }
                        a[4] = a[3] * b[4];
                    } sino {
                        desde a[1] = 5 hasta 41 hacer
                        {
                            a[1] = 7 + 4 * 47;
                        }
                        
                        b[0+0]= 123;
                    }
    
                    regresa (a[56]);
                }
    
                principal ()
                var float:hg,q[2],s;
                {
                    lee(hg,s,q[1]);
                    hg = 100;
                    s = 104;
    
                    a[4] = 1+1+1+1+1+1+1+1+1+1+1+1+1+1;
    
                    lee(a[2]);
                    a[3] = 0 + a[2];
    
                    holas(49,-2.25, 'a');
    
                    desde hg = 5 hasta 41 hacer
                    {
                        hg = 7 + 4 * 47;
                    }
                    q[1]= 123;
                }
        `.replace("\t", ""))); */
    /* 	console.log(p.parse(`
                programa XD;
                var int: x, y,z;
    
                funcion float holas();
                var float: v[2], r[2];
                {
                    v[0] = 0;
                    v[1] = 1;
                    r[1] = 1;
    
                    mientras (r[1] < 10) haz{
                        r[1] = r[1] + 1;
                    }
    
                    
    
                    si(v[1] > 9) entonces{
                        
                    }
                    sino{
                        
                    }
    
                    regresa (r[1]);
                }
    
                funcion float fibby(float h);
                var float: r;
                {
                    escribe(h - 1);
                    si (h == 1) entonces
                    {
                        regresa (1.0);
                    }
                    r = fibby(h - 1) * h;
                    regresa (r);
                }
                principal ()
                {
                    y = holas();
                    escribe(y);
                }
        `.replace("\t", ""))); */
    var program = "\nprograma foreveralone; \nvar\n\tint: i,j, p;\n\tfloat: Arreglo[10], OtroArreglo[10];\n\tfloat: valor;\n\nfuncion float fibby (float j);\nvar int: i; float: v;\n{\n\ti = j + (p-j*2+j);\n\tsi (j <= 1) entonces\n\t{\n\t\tregresa(j);\n\t}\n\tsino\n\t{\n\t\tregresa(j * fibby(j-1));\n\t}\n}\n\nprincipal ()\n{\n\tlee(valor);\n\tescribe(fibby(valor));\n\tescribe(1*(6+4/2)/4);\n}\n\t";
    /* 	var lexer = p.lexer, token;
        lexer.setInput(program);
        while (!lexer.done) {
            token = lexer.lex();
            if (token in p.terminals_) {
                token = p.terminals_[token];
            }
            console.log('<' + token + ', ' + lexer.yytext + '>')
        } */
    console.log(program);
    console.log(p.parse(program.replace("\t", "")));
    console.log("COMPILACIÓN");
    p.yy.printQuads();
    //p.yy.varTable.print();
    //p.yy.pileVals.print();
    console.log("EJECUCIÓN");
    var VM = new KappussinoVirtualMachine_1.KapussinoVirtualMachine(p.yy.squats, p.yy.funcTable, p.yy.constantsMemory);
    VM.resolve();
})(PROY_FINAL = exports.PROY_FINAL || (exports.PROY_FINAL = {}));
