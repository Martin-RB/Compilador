"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("./DataStruc/HashMap");
var Tuple_1 = require("./DataStruc/Tuple");
var Stack_1 = require("./DataStruc/Stack");
// COlumnas: Nombre, tipo, scope, valor(es), length
var PROY_FINAL;
(function (PROY_FINAL) {
    var Mem = /** @class */ (function () {
        function Mem() {
        }
        Mem.request = function () {
            this.memIdx += 1;
            return this.memIdx;
        };
        Mem.memIdx = 0;
        return Mem;
    }());
    var YYKontext = /** @class */ (function () {
        function YYKontext() {
            var _this = this;
            this.state = "global";
            this.squats = new Array();
            /*Nombre, tipo, scope, length, val*/
            //varTable : HashMap<Tuple<string, string, string, string /**Puesto de manera auxiliar */, any | HashMap<any> | undefined>> = new HashMap<Tuple<string, string, string, string, any | HashMap<any> | undefined>>();
            this.varTable = new HashMap_1.HashMap();
            this.qb = new HashMap_1.HashMap();
            this.pileVals = new Stack_1.Stack();
            this.pileOps = new Stack_1.Stack();
            this.pileJump = new Stack_1.Stack();
            this.pileFromTo = new Stack_1.Stack();
            this.pileType = new Stack_1.Stack();
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
                _this.varTable.set(name, { name: name, type: type, scope: scope, dimSize: dimSize, dir: undefined });
            };
            this.addVariablesToTable = function (names, type, scope, dimSizes) {
                for (var i = 0; i < names.length; i++) {
                    var name_1 = names[i];
                    var dimSize = dimSizes[i];
                    _this.varTable.set(name_1, { name: name_1, type: type, scope: scope, dimSize: dimSize, dir: undefined });
                }
            };
            this.setVariableDir = function (name, idx) {
            };
            /* 		getLastValue = () => {
                        return this.pileVals.pop();
                    } */
            this.checkOperation = function (opType) {
                console.log("*********" + opType);
                _this.pileOps.print();
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
                    console.log("Not identified");
                }
            };
            this.pushVal = function (value) {
                var name = "";
                if (typeof value == "object") {
                    name = value.n;
                }
                else if (typeof value == "string") {
                    name = value;
                }
                console.log("PUSHED", name);
                _this.pileVals.push(name);
            };
            this.endOperation = function () {
                console.log("ENDED:");
                console.log("---");
                _this.pileOps.print();
                _this.pileVals.print();
                console.log("---");
                console.log(_this.pileVals.pop());
            };
            this.pushOp = function (op) {
                console.log("PUSHED", op);
                _this.pileOps.push(op);
            };
            this.fromToComp = function (v1, v2) {
                _this.pushVal(v1);
                _this.pushVal(v2);
                _this.pushOp("<=");
                _this.checkOperation("3");
            };
            this.fromToSum = function (summableVar) {
                var name = "";
                if (typeof summableVar == "object") {
                    name = summableVar.n;
                }
                else if (typeof summableVar == "string") {
                    name = summableVar;
                }
                _this.pushVal(name);
                _this.pileType.push(_this.getVariableType(name));
                _this.pushOp("=");
                _this.pushVal(name);
                _this.pileType.push(_this.getVariableType(name));
                _this.pushVal("1");
                _this.pileType.push("int");
                _this.pushOp("+");
                _this.checkOperation("2");
                _this.checkOperation("0");
            };
            this.fromToEndProc = function () {
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
                console.log("eValue", eValue);
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
                console.log(name);
                var variable = _this.varTable.get(name);
                if (!variable) {
                    throw "Variable " + name + " no existente";
                }
                return variable.type;
            };
            this.pushType = function (type) {
                console.log("PUSHED type: " + type);
                _this.pileType.push(type);
                console.log("Types:");
                _this.pileType.print();
            };
            this.decisionCheck = function () {
                console.log("Types:");
                _this.pileType.print();
                var t = _this.pileType.pop();
                if (t != "bool") {
                    throw "Tipo " + t + " no esperado. Se esperaba 'bool'";
                }
            };
            this.dimidTypeCheck = function () {
                var t = _this.pileType.pop();
                if (t != "int") {
                    throw "Tipo " + t + " no esperado. Se esperaba 'int'";
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
            var _a, _b;
            this.pileOps.pop();
            this.pileVals.print();
            console.log("Types:");
            this.pileType.print();
            console.log("**********");
            var operator = op;
            var rightOnd = this.pileVals.pop();
            var leftOnd = this.pileVals.pop();
            if (!rightOnd || !leftOnd)
                throw "Error de valores: Cantidad de valores incorrecta";
            console.log(JSON.stringify(this.pileType.peek()));
            var rightType = this.pileType.pop();
            console.log(this.pileType.peek());
            var leftType = this.pileType.pop();
            if (!rightType || !leftType)
                throw "Error de tipos: Cantidad de tipos incorrecta";
            var typeResult = (_b = (_a = this.qb.get(leftType)) === null || _a === void 0 ? void 0 : _a.get(rightType)) === null || _b === void 0 ? void 0 : _b.get(op);
            if (!typeResult || typeResult == "NOP")
                throw "Error de tipos:  " + leftOnd + ":" + leftType + " " + op + " " + rightOnd + rightType + " es incompatible";
            this.pushType(typeResult);
            console.log("Types:");
            this.pileType.print();
            if (!vAssign) {
                var memSpace = "*" + Mem.request().toString();
                console.log("ADDED QUAD: " + operator + ", " + leftOnd + ", " + rightOnd + ", " + memSpace);
                this.squats.push(new Tuple_1.Tuple(operator, leftOnd, rightOnd, memSpace));
                this.pileVals.push(memSpace);
                console.log("\n\n\n\n\n\n");
            }
            else {
                console.log("ADDED QUAD: " + operator + ", " + rightOnd + ", _, " + leftOnd);
                this.squats.push(new Tuple_1.Tuple(operator, rightOnd, "", leftOnd));
                this.pileVals.push(leftOnd);
                console.log("\n\n\n\n\n\n");
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
                ["(\\!\\=|\\=\\=|\\<|\\>|\\>\\=|\\<\\=)", "return 'op_t3';"],
                ["\\=", "return 'eq';"],
                ["[a-zA-Z_$]\\w*", "return 'id';"],
                ["\\s+", ""],
            ]
        },
        "bnf": {
            "S": [["init_prgr id e_stmt SS", "yy.addVariableToTable($2, `void`, `global`, `1`);"]],
            "SS": ["VG FD M"],
            "M": ["main_f s_par e_par VG B"],
            "B": ["s_bck ST e_bck"],
            "VG": [["var_dec TD", 'yy.addFromString($2, yy.state); yy.state = `local`;'], ["", ""]],
            "TD": [["var_type definer TDL1 e_stmt TDR", "$$ = [{t:$1, vs:$3}].concat($5);"]],
            "TDR": [["TD", "$$ = $1"], ["", "$$ = undefined"]],
            "TDL1": [["DIMID TDL2", "$$ = [$1].concat($2); yy.pileType.pop();"]],
            "TDL2": [["separ DIMID TDL2", "$$ = [$2].concat($3); yy.pileType.pop();"], ["", '']],
            "FD": [["FD_DEC_R VG B FD", ""], ["", ""]],
            "FD_DEC_R": [["func FTYPE id s_par PDL1 e_par e_stmt", "yy.addVariableToTable($3, $2, `global`, `1`)"]],
            "PDL1": ["var_type id PDL2", ""],
            "PDL2": ["separ var_type id PDL2", ""],
            "ST": ["STDEF ST", ""],
            /**/ "STDEF": [["ASI e_stmt", "yy.pileType.pop();"], ["CALL e_stmt", ""], ["RET e_stmt", ""], ["REE e_stmt", ""], ["WRT e_stmt", ""], ["DEC", ""], ["REP", ""]],
            "CALL": [["id s_par CALA e_par", "$$ = $1;"]],
            "CALA": [["XP0 CALA2", "yy.pileType.pop(); console.log(`ñññ`); console.log('Types:');yy.pileType.print();"], ["", ""]],
            "CALA2": [["separ XP0 CALA2", "yy.pileType.pop();"], ["", ""]],
            "ASI": [["ASI_DIMID_R ASI_EQ_R XP0", "yy.pushVal($3); yy.checkOperation(0); $$ = yy.pileVals.pop();"]],
            "ASI_DIMID_R": [["DIMID", 'yy.pushVal($1); console.log("rrr"); yy.pushType(yy.getVariableType($1.n));']],
            "ASI_EQ_R": [["eq", 'yy.pushOp($1)']],
            /**/ "ASI_": [["ASI_DIMID_R ASI_EQ_R", ''], ["", '']],
            "RET": ["ret s_par XP0 e_par"],
            "REE": ["read s_par DIMID REE_ e_par"],
            "REE_": ["separ DIMID REE_", ""],
            "WRT": ["write s_par WL e_par"],
            "WL": ["W_C WL1"],
            "WL1": ["separ W_C WL1", ""],
            "W_C": ["STR", "XP0"],
            "DEC": [["if s_par DEC_XP0_R e_par then DEC_B_R ELSE", 'yy.resolveJump()']],
            /**/ "DEC_XP0_R": [["XP0", "yy.decisionCheck(); yy.addJumpF($1);"]],
            "DEC_B_R": [["B", '']],
            "ELSE": ["ELSE_ELSE_R ELSE_B_R", ""],
            "ELSE_B_R": [["B", '']],
            "ELSE_ELSE_R": [["else", 'yy.elseIntersectionProc()']],
            "REP": ["COND", "NCOND"],
            "COND": ["COND_WHILE_R s_par COND_XP0_R e_par do COND_B_R"],
            /**/ "COND_WHILE_R": [["while", "yy.addJumpSavepoint();"]],
            /**/ "COND_XP0_R": [["XP0", "console.log('v', $1);yy.addJumpF($1); yy.pileVals.pop(); yy.pileType.pop()"]],
            /**/ "COND_B_R": [["B", "yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true);"]],
            "NCOND": [["from NCOND_P1_R dof B", "yy.fromToSum(yy.pileFromTo.pop()); yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true)"]],
            /**/ "NCOND_P1_R": [["ASI to XP0", "yy.pileFromTo.push($1); yy.addJumpSavepoint(); yy.fromToComp($1, $3); yy.addJumpF(yy.pileVals.pop())"]],
            "DIMID": [["id DIMID_", '$$ = {n:$1, d:$2}; console.log("DIMID", $$)']],
            /**/ "DIMID_": [["DIMID_S_CORCH_R XP0 DIMID_E_CORCH_R", '$$ = $2; yy.dimidTypeCheck(); console.log("DIMID_", $$)'], ["", '']],
            "DIMID_S_CORCH_R": [["s_corch", 'yy.pushCorchState();']],
            "DIMID_E_CORCH_R": [["e_corch", 'yy.popCorchState();']],
            /**/ "XP0": [["XP1 XP0_", "$$ = yy.pileVals.peek(); yy.endOperation();"]],
            /**/ "XP0_": [["R_OP_T4 XP1 XP0_", "$$ = $2; console.log('first', $1, $2, yy.pileVals.peek());"], ["", "console.log('end');"]],
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
            "XP4": [["XPP", "$$ = $1; yy.pushVal($1);"], ["DIMID", "$$ = $1; yy.pushVal($$); yy.pushType(yy.getVariableType($1.n))"], ["CALL", "$$ = $1; yy.pushVal($1); yy.pushType(yy.getVariableType($1));"], ["char", "$$ = $1; yy.pushVal($1); yy.pushType(`char`);"], ["INTEGER", "$$ = $1; yy.pushVal($1); yy.pushType(`int`);"], ["FLOAT", "$$ = $1;yy.pushVal($1); yy.pushType(`float`);"]],
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
    console.log(p.parse("\n\t\t\tprograma XD; \n\t\t\tvar int: a[(1+2)-3],b,c; float: r;\n\t\t\t%% AASDASD\n\t\t\t\n\t\t\tfuncion bool getAll();\n\t\t\t{\n\t\t\t\ta = 1;\n\t\t\t}\n\n\t\t\tfuncion int holas(int X, float y, char a123123);\n\t\t\t\tvar char: x,y,z[12];\n\t\t\t{\n\t\t\t\tholas(1,2,3);\n\t\t\t\ta = 123;\n\t\t\t\tb = 2;\n\t\t\t\tc = 123 - 1;\n\t\t\t\tsi (a == b) entonces {\n\t\t\t\t\tmientras(a[1] == 123 || a[3] > 3 && getAll()) haz\n\t\t\t\t\t{\n\t\t\t\t\t\tc[5] = -123.0123e5621 + a[4];\n\t\t\t\t\t}\n\t\t\t\t\ta = a * b;\n\t\t\t\t} sino {\n\t\t\t\t\tdesde a = 5 hasta 41 hacer\n\t\t\t\t\t{\n\t\t\t\t\t\ta = 7 + 4 * 47;\n\t\t\t\t\t}\n\t\t\t\t\tb= 123;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tprincipal ()\n\t\t\tvar float:hg,q;\n\t\t\t{\n\t\t\t\ta = 0 + 5;\n\n\t\t\t\tdesde hg = 5 hasta 41 hacer\n\t\t\t\t{\n\t\t\t\t\thg = 7 + 4 * 47;\n\t\t\t\t}\n\t\t\t\tq= 123;\n\t\t\t}\n\t".replace("\t", "")));
    console.log(p.yy.printQuads());
    p.yy.varTable.print();
    p.yy.pileType.print();
    //p.yy.varTable.print();
    //p.yy.pileVals.print();
})(PROY_FINAL = exports.PROY_FINAL || (exports.PROY_FINAL = {}));
