import { Tuple } from "../DataStruc/Tuple";
import { FuncTable, IFuncTableRow } from "./FuncTable";
import { HashMap } from "../DataStruc/HashMap";
import { MortalKonstants } from "./MortalKonstants";
import { Stack } from "../DataStruc/Stack";
import { Hash } from "crypto";

export class Context{
    public Mem: HashMap<any>;
    public IP: number;
    public SonCtxt: Context | undefined;

    constructor(IP: number = 0, mem: HashMap<any> = new HashMap<any>()){
        this.Mem = mem;
        this.IP = IP;
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

    constructor(quads: Array<Tuple<string, string, string, string>>, funcTable: FuncTable, constantMemory: MortalKonstants){
        this._quads = quads;
        this._funcTable = funcTable;
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax();
        this._ctxt = new Context();
        this._funcPile = new Stack<string>();
        this._contextPile = new Stack<Context>();
        
    }

    resolve(){
        if(this._ctxt.IP < this._quads.length)
            setTimeout(() => {
            ; this.resolveIter(this._ctxt.IP); this.resolve();}, 10);
    }

    private resolveIter(ip: number){
        const el = this._quads[ip];
        this.resolveIt(el);
    }

    private isMemInsideKnstn(dir: string) {
        let memoryIndex = (dir);
        let numIdx = parseInt(memoryIndex);
        
        return (this._constantUnderLimit <= numIdx
            && this._constantUperLimit > numIdx);
    }

    private resolveIt(row: Tuple<string, string, string, string>){
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
                this._ctxt.Mem.set(destiny, data);                
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

                this._ctxt.Mem.set(destiny, data);
                this.debug(`>>> ${data}`);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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
                

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
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

                this._ctxt.Mem.set(destiny, data);
                break;
            case "WRITE":
                let dat = this.getMemoryContent(this.resolvePointer(row.v4!));
                console.log("===PROGRAM SAYS", dat);
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

                break;
            case "PARAM":
                let func = this._funcTable.get(this._funcPile.peek()!)!;
                this._contextPile.peek()!.Mem.set(func.args[parseInt(row.v4!)].dir!, this.getMemoryContent(this.resolvePointer(row.v2!));
                break;
            case "GOSUB":

                this._contextPile.peek()!.SonCtxt = this._ctxt;
                this._ctxt = this._contextPile.pop()!;
                break;
            case "ENDFUNCTION":

                let pile = this._funcPile.pop();
                if(pile){
                    let func = this._funcTable.get(pile);
                    
                    let dir = func!.value!;
                    this._ctxt.SonCtxt!.Mem.set(dir, this._ctxt.Mem.get(dir));
                }

                if(this._ctxt.SonCtxt){
                    this._ctxt = this._ctxt.SonCtxt!;
                }
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

    private getMemoryContent(dir: string) {
        let data: any;
        
        if(this.isMemInsideKnstn(dir)){
            data = this._constantMemory.getFromDir(dir);
        }
        else{
            data = this._ctxt.Mem.get(dir);
        }
        return data;
    }

    private debug(...args: Array<any>){
        if(this._isDebug)
            console.log(...args);
        
    }
}