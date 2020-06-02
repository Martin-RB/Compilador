import { HashMap } from "./DataStruc/HashMap";
import { Tuple } from "./DataStruc/Tuple";
import { Stack } from "./DataStruc/Stack";
import { FuncTable, IFuncTableRow, IArg } from "./classes/FuncTable";
import { MortalKonstants } from "./classes/MortalKonstants";
import { KapussinoVirtualMachine } from "./classes/KappussinoVirtualMachine";

// COlumnas: Nombre, tipo, scope, valor(es), length

export namespace PROY_FINAL{

	class MemoryChunk{
		private _integer: number = 0;
		private _float: number = 0;
		private _char: number = 0;
		private _bool: number = 0;
		private _void: number = 0;
		private _sizePerSection: number;
		private _initialOffset: number;

		requestInteger(size: number){
			let num = this._integer;
			this._integer+=size;
			if(this._integer >= this._sizePerSection){
				throw "Error: Sobrecarga de memoria para enteros";
			}
			return this._initialOffset + num;
		}
		requestFloat(size: number){
			let num = this._float;
			this._float+=size;
			if(this._float >= this._sizePerSection){
				throw "Error: Sobrecarga de memoria para flotantes";
			}
			return this._initialOffset + num + this._sizePerSection;
		}
		requestChar(size: number){
			let num = this._char;
			this._char+=size;
			if(this._char >= this._sizePerSection){
				throw "Error: Sobrecarga de memoria para caracteres";
			}
			return this._initialOffset + num + this._sizePerSection * 2;
		}
		requestBool(size: number){
			let num = this._bool;
			this._bool+=size;
			if(this._bool >= this._sizePerSection){
				throw "Error: Sobrecarga de memoria para boleanos";
			}
			return this._initialOffset + num + this._sizePerSection * 3;
		}
		requestVoid(size: number){
			let num = this._void;
			this._void+=size;
			if(this._void >= this._sizePerSection){
				throw "Error: Sobrecarga de memoria para void";
			}
			return this._initialOffset + num + this._sizePerSection * 4;
		}

		getMemoryUsed(){
			return this._integer + this._float + this._char + this._bool;
		}

		constructor(initialOffset: number, totalSize: number){
			this._initialOffset = initialOffset;
			this._sizePerSection = totalSize / 4;
		}
	}

	class Memory{

		public static LOCAL_MEM = 0;
		public static TEMP_MEM = 1;
		public static GLOBAL_MEM = 2;

		public static INTEGER = 10;
		public static FLOAT = 11;
		public static CHAR = 12;
		public static BOOL = 13;
		public static VOID = 14;

		private _local: MemoryChunk;
		private _temp: MemoryChunk;
		private _father: Memory | null;
		private _localSize: number;
		private _tempSize: number;
		private _initialOffset: number;

		constructor(initialOffset: number, localSize: number, tempSize: number){

			console.log("Initializing memory: ");
			console.log("initialOFF: ", initialOffset);
			console.log("localSize: ", localSize);
			console.log("tempSize: ", tempSize);
			console.log("Total size: ", localSize + tempSize);
			console.log("LIMIT: ", initialOffset + localSize + tempSize);
			

			this._initialOffset = initialOffset;
			this._localSize = localSize;
			this._tempSize = tempSize;
			this._local = new MemoryChunk(initialOffset, localSize);
			this._temp = new MemoryChunk(initialOffset + localSize, tempSize);

			this._father = null;
		}

		setFather(father: Memory){
			this._father = father;
		}

		getFather(): Memory | null{
			if(this._father)
				return this._father;
			else
				return null;
		}

		getMemoryUsed(type: number){
			switch (type) {
				case Memory.TEMP_MEM:
					return this._temp.getMemoryUsed();
			}
		}

		requestMemory(location: number, type: number, size: number): string{
			if(location == Memory.LOCAL_MEM){
				return `${this.getFromTypeAndChunk(this._local, type, size)}`;
			}
			else if(location == Memory.TEMP_MEM){
				// + _localSize to set offset
				return `${this.getFromTypeAndChunk(this._temp, type, size) + this._localSize}`;
			}
			else if(location == Memory.GLOBAL_MEM){
				if(this._father != null){
					return this._father.requestMemory(Memory.GLOBAL_MEM, type, size);
				}
				else{
					return `${this.getFromTypeAndChunk(this._local, type, size)}`;
				}
			}
			else{
				throw "UNRECOGNIZED MEMORY LOCATION REQUEST: " + location;
				
			}
		}

		private getFromTypeAndChunk(chunk: MemoryChunk, type: number, size: number){
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
		}

