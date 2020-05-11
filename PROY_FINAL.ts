import { HashMap } from "./DataStruc/HashMap";
import { Tuple } from "./DataStruc/Tuple";
import { Stack } from "./DataStruc/Stack";

// COlumnas: Nombre, tipo, scope, valor(es), length

export namespace PROY_FINAL{

	class Mem{
		static memIdx = 0;
		static request(){
			this.memIdx += 1;
			return this.memIdx;
		}
	}

	class YYKontext{
		state: string = `global`;
		squats: Array<Tuple<string, string, string, string>> = new Array<Tuple<string, string, string, string>>();
		varTable : HashMap<Tuple<string, string, string, string /**Puesto de manera auxiliar */, any | HashMap<any> | undefined>> = new HashMap<Tuple<string, string, string, string, any | HashMap<any> | undefined>>();

		pileVals = new Stack<string>();
		pileOps = new Stack<string>();
		// [["type", [["var1", "dimention"], [var2, dimention]], [type, []]]
		addFromString = (array: Array<{t:string, vs: Array<{n:string, d:string}>}>, state: string) => {
			array.forEach(t => {
				if(!t) return;
				let type: string = t.t;
				t.vs.forEach(v => {
					if(!v) return;
					this.addVariableToTable(v.n, type, state, v.d);
				});
			});
		}
		addVariableToTable = (name: string, type: string, scope: string, dimSize: string) => {
			if(!dimSize) dimSize = "1";
			this.varTable.set(name, new Tuple<string, string, string, string, any | HashMap<any> | undefined>(name, type, scope, dimSize, undefined));
		}
		addVariablesToTable = (names: string[], type: string, scope: string, dimSizes: Array<string>) => {
			for (let i = 0; i < names.length; i++) {
				const name = names[i];
				const dimSize = dimSizes[i];

				this.varTable.set(name, new Tuple<string, string, string, string, any | HashMap<any> | undefined>(name, type, scope, dimSize, undefined));
			}
		}
		checkOperation = (opType: string) => {
			let op = this.pileOps.peek();
			if(opType == "1"){
				if(op == "*" || op == "/"){
					let operator = op;
					let rightOnd = this.pileVals.pop();
					let leftOnd = this.pileVals.pop();

					let memSpace = Mem.request();
					
				}
			}
			else if(opType == "2"){

			}
			else if(opType == "3"){

			}
			else if(opType == "4"){

			}
			else{

			}

			
			else 
			else if(op == "<" || op == ">" || op == "<=" || op == ">=" || op == "==" || op == "!="){

			}
			else if(op == "||" || op == "&&"){

			}
			else{
				console.log("Not identified");
			}
		}
		pushVal = (name: string) => { 
			this.pileVals.push(name);
		}

		pushOp = (op: string) => {
			this.pileOps.push(op);
		}


		addQuadReg = () => {
			
		}

		constructor(){

		}
	}
	


	let jjson = require("jison");
	let Parser = jjson.Parser;
	


