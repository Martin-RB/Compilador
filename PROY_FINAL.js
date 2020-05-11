"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashMap_1 = require("./DataStruc/HashMap");
var Tuple_1 = require("./DataStruc/Tuple");
var Stack_1 = require("./DataStruc/Stack");
// COlumnas: Nombre, tipo, scope, valor(es), length
var PROY_FINAL;
(function (PROY_FINAL) {
    var YYKontext = /** @class */ (function () {
        function YYKontext() {
            var _this = this;
            this.state = "global";
            this.squats = new Array();
            this.varTable = new HashMap_1.HashMap();
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
            this.pushVal = function (name) {
                _this.pileVals.push(name);
            };
            this.pushOp = function (op) {
                _this.pileOps.push(op);
            };
            this.pileVals = new Stack_1.Stack();
            this.pileOps = new Stack_1.Stack();
            this.addQuadReg = function () {
            };
        }
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
            "ASI": [["DIMID eq XP0", "$$ = JSON.stringify($1) + $2 + $3; yy.pushVal($1)"]],
            "RET": ["ret s_par XP0 e_par"],
            "REE": ["read s_par DIMID REE_ e_par"],
            "REE_": ["separ DIMID REE_", ""],
            "WRT": ["write s_par WL e_par"],
            "WL": ["W_C WL1"],
            "WL1": ["separ W_C WL1", ""],
            "W_C": ["STR", "XP0"],
            "DEC": ["if s_par XP0 e_par then B DEC_"],
            "DEC_": ["else B", ""],
            "REP": ["COND", "NCOND"],
            "COND": ["while s_par XP0 e_par do B"],
            "NCOND": ["from ASI to XP0 dof B"],
            "DIMID": [["id DIMID_", '$$ = {n:$1, d:$2}']],
            "DIMID_": [["s_corch XP0 e_corch", '$$ = $2'], ["", '']],
            "XP0": [["XP1 XP0_", "$$ = $1 + $2; console.log($$); yy.pushVal(`#`)"]],
            "XP0_": [["op_t4 XP0", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``;"]],
            "XP1": [["XP2 XP1_", "$$ = $1 + $2"]],
            "XP1_": [["op_t3 XP1", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ =``;"]],
            "XP2": [["XP3 XP2_", "$$ = $1 + $2"]],
            "XP2_": [["op_t2 XP2", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``"]],
            "XP3": [["XP4 XP3_", "$$ = $1 + $2"]],
            "XP3_": [["op_t1 XP3", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``"]],
            "XP4": [["XPP", "$$ = $1"], ["DIMID", "$$ = JSON.stringify($1); yy.pushVal($1)"], ["CALL", "$$ = $1; yy.pushVal($1)"], ["char", "$$ = $1; yy.pushVal($1)"], ["INTEGER", "$$ = $1; yy.pushVal($1)"], ["FLOAT", "$$ = $1;yy.pushVal($1)"]],
            "XPP": [["s_par XP0 e_par", "$$ = $2"]],
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
     */
    var p = new Parser(grammar);
    // Contexto interno
    p.yy = new YYKontext();
    console.log(p.parse("\n\t\t\tprograma XD; \n\t\t\tvar int: a[1+2],b,c;float: g,f,a[5 + 1 * 9];\n\t\t\t%% AASDASD\n\t\t\tfuncion int holas(int X, float y, char a123123);\n\t\t\t\tvar char: x,y,z[12];\n\t\t\t{\n\t\t\t\tholas(1,2,3);\n\t\t\t\ta = 123;\n\t\t\t\tb = 'g';\n\t\t\t\tc = 123;\n\t\t\t\tsi (a == b) entonces {\n\t\t\t\t\tmientras(r == 123 || v > 3 && getAll()) haz\n\t\t\t\t\t{\n\t\t\t\t\t\tc[5] = -123.0123e5621 + c[3];\n\t\t\t\t\t}\n\t\t\t\t\ta = a*b;\n\t\t\t\t} sino {\n\t\t\t\t\tb= 'E';\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\tprincipal (){\n\t\t\t\ta = 0;\n\t\t\t}\n\t".replace("\t", "")));
    p.yy.varTable.print();
    p.yy.pileVals.print();
    console.log(p.yy.state);
})(PROY_FINAL = exports.PROY_FINAL || (exports.PROY_FINAL = {}));