		getNextFree(){
			return this._initialOffset + this._localSize + this._tempSize;
		}
	}

	interface IVarTableRow{
		name: string,
		type: string,
		scope: string,
		dimSize: string,
		dir: any | HashMap<any> | undefined,
	}

	class VarTable extends HashMap<IVarTableRow>{
		private _fatherTable : VarTable | null;

		constructor(){
			super();

			this._fatherTable = null;
		}

		setFatherTable(fatherTable: VarTable){
			this._fatherTable = fatherTable;
		}

		getFatherTable(): VarTable | null{
			if(this._fatherTable)
				return this._fatherTable;
			else
				return null;
		}

		get(key: string): IVarTableRow | undefined{
			for (let i = 0; i < this._array.length; i++) {
				const el = this._array[i];
				
				if(el.v1 == key){
					return el.v2;
				}
			}
			let father = this.getFatherTable();
			if(father){
				return father.get(key);
			}
			return undefined;
		}

		exist(key:string): boolean{
			for (let i = 0; i < this._array.length; i++) {
				const el = this._array[i];
				
				if(el.v1 == key){
					return true;
				}
			}
			let father = this.getFatherTable();
			if(father){
				return father.exist(key);
			}
			return false;
		}
	}


	interface DIMID{
		n: string;
		d?: string;
	}

	class YYKontext{
		state: string = `global`;
		squats: Array<Tuple<string, string, string, string>> = new Array<Tuple<string, string, string, string>>();
		/*Nombre, tipo, scope, length, val*/
		//varTable : HashMap<Tuple<string, string, string, string /**Puesto de manera auxiliar */, any | HashMap<any> | undefined>> = new HashMap<Tuple<string, string, string, string, any | HashMap<any> | undefined>>();
		//varTable = new HashMap<vTableRow>();
		varTable = new VarTable();
		funcTable = new FuncTable();
		memGVarSize = 5000;
		memGTempSize = 10000;
		memGConstSize = 5000;
		constantsMemory = new MortalKonstants(0, this.memGConstSize);
		actualMemory = new Memory(this.memGConstSize, this.memGVarSize, this.memGTempSize);
		actualFunction:string|null = null;

		qb : HashMap<HashMap<HashMap<string>>> = new HashMap<HashMap<HashMap<string>>>();

		pileVals = new Stack<string>();
		pileOps = new Stack<string>();
		pileJump = new Stack<string>();
		pileFromTo = new Stack<string>();
		pileFromToType = new Stack<string>();
		pileType = new Stack<string>();
		pileFunc = new Stack<string>();
		
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
		pushCorchState = () => {
			this.pileOps.push(";C;");
			this.pileVals.push(";C;");
		}
		popCorchState = () => {
			let ops = this.pileOps.peek() != ";C;";
			let vals = this.pileVals.peek() != ";C;";
			if(ops || vals){
				throw new Error("CORCH ENDED UNEXPECTEDLY")
			}
			this.pileOps.pop();
			this.pileVals.pop();
		}
		pushParthState = () => {
			this.pileOps.push(";P;");
			this.pileVals.push(";P;");
		}
		popParthState = () => {
			let ops = this.pileOps.peek() != ";P;";
			let vals = this.pileVals.peek() != ";P;";
			if(ops || vals){
				throw new Error("PARENTHESIS ENDED UNEXPECTEDLY")
			}
			this.pileOps.pop();
			this.pileVals.pop();
		}
		addVariableToTable = (name: string, type: string, scope: string, dimSize: string | undefined) => {
			if(!dimSize) dimSize = "1";
			this.varTable.set(name, {name, type, scope, dimSize, dir: this.actualMemory.requestMemory(Memory.LOCAL_MEM, this.getMemoryType(type), parseInt(dimSize))});
		}
		setVariableDir = (name: string, idx?: string) => {

		}

		functionAddArgs = (args: Array<IArg>) => {			
			let actualID = this.pileFunc.peek();
			if(!actualID) throw "ERROR: NO PROPER FUNCTION STABLISMENT";

			let r = this.funcTable.get(actualID);
			if(!r) throw "No se encontró la función especificada: " + actualID;
			r.args = args;
			for (let i = 0; i < r.args.length; i++) {
				const arg = r.args[i];
				let variable: IVarTableRow = {name: arg.name, dimSize: "1", 
					dir: undefined, scope: "local", type: arg.type};
				this.varTable.set(arg.name, variable);
			}
		}

