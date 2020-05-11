namespace PROY_FINAL{

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
                [`(\\+|-)?[0-9]+\\.[0-9]+(e[0-9]+)?`,                   "return 'float';"],
                [`(\\+|-)?[0-9]+`,                   "return 'integer';"],
                [`(\\+|\\-)`,                   "return 'op_t2';"],
                [`(\\*|\\/)`,                   "return 'op_t1';"],
                [`(\\&&|\\|\\|)`,                   "return 'op_t4';"],
                [`(\\!\\=|\\=\\=|\\<|\\>|\\>\\=|\\<\\=)`,                   "return 'op_t3';"],
                [`\\=`,                   "return 'eq';"],
                [`[a-zA-Z_$]\\w*`,                   "return 'id';"],
                [`\\s+`,                   ""],
            ]
        },
    
        "bnf": {
            "S"				: ["init_prgr id e_stmt SS"],
            "SS"			: ["VG FD M"],
            "M"				: ["main_f s_par e_par B"],
            "B"				: ["s_bck ST e_bck"],
            "VG"				: ["var_dec TD", ""],
            "TD"				: ["var_type definer TDL1 e_stmt TDR"],
            "TDR"				: ["TD", ""],
            "TDL1"				: ["DIMID TDL2"],
            "TDL2"				: ["separ DIMID TDL2", ""],
            "FD"				: ["func FTYPE id s_par PDL1 e_par e_stmt VG B FD", ""],
            "PDL1"				: ["var_type id PDL2", ""],
            "PDL2"				: ["separ var_type id PDL2", ""],
            "ST"				: ["STDEF e_stmt ST", ""],
            "STDEF"				: ["ASI", "CALL", "RET", "REE", "WRT", "DEC", "REP"],
            "CALL"				: ["id s_par CALA e_par"],
            "CALA"				: ["XP0 CALA2", ""],
            "CALA2"				: ["separ XP0 CALA2", ""],
            "ASI"				: ["DIMID eq XP0"],
            "RET"				: ["ret s_par XP0 e_par"],
            "REE"				: ["read s_par DIMID REE_ e_par"],
            "REE_"				: ["separ DIMID REE_", ""],
            "WRT"				: ["write separ WL e_par"],
            "WL"				: ["W_C WL1"],
            "WL1"				: ["separ W_C WL1", ""],
            "W_C"				: ["STR", "XP0"],
            "DEC"				: ["if s_par XP0 e_par then B DEC_"],
            "DEC_"				: ["else B", ""],
            "REP"				: ["COND", "NCOND"],
            "COND"				: ["while s_par XP0 e_par do B"],
            "NCOND"				: ["from ASI to XP0 dof B"],
            "DIMID"				: ["id DIMID_"],
            "DIMID_"				: ["s_corch XP0 e_corch", ""],
            "XP0"				: ["XP1 XP0_"],
            "XP0_"				: ["op_t4 XP0", ""],
            "XP1"				: ["XP2 XP1_"],
            "XP1_"				: ["op_t3 XP1", ""],
            "XP2"				: ["XP3 XP2_"],
            "XP2_"				: ["op_t2 XP2", ""],
            "XP3"				: ["XP4 XP3_"],
            "XP3_"				: ["op_t1 XP3", ""],
            "XP4"				: ["XPP", "DIMID", "CALL", "char", "integer", "float"],
            "XPP"				: ["s_par XP0 e_par"],
            "FTYPE"				: ["var_type", "void"]
        }
    };
    
    var p = new Parser(grammar);
    console.log(p.parse(`
            programa XD; 
            var int: a,b,c;float: g,f,a[5 + 1 * 9];
            %% AASDASD
            funcion int holas(int X, float y, char a123123);{
                holas(1,2,3);
                a = 123;
                b = 'g';
                c = 123;
                si (a == b) entonces {
                    mientras(r == 123 || v > 3 && getAll()) haz
                    {
                        c = -123.0123e5621 + c;
                    };
                    a = a*b;
                } sino {
                    b= 'E';
                };
            }
            
            principal (){
                a = 0;
            }
    `));
}