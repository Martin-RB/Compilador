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
            this.varTable = new HashMap_1.HashMap();
            this.pileVals = new Stack_1.Stack();
            this.pileOps = new Stack_1.Stack();
            this.pileJump = new Stack_1.Stack();
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
                _this.varTable.set(name, new Tuple_1.Tuple(name, type, scope, dimSize, undefined));
            };
            this.addVariablesToTable = function (names, type, scope, dimSizes) {
                for (var i = 0; i < names.length; i++) {
                    var name_1 = names[i];
                    var dimSize = dimSizes[i];
                    _this.varTable.set(name_1, new Tuple_1.Tuple(name_1, type, scope, dimSize, undefined));
                }
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
            this.pushVal = function (name) {
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
            this.addJumpT = function (eValue) {
                _this.squats.push(new Tuple_1.Tuple("JUMPT", eValue, "", "_"));
                _this.pileJump.push((_this.squats.length - 1).toString());
            };
            this.addJumpF = function (eValue) {
                _this.squats.push(new Tuple_1.Tuple("JUMPF", eValue, "", "_"));
                _this.pileJump.push((_this.squats.length - 1).toString());
            };
            this.addJump = function () {
                _this.squats.push(new Tuple_1.Tuple("JUMP", "", "", "_"));
                _this.pileJump.push((_this.squats.length - 1).toString());
            };
            this.resolveJump = function (customIdx) {
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
                _this.squats[idx].v4 = _this.squats.length.toString();
            };
            this.elseIntersectionProc = function () {
                var idxFix = _this.pileJump.pop();
                if (!idxFix)
                    throw new Error("NO JUMPS IN STACK");
                _this.addJump();
                _this.resolveJump(parseInt(idxFix));
            };
            this.addQuadReg = function () {
            };
        }
        YYKontext.prototype.addQuaddProc = function (op, vAssign) {
            if (vAssign === void 0) { vAssign = false; }
            this.pileOps.pop();
            this.pileVals.print();
            console.log("**********");
            var operator = op;
            var rightOnd = this.pileVals.pop();
            var leftOnd = this.pileVals.pop();
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
                ["(int|float|char)", "return 'var_type';"],
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
            "M": ["main_f s_par e_par B"],
            "B": ["s_bck ST e_bck"],
            "VG": [["var_dec TD", 'yy.addFromString($2, yy.state); yy.state = `local`;'], ["", ""]],
            "TD": [["var_type definer TDL1 e_stmt TDR", "$$ = [{t:$1, vs:$3}].concat($5);"]],
            "TDR": [["TD", "$$ = $1"], ["", "$$ = undefined"]],
            "TDL1": [["DIMID TDL2", "$$ = [$1].concat($2);"]],
            "TDL2": [["separ DIMID TDL2", "$$ = [$2].concat($3);"], ["", '']],
            "FD": [["func FTYPE id s_par PDL1 e_par e_stmt VG B FD", ""], ["", ""]],
            "PDL1": ["var_type id PDL2", ""],
            "PDL2": ["separ var_type id PDL2", ""],
            "ST": ["STDEF ST", ""],
            "STDEF": ["ASI e_stmt", "CALL e_stmt", "RET e_stmt", "REE e_stmt", "WRT e_stmt", "DEC", "REP"],
            "CALL": ["id s_par CALA e_par"],
            "CALA": ["XP0 CALA2", ""],
            "CALA2": ["separ XP0 CALA2", ""],
            "ASI": [["ASI_DIMID_R ASI_EQ_R XP0", "yy.pushVal($3); yy.checkOperation(0); //$$ = JSON.stringify($1) + $2 + $3;"]],
            "ASI_DIMID_R": [["DIMID", 'yy.pushVal($1)']],
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
            "DEC_XP0_R": [["XP0", "yy.addJumpF($1);"]],
            "DEC_B_R": [["B", '']],
            "ELSE": ["ELSE_ELSE_R ELSE_B_R", ""],
            "ELSE_B_R": [["B", '']],
            "ELSE_ELSE_R": [["else", 'yy.elseIntersectionProc()']],
            "REP": ["COND", "NCOND"],
            "COND": ["while s_par XP0 e_par do B"],
            "NCOND": ["from ASI to XP0 dof B"],
            "DIMID": [["id DIMID_", '$$ = {n:$1, d:$2}; console.log("DIMID", $$)']],
            "DIMID_": [["DIMID_S_CORCH_R XP0 DIMID_E_CORCH_R", '$$ = $2; console.log("DIMID_", $$)'], ["", '']],
            "DIMID_S_CORCH_R": [["s_corch", 'yy.pushCorchState();']],
            "DIMID_E_CORCH_R": [["e_corch", 'yy.popCorchState();']],
            "XP0": [["XP1 XP0_", "$$ = yy.pileVals.peek(); yy.endOperation()"]],
            "XP0_": [["R_OP_T4 XP0", "$$ = $1 + $2;"], ["", "$$ = ``;"]],
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
            "XP4": [["XPP", "$$ = $1; yy.pushVal($1);"], ["DIMID", "$$ = JSON.stringify($1); yy.pushVal($$); console.log('lllDIMID')"], ["CALL", "$$ = $1; yy.pushVal($1); console.log('lllCALL')"], ["char", "$$ = $1; yy.pushVal($1); console.log('lllchar')"], ["INTEGER", "$$ = $1; yy.pushVal($1); console.log('lllINTEGER')"], ["FLOAT", "$$ = $1;yy.pushVal($1); console.log('lllFLOAT');"]],
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
     */
    var p = new Parser(grammar);
    // Contexto interno
    p.yy = new YYKontext();
    console.log(p.parse("\n\t\t\tprograma XD; \n\t\t\tvar int: a[1+2*3],b,c;float: g,f,a[(5 + 1) * 9];\n\t\t\t%% AASDASD\n\t\t\tfuncion int holas(int X, float y, char a123123);\n\t\t\t\tvar char: x,y,z[12];\n\t\t\t{\n\t\t\t\tholas(1,2,3);\n\t\t\t\ta = 123;\n\t\t\t\tb = 'g';\n\t\t\t\tc = 123 - 1;\n\t\t\t\tsi (a == b) entonces {\n\t\t\t\t\tmientras(r == 123 || v > 3 && getAll()) haz\n\t\t\t\t\t{\n\t\t\t\t\t\tc[5] = -123.0123e5621 + ghg[4];\n\t\t\t\t\t}\n\t\t\t\t\ta = a * b;\n\t\t\t\t} sino {\n\t\t\t\t\tb= 'E';\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\tprincipal (){\n\t\t\t\ta = 0;\n\t\t\t}\n\t".replace("\t", "")));
    console.log(p.yy.squats);
    //p.yy.varTable.print();
    //p.yy.pileVals.print();
})(PROY_FINAL = exports.PROY_FINAL || (exports.PROY_FINAL = {}));