		functionProc = (id: string, type: string) =>{
			console.log("FIRST");
			
			this.pileFunc.push(id);
			this.actualFunction = id;
			let r: IFuncTableRow = {id, args: [], type, 
				ip:undefined, numLocalVars: undefined, 
				numTempVars: undefined,value: undefined, k: 0};
			this.funcTable.set(id, r);

			console.log("DaFunc", this.funcTable.get(id));
			

			if(type != "void"){
				let memory = 
						this.actualMemory
							.requestMemory(Memory.GLOBAL_MEM, this.getMemoryType(type), 1);

				this.varTable.set(id, {name: id, dimSize: "1", 
					dir: memory, scope: "global", type: type});
			}

			let newVarTable = new VarTable();
			newVarTable.setFatherTable(this.varTable);
			this.varTable = newVarTable;

			let offset = this.actualMemory.getNextFree();
			let newMemory = new Memory(offset, this.memGVarSize/2, this.memGTempSize/2);
			newMemory.setFather(this.actualMemory);
			this.actualMemory = newMemory;
			
		}
		setLocalVarNumber = ()=>{
			if(!this.actualFunction) throw "NO FUNCTION";
			let actualFunc = this.funcTable.get(this.actualFunction)!;
			let declaredVars = this.varTable._array.length;
			let argNumber = actualFunc.args.length;
			this.funcTable.get(this.actualFunction)!.numLocalVars = 
						declaredVars - argNumber;
			
			this.funcTable.get(this.actualFunction)!.ip = this.squats.length;
			
		}
		endFuncProc = () => {
			let used = this.actualMemory.getMemoryUsed(Memory.TEMP_MEM);
			if(!this.actualFunction) throw "NO FUNCTION";
			let actualFunc = this.funcTable.get(this.actualFunction)!;
			actualFunc.numTempVars = used;

			this.squats.push(new Tuple("ENDFUNCTION", "","",""));

			let fatherMem = this.actualMemory.getFather();
			if(fatherMem != null)
				this.actualMemory = fatherMem;
			else
				throw "INNER: NO FATHER MEMORY";

			console.log("FUNCTIONAME: ", actualFunc.id);
		
			console.log("FUNCTIONVALUE: ", actualFunc.value);

			let fatherVarTable = this.varTable.getFatherTable();
			if(fatherVarTable != null)
				this.varTable = fatherVarTable;
			else
				throw "INNER: NO FATHER VAR TABLE";
		}
/* 		getLastValue = () => {
			return this.pileVals.pop();
		} */

		checkOperation = (opType: string) => {
			console.log("*********" + opType);
			this.pileOps.print();
			let op = this.pileOps.peek();
			if(opType == "0"){
				while(op == "="){
					this.addQuaddProc(op, true);
					op = this.pileOps.peek();
				}
			}
			else if(opType == "1"){
				if(op == "*" || op == "/"){
					this.addQuaddProc(op);
				}
			}
			else if(opType == "2"){
				if(op == "-" || op == "+"){
					this.addQuaddProc(op);
				}
			}
			else if(opType == "3"){
				if(op == "<" || op == ">" || op == "<=" || op == ">=" || op == "==" || op == "!="){
					this.addQuaddProc(op);
				}
			}
			else if(opType == "4"){
				if(op == "||" || op == "&&"){
					this.addQuaddProc(op);
				}
			}
			else{
				console.log("Not identified");
			}
		}
		pushVal = (value: any) => { 

			let name = "";
			if(typeof value == "object"){
				name = value.n;
			}
			else{
				name = value;
			}

			console.log("pushVal pushed: ", name);
			
			this.pileVals.push(name);
		}

		getKnstSavedMemory = (konstant:string) =>{
			let mem = this.constantsMemory.request(konstant);
			console.log(`FROM constant ${konstant} TO dir ${mem}`);
			return mem;
		}

		getVarSavedMemory = (id: string, dim: string | undefined) => {
			if(!this.varTable.exist(id)){
				throw "Error: Variable " + id + " no declarada";
			}

			let varr = this.varTable.get(id)!;
			console.log("Variable to work: ", varr);
			
			let dir = varr.dir;
			if(varr.dimSize != "1"){
				if(dim == undefined) throw "Error: Debes especificar la dimension de la variable " + varr.name;
				let typeDim = this.pileType.pop();
				if(!typeDim || (typeDim != "int" && typeDim != "float")) throw "Error: Valor de dimensión no es entero o flotante";

				this.squats.push(new Tuple("VERFY", dim, this.constantsMemory.request("0"), this.constantsMemory.request(varr.dimSize) ));
				console.log("PUSHED VERIFY");
				
				let memSpace = this.actualMemory.requestMemory(Memory.TEMP_MEM, this.getMemoryType("int"), 1)?.toString();
				this.squats.push(new Tuple("+", this.constantsMemory.request(dir), dim, memSpace));
				this.pileVals.push("*" + memSpace);
				this.pushType("int");

				/* this.pushType("int");
				this.pushVal(dir);
				this.pushType(typeDim);
				this.pushVal(dim);
				this.pushOp("+");
				this.checkOperation("2"); */
				let type = this.pileType.pop();
				console.log("PILE VALIUDATED");
				
				if(!(type == "int" || type == "float")) throw "Error: Valor de dimensión no es entero o flotante";
				
				dir = this.pileVals.pop();
			}
			return dir;
		}