	let grammar = {
		"lex": {
			"rules": [
	
				[`programa`,	             	"return 'init_prgr';"],
				[`;`,		    	             "return 'e_stmt';"],
				[`'.'`,		     "return 'char';"], 
				[`\\(`,                  "return 's_par';"],
				[`\\)`,                "return 'e_par';"],
				[`\\{`,               "return 's_bck';"],
				[`\\}`,                 "return 'e_bck';"],
				[`%% \\w*`,                 ""],
				[`funcion`,                   "return 'func';"],
				[`principal`,                   "return 'main_f';"],
				[`var`,                   "return 'var_dec';"], 
				[`(int|float|char)`,                   "return 'var_type';"],
				[`\\[`,                   "return 's_corch';"],
				[`\\]`,                   "return 'e_corch';"],
				[`,`,                   "return 'separ';"],
				
				[`\\:`,                   "return 'definer';"],
				[`void`,                   "return 'void';"],
				[`regresa`,                  "return 'ret';"],
				[`lee`,                   "return 'read';"],
				[`escribe`,                   "return 'write';"],
				[`\\"`,         		 "return 'comillasXD';"],
				[`entonces`,                   "return 'then';"],
				[`'`,                   "return 'simple_com';"],
				[`sino`,                   "return 'else';"],
				[`si`,							"return 'if';"],
				[`mientras`,                   "return 'while';"],
				[`haz`,                   "return 'do';"],
				[`desde`,                   "return 'from';"],
				[`hasta`,                   "return 'to';"],
				[`hacer`,                   "return 'dof';"],
				[`(\\+|\\-)`,                   "return 'op_t2';"],
				[`[0-9]+\\.[0-9]+(e[0-9]+)?`,                   "return 'float';"],
				[`[0-9]+`,                   "return 'integer';"],
				[`(\\*|\\/)`,                   "return 'op_t1';"],
				[`(\\&&|\\|\\|)`,                   "return 'op_t4';"],
				[`(\\!\\=|\\=\\=|\\<|\\>|\\>\\=|\\<\\=)`,                   "return 'op_t3';"],
				[`\\=`,                   "return 'eq';"],
				[`[a-zA-Z_$]\\w*`,                   "return 'id';"],
				[`\\s+`,                   ""],
			]
		},
	
		"bnf": {
			"S"				: [["init_prgr id e_stmt SS", "yy.addVariableToTable($2, `void`, `global`, `1`);"]],
			"SS"			: ["VG FD M"],
			"M"				: ["main_f s_par e_par B"],
			"B"				: ["s_bck ST e_bck"],
			"VG"				: [["var_dec TD", 'yy.addFromString($2, yy.state); yy.state = `local`;'], ["", ""]],
			"TD"				: [["var_type definer TDL1 e_stmt TDR", "$$ = [{t:$1, vs:$3}].concat($5);"]],
			"TDR"				: [["TD", "$$ = $1"], ["", "$$ = undefined"]],
			"TDL1"				: [["DIMID TDL2", "$$ = [$1].concat($2);"]],
			"TDL2"				: [["separ DIMID TDL2", "$$ = [$2].concat($3);"], ["", '']],
			"FD"				: [["func FTYPE id s_par PDL1 e_par e_stmt VG B FD", ""], ["", ""]],
			"PDL1"				: ["var_type id PDL2", ""],
			"PDL2"				: ["separ var_type id PDL2", ""],
			"ST"				: ["STDEF ST", ""],
			"STDEF"				: ["ASI e_stmt", "CALL e_stmt", "RET e_stmt", "REE e_stmt", "WRT e_stmt", "DEC", "REP"],
			"CALL"				: ["id s_par CALA e_par"],
			"CALA"				: ["XP0 CALA2", ""],
			"CALA2"				: ["separ XP0 CALA2", ""],
			"ASI"				: [["DIMID eq XP0", "$$ = JSON.stringify($1) + $2 + $3; yy.pushVal($1)"]],
			"RET"				: ["ret s_par XP0 e_par"],
			"REE"				: ["read s_par DIMID REE_ e_par"],
			"REE_"				: ["separ DIMID REE_", ""],
			"WRT"				: ["write s_par WL e_par"],
			"WL"				: ["W_C WL1"],
			"WL1"				: ["separ W_C WL1", ""],
			"W_C"				: ["STR", "XP0"],
			"DEC"				: ["if s_par XP0 e_par then B DEC_"],
			"DEC_"				: ["else B", ""],
			"REP"				: ["COND", "NCOND"],
			"COND"				: ["while s_par XP0 e_par do B"],
			"NCOND"				: ["from ASI to XP0 dof B"],
			"DIMID"				: [["id DIMID_", '$$ = {n:$1, d:$2}']],
			"DIMID_"			: [["s_corch XP0 e_corch", '$$ = $2'], ["", '']],
			"XP0"				: [["XP1 XP0_", "$$ = $1 + $2; console.log($$); yy.pushVal(`#`)"]],
			"XP0_"				: [["R_OP_T4 XP0", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``;"]],
			"R_OP_T4"			: [["op_t4", "$$ = $1; yy.pushOp($1)"]],
			"XP1"				: [["XP2 XP1_", "yy.checkOperation('4')"]],
			"XP1_"				: [["R_OP_T3 XP1", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ =``;"]],
			"R_OP_T3"			: [["op_t3", "$$ = $1; yy.pushOp($1)"]],
			"XP2"				: [["XP3 XP2_", "yy.checkOperation('3')"]],
			"XP2_"				: [["R_OP_T2 XP2", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``"]],
			"R_OP_T2"			: [["op_t2", "$$ = $1; yy.pushOp($1)"]],
			"XP3"				: [["R_XP4 XP3_", "yy.checkOperation('2')"]],
			"XP3_"				: [["R_OP_T1 XP3", "$$ = $1 + $2; yy.pushVal($1)"], ["", "$$ = ``"]],
			"R_XP4"				: [["XP4", "yy.checkOperation('1')"]],
			"R_OP_T1"			: [["op_t1", "$$ = $1; yy.pushOp($1)"]],
			"XP4"				: [["XPP", "$$ = $1"], ["DIMID", "$$ = JSON.stringify($1); yy.pushVal($1)"], ["CALL", "$$ = $1; yy.pushVal($1)"], ["char", "$$ = $1; yy.pushVal($1)"], ["INTEGER", "$$ = $1; yy.pushVal($1)"], ["FLOAT", "$$ = $1;yy.pushVal($1)"]],
			"XPP"				: [["s_par XP0 e_par", "$$ = $2"]],
			"FTYPE"				: ["var_type", "void"],
			"INTEGER"			: [["op_t2 integer", "$$ = $1 + $2"], ["integer", "$$ = $1"]],
			"FLOAT"			: [["op_t2 float", "$$ = $1 + $2"], ["float", "$$ = $1"]],
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
	console.log(p.parse(`
			programa XD; 
			var int: a[1+2],b,c;float: g,f,a[5 + 1 * 9];
			%% AASDASD
			funcion int holas(int X, float y, char a123123);
				var char: x,y,z[12];
			{
				holas(1,2,3);
				a = 123;
				b = 'g';
				c = 123;
				si (a == b) entonces {
					mientras(r == 123 || v > 3 && getAll()) haz
					{
						c[5] = -123.0123e5621 + c[3];
					}
					a = a*b;
				} sino {
					b= 'E';
				}
			}
			
			principal (){
				a = 0;
			}
	`.replace("\t", "")));

	p.yy.varTable.print()
	p.yy.pileVals.print();
	console.log(p.yy.state);
	
}