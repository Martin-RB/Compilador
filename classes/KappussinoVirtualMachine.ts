import { Tuple } from "../DataStruc/Tuple";
import { FuncTable, IFuncTableRow } from "./FuncTable";
import { HashMap } from "../DataStruc/HashMap";
import { MortalKonstants } from "./MortalKonstants";
import { Stack } from "../DataStruc/Stack";
import {createInterface} from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

export class Context{
    public Mem: HashMap<any>;
    public IP: number;
    public SonCtxt: Context | undefined;
    public FunctionName: string;

    constructor(IP: number = 0, mem: HashMap<any> = new HashMap<any>()){
        this.Mem = mem;
        this.IP = IP;
        this.FunctionName = "main";
    }
}

export class KapussinoVirtualMachine{
    
    private _quads : Array<Tuple<string, string, string, string>>;
    private _funcTable: FuncTable;
    private _funcPile: Stack<string>;
    private _constantMemory: MortalKonstants;
    private _constantUnderLimit: number = 0;
    private _constantUperLimit: number;
    private _ctxt: Context;
    private _contextPile: Stack<Context>;
    private _isDebug: boolean = false;
    private _functionKontext = 20000;

    constructor(quads: Array<Tuple<string, string, string, string>>, funcTable: FuncTable, constantMemory: MortalKonstants){
        this._quads = quads;
        this._funcTable = funcTable;
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
        this._ctxt = new Context();
        this._funcPile = new Stack<string>();
        this._contextPile = new Stack<Context>();
        
    }

    async resolve(){
        while(this._ctxt.IP < this._quads.length){
            await this.resolveIter(this._ctxt.IP);
            await this.awaiter(1);
        }
    }

    private awaiter(n:number): Promise<void>{
        return new Promise<void>((res) => {
            setTimeout(res,n);
        });
    }

    private async resolveIter(ip: number){
        const el = this._quads[ip];
        await this.resolveIt(el);
    }

    private isMemInsideKnstn(dir: string) {
        let memoryIndex = (dir);
        let numIdx = parseInt(memoryIndex);
        
        return (this._constantUnderLimit <= numIdx
            && this._constantUperLimit > numIdx);
    }