		functionReturn = (val: string) => {
			let type = this.pileType.pop();

			if(type == undefined) throw "Error: Tipo de regreso no detectado";
			if(val == undefined) throw "Error: Valor de regreso no detectado";

			let id = this.pileFunc.peek();
			if(id == undefined || !this.funcTable.exist(id)) throw "Error: Función dueña de regreso no detectada";
			
			let func = this.funcTable.get(id)!;
			
			if(func.type != type) throw "Error: Tipo de retorno no compatible";
			
			func.value = val;
			
		}

		getFuncSavedMemory = (id: string) => {
			
			console.log("THE MEMORY: ", id);
			
			
			if(!this.funcTable.exist(id)){
				throw "Error: Función " + id + " no declarada";
			}

			let func = this.funcTable.get(id)!;
			console.log("FUNC TYPE: ", func);
			
			let mem = this.actualMemory.requestMemory(Memory.GLOBAL_MEM, this.getMemoryType(func.type), 1);
			console.log(mem);
			
			console.log("HEEEERE");
			
			this.squats.push(new Tuple("=", func.value!, "_", mem));
			
			return mem;
		}

		endOperation = () => {
			console.log("ENDED:");
			console.log("---");
			this.pileOps.print();
			this.pileVals.print();
			console.log("---");
			console.log(this.pileVals.pop())
		}

		pushOp = (op: string) => {
			console.log("PUSHED", op);
			this.pileOps.push(op);
		}

		private addQuaddProc(op: string, vAssign: boolean = false){
			this.pileOps.pop();
			this.pileVals.print();
			console.log("Types:");this.pileType.print()
			console.log("**********");
			
			let operator = op;
			let rightOnd = this.pileVals.pop();
			let leftOnd = this.pileVals.pop();
			console.log("Onds: ", leftOnd, rightOnd);
			if(!rightOnd || !leftOnd) throw "Error de valores: Cantidad de valores incorrecta";
			console.log(JSON.stringify(this.pileType.peek()))
			let rightType = this.pileType.pop();
			console.log(this.pileType.peek())
			let leftType = this.pileType.pop();
			if(!rightType || !leftType) throw "Error de tipos: Cantidad de tipos incorrecta";

			let typeResult = this.qb.get(leftType)?.get(rightType)?.get(op);
			if(!typeResult || typeResult == "NOP") throw `Error de tipos:  ${leftOnd}:${leftType} ${op} ${rightOnd}${rightType} es incompatible`;

			this.pushType(typeResult);
			
			console.log("Types:");this.pileType.print();
			if(!vAssign){
				let memSpace = this.actualMemory.requestMemory(Memory.TEMP_MEM, this.getMemoryType(typeResult), 1)?.toString();
				console.log(`ADDED QUAD: ${operator}, ${leftOnd}, ${rightOnd}, ${memSpace}`);
				this.squats.push(new Tuple(operator, leftOnd!, rightOnd!, memSpace));
				this.pileVals.push(memSpace);
				console.log("\n\n\n\n\n\n");
			}
			else{
				console.log(`ADDED QUAD: ${operator}, ${rightOnd}, _, ${leftOnd}`);
				this.squats.push(new Tuple(operator, rightOnd!, "", leftOnd));
				this.pileVals.push(leftOnd!);
				console.log("\n\n\n\n\n\n");
			}
			
		}
		fromToComp = (v1:string, v2:string) => {
			this.pushVal(v1);
			this.pushVal(v2);
			this.pushOp("<=");
			this.checkOperation("3");
		}
		fromToSum = () => {
			let varDir = this.pileFromTo.pop();
			let varType = this.pileFromToType.pop();
			if(varDir == undefined || varType == undefined){ throw "Error: Procedimiento 'de ... hasta' require una variable valida."; }
			
			this.pileVals.push(varDir);
			this.pileType.push(varType);
			this.pushOp("=");
			this.pileVals.push(varDir);
			this.pileType.push(varType);
			this.pileVals.push(this.constantsMemory.request("1"));
			this.pileType.push("int");
			this.pushOp("+");
			this.checkOperation("2");
			this.checkOperation("0");
		}
		fromToEndProc = () => {

		}

		callFunction_start = (id: string)=>{
			if(!this.funcTable.exist(id)){
				throw "Función " + id + " no declarada";
			}
			this.pileFunc.push(id);
			this.funcTable.get(id)!.k = 0;
			this.squats.push(new Tuple("ERA", "", "", id));
		}
		callFunction_pushParam = (dir: string, type: string)=>{
			let id = this.pileFunc.peek();
			if(!id){
				throw "Llamada función sin nombre";
			}

			if(!this.funcTable.exist(id)){
				throw "Función " + id + " no declarada";
			}

			let func = this.funcTable.get(id)!;
			
			let arg = func.args[func.k];
			console.log(func.args, type);
			

			if(arg && arg.type == type){
				this.squats.push(new Tuple("PARAM", dir, "_", func.k.toString()));
			}
			else{
				throw "Incompatible type " + type + " on " + func.k + " parameter at function " + id;
			}
			
			func.k++;
			
		}

		callFunction_end = ()=>{
			let id = this.pileFunc.peek();
			if(!id){
				throw "Llamada función sin nombre";
			}

			if(!this.funcTable.exist(id)){
				throw "Función " + id + " no declarada";
			}

			let func = this.funcTable.get(id)!;

			if(func.args.length != func.k){
				throw `Numero incorrecto de parametros. Se pusieron ${func.k}, se esperaban ${func.args.length}.`;
			}
			

			this.squats.push(new Tuple("GOSUB","","",this.pileFunc.pop()));

			return id;
		}

		setWriteProc = (ids: Array<string>) => {
			ids.forEach(el => {
				this.squats.push(new Tuple("WRITE", "_", "_", el));
			});
		}

		setReadProc = (ids: Array<string>) => {
			ids.forEach(el => {
				this.squats.push(new Tuple("READ", "_", "_", el));
			});
		}


		functionReturnProc = (value: string, type: string) => {
			let id = this.pileFunc.peek();
			if(!id) throw "No hay función a la cual asignar 'regresa'";
			

			let func = this.funcTable.get(id);
			if(!func) throw `No hay función declarada llamada '${id}'`;

			if(func.type != type) 
				throw `Se ha regresado un tipo '${type}' en la función '${id}' de tipo '${func.type}'.`;
						
				console.log("FUNCTIONASS: ", value);
			func.value = value;
			console.log(this.funcTable.get(id)?.value);
			
		}

		getMemoryType(type: string){
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
		}
		
		addJumpT = (eValue: string, destiny?:boolean) =>{
			let _dest = "_";
			if(destiny){
				_dest = this.pileJump.pop()!;
			}
			this.squats.push(new Tuple("JUMPT", eValue, "", _dest));
			if(!destiny){
				this.pileJump.push((this.squats.length - 1).toString())
			}
		}
		addJumpF = (eValue: string, destiny?:boolean) =>{
			console.log("eValue", eValue);
			
			let _dest = "_";
			if(destiny){
				_dest = this.pileJump.pop()!;
			}
			this.squats.push(new Tuple("JUMPF", eValue, "", _dest));
			if(!destiny){
				this.pileJump.push((this.squats.length - 1).toString())
			}
		}
		addJump = (dontAwait?:boolean) =>{
			let _dest = "_";
			if(dontAwait){
				_dest = this.pileJump.pop()!;
			}
			this.squats.push(new Tuple("JUMP", "", "", _dest));
			if(!dontAwait){
				this.pileJump.push((this.squats.length - 1).toString())
			}
		}
		addJumpSavepoint = () => {
			this.pileJump.push((this.squats.length).toString());
		}
		resolveJump = (customIdx? : number, destiny?: number) => {
			let idx:number;
			if(!customIdx){
				let jump = this.pileJump.pop();
				if(!jump) throw new Error("NO JUMPS IN STACK");
				idx = parseInt(jump);
			}
			else{
				idx = customIdx;
			}
			if(destiny){
				this.squats[idx].v4 = destiny.toString();
			}
			else{
				this.squats[idx].v4 = this.squats.length.toString();
			}
			
		}
		elseIntersectionProc = () => {
			let idxFix = this.pileJump.pop();
			if(!idxFix) throw new Error("NO JUMPS IN STACK");
			this.addJump();
			this.resolveJump(parseInt(idxFix));
		}
		getVariableType = (name: any) => {
			let variable = this.varTable.get(name);
			if(!variable){ throw `Variable ${name} no existente`}

			console.log("-----GOT VAR TYPE: " + name + " AS " + variable.type);
			
			return variable.type;
		}
		getFunctionType = (name: string) => {
			let func = this.funcTable.get(name);
			if(!func){ throw `Función ${name} no existente`}

			return func.type;
		}
		pushType = (type: string) => {
			console.log("PUSHED type: " + type);
			this.pileType.push(type);
			console.log("Types:");this.pileType.print()
		}