    private async resolveIt(row: Tuple<string, string, string, string>){
        let origin: string;
        let destiny: string;
        let data: any;
        let ond1: string;
        let ond2: string;
        let isNumber: boolean;
        let next: number | undefined;

        this.debug("IP:" , this._ctxt.IP);

        this._ctxt.IP += 1;
        

        switch (row.v1) {
            case "=":
                origin = this.resolvePointer(row.v2!);
                destiny = this.resolvePointer(row.v4!);                
                
                data = this.getMemoryContent(origin);
                this.debug(`>>> ${destiny} = ${data}: ${origin}`);
                this.setValueOnMemory(destiny, data);                
                break;
            case "+":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) +
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 + ond2;
                }

                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} + ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);

                this.setValueOnMemory(destiny, data);
                break;
            case "-":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) -
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 + ond2;
                }

                this.debug(`>>> ${ond1}:${this.resolvePointer(row.v2!)}:${row.v2!} - ${ond2}:${this.resolvePointer(row.v3!)}:${row.v3!} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "*":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) *
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 + ond2;
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} * ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "/":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) /
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 + ond2;
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} / ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case ">":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) >
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 > ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} > ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "<":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) <
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 < ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} < ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case ">=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) >=
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 >= ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} >= ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "<=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) <=
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 <= ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }

                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} <= ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                

                this.setValueOnMemory(destiny, data);
                break;
            case "==":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) ==
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 == ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }
                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} == ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "!=":
                ond1 = this.getMemoryContent(this.resolvePointer(row.v2!));
                ond2 = this.getMemoryContent(this.resolvePointer(row.v3!));
                destiny = this.resolvePointer(row.v4!);
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) !=
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 != ond2;
                }

                if(data as boolean){
                    data = "true";
                }
                else{
                    data = "false";
                }

                this.debug(`>>> ${ond1}: ${this.resolvePointer(row.v2!)} != ${ond2}: ${this.resolvePointer(row.v3!)} = ${data}:${destiny}`);
                this.setValueOnMemory(destiny, data);
                break;
            case "WRITE":
                let dat = this.getMemoryContent(this.resolvePointer(row.v4!));
                console.log("===PROGRAM SAYS", dat);
                break;
            case "READ":
                let toWrite = this.resolvePointer(row.v4!);
                this.setValueOnMemory(toWrite, await this.readLine());
                break;
            case "JUMP":
                next = this.getInt(row.v4!);
                this.debug(">>> DETECTADO JUMP. SALTANDO A " + next);
                if(!next) throw "Error: JUMP fuera de los limites";
                this._ctxt.IP = next;
                break;
            case "JUMPF":
                if(this.getMemoryContent(
                        this.resolvePointer(row.v2!)) as string
                        == "false"
                        )
                {                    
                    
                    next = this.getInt(row.v4!);
                    this.debug(">>> DETECTADO FALSE. SALTANDO A " + next);
                    if(!next) throw "Error: JUMP fuera de los limites";
                    this._ctxt.IP = next;
                }
                break;
            case "ERA":
                this._funcPile.push(this._funcTable.get(row.v4!)!.id);                
                this._contextPile.push(new Context(this._funcTable.get(row.v4!)!.ip));
                this._contextPile.peek()!.FunctionName = row.v4!;
                this.debug(`>>> Creando contexto para ${row.v4!}`);
                break;
            case "PARAM":
                let func = this._funcTable.get(this._funcPile.peek()!)!;
                this._contextPile.peek()!.Mem.set(func.args[parseInt(row.v4!)].dir!, this.getMemoryContent(this.resolvePointer(row.v2!)));
                this.debug(`>>> Parametro ${row.v4}: ${row.v2}`);
                break;
            case "GOSUB":

                this._contextPile.peek()!.SonCtxt = this._ctxt;
                this._ctxt = this._contextPile.pop()!;
                this.debug(`>>> Cambiando contexto a ${this._funcPile.peek()}. Saltando a ${this._ctxt.IP}`);
                break;
            case "ENDFUNCTION":
                let pile = this._funcPile.pop();
                
                if(pile){
                    let func = this._funcTable.get(pile);
                    
                    let dir = func!.value!;
                    this.setValueOnMemory(dir, this.getMemoryContent(dir));
                }

                if(this._ctxt.SonCtxt){
                    this._ctxt = this._ctxt.SonCtxt!;
                }
                this.debug(this._ctxt.FunctionName)
                break;
            default:
                break;
        }        
    }

    private resolvePointer(dir: string){       
        if(dir[0] == "*"){
            
            return this._ctxt.Mem.get(dir.slice(1));
        }
        return dir;
    }

    private isNumber(v: string){
        return this.isFloat(v) != undefined;
    }

    private getNumber(v: string){
        return parseFloat(v);
    }

    private getInt(value: string){
        let final;
        if(this.isInt(value)){
            final = parseInt(value);
        }
        return final;
    }

    private getFloat(value: string){
        let final;
        if(this.isFloat(value)){
            final = parseInt(value);
        }
        return final;
    }

    private getConvertedData(value: string){
        let final;
        if(this.isInt(value)){
            final = parseInt(value);
        }
        else if(this.isFloat(value)){
            final = parseFloat(value);
        }
        else{
            final = value;
        }
        return final;
    }

    private isInt(val: string){
        let res: number | undefined;
        try {
            res = parseInt(val);
        } catch (error) {
            
        }
        return res != undefined;
    }

    private isFloat(val: string){
        let res: number | undefined;
        try {
            res = parseFloat(val);
        } catch (error) {
            
        }
        return res != undefined;
    }

    private setValueOnMemory(dir: string, val: any){
        let ctxt : Context | undefined;
        ctxt = this._ctxt;
        if(this._functionKontext > parseInt(dir)){
            
            while(ctxt.SonCtxt != undefined){
                ctxt = ctxt!.SonCtxt;
            }
        }
        if(!ctxt) throw "No Context";
        
        ctxt.Mem.set(dir, val);
        //this.debug(`>>> Saved ${this.getMemoryContent(dir)} (${dir}) on context ${ctxt.FunctionName}`);

    }

    private getMemoryContent(dir: string) {
        let data: any;
        let ctxt: Context | undefined;
        let ctxtName: string = "";
        
        if(this.isMemInsideKnstn(dir)){
            data = this._constantMemory.getFromDir(dir);
        }
        else{
            ctxt = this._ctxt;
            do{
                if(!ctxt) throw "";
                data = ctxt.Mem.get(dir);
                ctxtName = ctxt.FunctionName;
                ctxt = ctxt.SonCtxt;
            }
            while(data == undefined && ctxt != undefined);
        }
        //this.debug(`>>> GOT ${data} (${dir}) on context ${ctxtName}`);
        return data;
    }

    private debug(...args: Array<any>){
        if(this._isDebug)
            console.log(...args);
        
    }

    private readLine(): Promise<string>{
        return new Promise((res) => {
            rl.question("", (answ) => {
                res(answ);
            })
        });
    }
}