		decisionCheck = () => {
			console.log("Types:");this.pileType.print()
			let t = this.pileType.pop()
			if(t != "bool"){
				throw `Tipo ${t} no esperado. Se esperaba 'bool'`;
			}
		}

		printQuads = () => {
			this.squats.forEach((el, i) => {
				console.log(`${i}: ${el.v1}\t${el.v2}\t${el.v3}\t${el.v4};`);
			});
		}

		private setQB = () => {
			let r = new HashMap<HashMap<HashMap<string>>>();
			let XD = {
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
						"*":"float",
						"/":"float",
						"<":"bool",
						">":"bool",
						"<=":"bool",
						">=":"bool",
						"==":"bool",
						"&&":"NOP",
						"||":"NOP",
						"=": "int"
					},
					"char":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
						"=": "NOP"
					},
					"bool":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
						"=": "NOP"
					},
					"void":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
						"=": "NOP"
					},
				},
				"float":{
					"int": {
						"+": "float",
						"-": "float",
						"*":"float",
						"/":"float",
						"<":"bool",
						">":"bool",
						"<=":"bool",
						">=":"bool",
						"==":"bool",
						"&&":"NOP",
						"||":"NOP",
						"=": "float"
					},
					"float": {
						"+": "float",
						"-": "float",
						"*":"float",
						"/":"float",
						"<":"bool",
						">":"bool",
						"<=":"bool",
						">=":"bool",
						"==":"bool",
						"&&":"NOP",
						"||":"NOP",
						"=": "float"
					},
					"char":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
						"=": "NOP"
					},
					"bool":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
						"=": "NOP"
					},
					"void":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
				},
				"char":{
					"int": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"float": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"char":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"bool",
						"&&":"NOP",
						"||":"NOP",
					},
					"bool":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"void":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
				},
				"bool":{
					"int": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"float": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"char":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"bool":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"bool",
						"&&":"bool",
						"||":"bool",
					},
					"void":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
				},
				"void":{
					"int": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"float": {
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"char":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"bool":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
					"void":{
						"+": "NOP",
						"-": "NOP",
						"*":"NOP",
						"/":"NOP",
						"<":"NOP",
						">":"NOP",
						"<=":"NOP",
						">=":"NOP",
						"==":"NOP",
						"&&":"NOP",
						"||":"NOP",
					},
				}
			}
			r.buildFromJSON(XD);
			
			this.qb = r;
		}

		constructor(){
			this.setQB();
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
				[`(int|float|char|bool)`,                   "return 'var_type';"],
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
			"SS"			: ["R_SS_VG R_SS_FD M"],
			/**/"R_SS_VG"		: [["VG", "yy.addJump(false);"]],
			/**/"R_SS_FD"		: [["FD", "yy.resolveJump();"]],
			"M"				: ["R_M_mainf s_par e_par VG R_M_B"],
			/**/"R_M_mainf"		: [["main_f", "yy.functionProc('main', 'void');"]],
			/**/"R_M_B"			: [["B", "yy.endFuncProc();"]],
			"B"				: ["s_bck ST e_bck"],
			/**/"VG"				: [["var_dec TD", 'yy.addFromString($2, yy.state);'], ["", ""]],
			"TD"				: [["var_type definer TDL1 e_stmt TDR", "$$ = [{t:$1, vs:$3}].concat($5);"]],
			"TDR"				: [["TD", "$$ = $1"], ["", "$$ = undefined"]],
			"TDL1"				: [["NODIMID TDL2", "$$ = [$1].concat($2); yy.pileType.pop();"]],
			"TDL2"				: [["separ NODIMID TDL2", "$$ = [$2].concat($3); yy.pileType.pop();"], ["", '']],
			"FD"				: [["FD_DEC_R R_FD_VG R_FD_B FD", ""], ["", ""]],
			/**/"R_FD_VG"			: [["VG", "yy.setLocalVarNumber();"]],
			/**/"FD_DEC_R"			: [["R_DEC_func s_par R_FD_PDL1 e_par e_stmt", "console.log('bbb', $3);yy.functionAddArgs($3);"]],
			/**/"R_DEC_func"		: [["func FTYPE id", "yy.functionProc($3, $2);"]],
			/**/"R_FD_PDL1"			: [["PDL1", "console.log('ARGS: ', $1);$$ = $1; console.log('ññññ', $1)"], ["", "console.log('EMPTY ARGS');$$ = [];"]],
			/**/"R_FD_B"			: [["B", "yy.endFuncProc();"]],
			"PDL1"				: [["R_PDL1_type PDL2", "$$ = [$1].concat($2);console.log('ddd', $$);"]],
			/**/"R_PDL1_type"	: [["var_type id", "$$ = {name: $2, type: $1};"]],
			"PDL2"				: [["separ R_PDL1_type PDL2", "$$ = [$2].concat($3)"], ["", "$$ = [];"]],
			"ST"				: ["STDEF ST", ""],
			/**/"STDEF"				: [["ASI e_stmt", "yy.pileType.pop();"], ["CALL e_stmt", ""], ["RET e_stmt", ""], ["REE e_stmt", ""], ["WRT e_stmt", ""], ["DEC", ""], ["REP", ""]],
			"CALL"				: [["R_CALL_ID s_par CALA e_par", "$$ = yy.callFunction_end();"]],
			/**/"R_CALL_ID"		: [["id", "yy.callFunction_start($1);"]],
			"CALA"				: [["R_CALA_XP0 CALA2", "yy.pileType.pop(); console.log('Types:');yy.pileType.print();"], ["", ""]],
			"CALA2"				: [["separ R_CALA_XP0 CALA2", "yy.pileType.pop();"], ["", ""]],
			/**/"R_CALA_XP0"	: [["XP0", "yy.callFunction_pushParam($1, yy.pileType.pop());"]],
			"ASI"				: [["ASI_DIMID_R ASI_EQ_R XP0", "yy.pushVal($3); yy.checkOperation(0); $$ = yy.pileVals.pop();"]],
			"ASI_DIMID_R"		: [["DIMID", 'yy.pushVal(yy.getVarSavedMemory($1.n, $1.d)); yy.pushType(yy.getVariableType($1.n));']],
			"ASI_EQ_R"			: [["eq", 'yy.pushOp($1)']],
			/**/"ASI_"				: [["ASI_DIMID_R ASI_EQ_R", ''], ["", '']],
			"RET"				: [["ret s_par XP0 e_par", "yy.functionReturnProc($3, yy.pileType.pop()); console.log(`AAAAAAj`, yy.funcTable.get(`holas`))"]],
			"REE"				: [["read s_par REE_ e_par", "yy.setReadProc($3);"]],
			/**/"REE_"			: [["DIMID REE__", "$$ = [yy.getVarSavedMemory($1.n, $1.d)].concat($2);"]],
			"REE__"				: [["separ DIMID REE__", "$$ = [yy.getVarSavedMemory($2.n, $2.d)].concat($3);"], ["", "$$ = [];"]],
			"WRT"				: [["write s_par WL e_par", "yy.setWriteProc($3);"]],
			"WL"				: [["W_C WL1", "$$ = $1.concat($2);"]],
			"WL1"				: [["separ W_C WL1", "$$ = $2.concat($3);"], ["", "$$ = [];"]],
			"W_C"				: [["XP0", "$$ = [$1];"]],
			"DEC"				: [["if s_par DEC_XP0_R e_par then B ELSE", 'yy.resolveJump()']],
			/**/"DEC_XP0_R"			: [["XP0", "yy.decisionCheck(); yy.addJumpF($1);"]],
			/*--*/"DEC_B_R"			: [["B", '']],
			"ELSE"				: ["ELSE_ELSE_R B", ""],
			/*--*/"ELSE_B_R"			: [["B", '']],
			"ELSE_ELSE_R"		: [["else", 'yy.elseIntersectionProc()']],
			"REP"				: ["COND", "NCOND"],
			"COND"				: ["COND_WHILE_R s_par COND_XP0_R e_par do COND_B_R"],
			/**/"COND_WHILE_R"		: [["while", "yy.addJumpSavepoint();"]],
			/**/"COND_XP0_R"		: [["XP0", "console.log('v', $1);yy.addJumpF($1); yy.pileVals.pop(); yy.pileType.pop()"]],
			/**/"COND_B_R"			: [["B", "yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true);"]],
			"NCOND"				: [["from NCOND_P1_R dof B", "yy.fromToSum(); yy.resolveJump(undefined, yy.squats.length + 1); yy.addJump(true)"]],
			/**/"NCOND_P1_R"		: [["ASI to XP0", "yy.pileFromTo.push($1); yy.pileFromToType.push(yy.pileType.peek()); yy.addJumpSavepoint(); yy.fromToComp($1, $3); yy.addJumpF(yy.pileVals.pop())"]],
			"DIMID"				: [["id DIMID_", '$$ = {n:$1, d:$2};']],
			/**/"DIMID_"			: [["DIMID_S_CORCH_R XP0 DIMID_E_CORCH_R", '$$ = $2; ;'], ["", '']],
			"DIMID_S_CORCH_R"	: [["s_corch", 'yy.pushCorchState();']],
			"DIMID_E_CORCH_R"	: [["e_corch", 'yy.popCorchState();']],
			"NODIMID"				: [["id NODIMID_", '$$ = {n:$1, d:$2};']],
			/**/"NODIMID_"			: [["s_corch INTEGER e_corch", '$$ = $2; yy.pileType.push("int")'], ["", '']],
			/**/"XP0"				: [["XP1 XP0_", "$$ = yy.pileVals.peek(); yy.endOperation();"]],
			/**/"XP0_"				: [["R_OP_T4 XP1 XP0_", "$$ = $2; console.log('first', $1, $2, yy.pileVals.peek());"], ["", "console.log('end');"]],
			"R_OP_T4"			: [["op_t4", "$$ = $1; yy.pushOp($1)"]],
			"XP1"				: [["XP2 XP1_", "yy.checkOperation('4')"]],
			"XP1_"				: [["R_OP_T3 XP1", "$$ = $1 + $2;"], ["", "$$ =``;"]],
			"R_OP_T3"			: [["op_t3", "$$ = $1; yy.pushOp($1)"]],
			"XP2"				: [["XP3 XP2_", "yy.checkOperation('3')"]],
			"XP2_"				: [["R_OP_T2 XP2", "$$ = $1 + $2;"], ["", "$$ = ``"]],
			"R_OP_T2"			: [["op_t2", "$$ = $1; yy.pushOp($1)"]],
			"XP3"				: [["R_XP4 XP3_", "yy.checkOperation('2')"]],
			"XP3_"				: [["R_OP_T1 XP3", "$$ = $1 + $2;"], ["", "$$ = ``"]],
			"R_XP4"				: [["XP4", "yy.checkOperation('1')"]],
			"R_OP_T1"			: [["op_t1", "$$ = $1; yy.pushOp($1)"]],
			"XP4"				: [["XPP", "$$ = $1; yy.pushVal($1);"], ["DIMID", "$$ = $1; yy.pushVal(yy.getVarSavedMemory($1.n, $1.d)); yy.pushType(yy.getVariableType($1.n))"], ["CALL", "$$ = $1; yy.pushVal(yy.getFuncSavedMemory($1)); yy.pushType(yy.getFunctionType($1));"], ["char", "$$ = $1; yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`char`);"], ["INTEGER", "$$ = $1; yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`int`); console.log('PUSHED')"], ["FLOAT", "$$ = $1;yy.pushVal(yy.getKnstSavedMemory($1)); yy.pushType(`float`);"]],
			"XPP"				: [["XPP_S_PAR_R XP0 XPP_E_PAR_R", "$$ = $2"]],
			"XPP_S_PAR_R"		: [["s_par", 'yy.pushParthState();']],
			"XPP_E_PAR_R"		: [["e_par", 'yy.popParthState();']],
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

	console.log(p.parse(`
			programa XD; 
			var int: x, y,z;

			funcion float holas();
			var float: v[2], r[2];
			{
				v[0] = 0;
				v[1] = 1;
				r[1] = 1;

				desde v[0] = 0 hasta 9 hacer
				{
					r[1] = r[1] + 1;
				}

				escribe(r[1]);
				escribe(v[0]);

				si(v[1] > 9) entonces{
					escribe (v[1]);
				}
				sino{
					escribe (r[1]);
				}

				regresa (r[1] + v[1] + r[1]);
			}

			funcion float fibby(int h);
			{
				regresa (1.0);
			}

			principal ()
			{
				x = 1+1 + holas();
				z = fibby(1);
				y = 1 + x;
				escribe(y);
			}
	`.replace("\t", "")));

	console.log(p.yy.printQuads());
	p.yy.varTable.print()
	p.yy.pileType.print();
	

	//p.yy.varTable.print();
	//p.yy.pileVals.print();

console.log("INICIA PROGRAMA");
	

	let VM = new KapussinoVirtualMachine(p.yy.squats, p.yy.funcTable, p.yy.constantsMemory);
	VM.resolve();
}

