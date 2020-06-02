import { Tuple } from "../DataStruc/Tuple";
import { FuncTable } from "./FuncTable";
import { HashMap } from "../DataStruc/HashMap";
import { MortalKonstants } from "./MortalKonstants";

export class KapussinoVirtualMachine{
    
    private _quads : Array<Tuple<string, string, string, string>>;
    private _funcTable: FuncTable;
    private _mainMemory: HashMap<any>;
    private _constantMemory: MortalKonstants;
    private _constantUnderLimit: number = 0;
    private _constantUperLimit: number;

    constructor(quads: Array<Tuple<string, string, string, string>>, funcTable: FuncTable, constantMemory: MortalKonstants){
        this._quads = quads;
        this._funcTable = funcTable;
        this._mainMemory = new HashMap<any>();
        this._constantMemory = constantMemory;
        this._constantUperLimit = constantMemory.getMax()
    }

    resolve(){
        this._quads.forEach(el => {
            this.resolveIt(el);
        });
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

        switch (row.v1) {
            case "=":
                origin = this.resolvePointer(row.v2!);
                destiny = this.resolvePointer(row.v4!);
                console.log("origin : ",  origin);
                console.log("saved on:", destiny);
                
                
                data = this.getMemoryContent(origin);
                this._mainMemory.set(destiny, data);                
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

                console.log(`${ond1} + ${ond2}`);
                
                console.log("sum result: ", data);
                console.log("saved on:", destiny);
                
                

                this._mainMemory.set(destiny, data);
                break;
            case "-":
                ond1 = this.getMemoryContent(row.v2!);
                ond2 = this.getMemoryContent(row.v3!);
                destiny = row.v4!;
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) -
                            this.getNumber(ond2);
                }
                else{
                    data = ond1 + ond2;
                }

                this._mainMemory.set(destiny, data);
                break;
            case "*":
                ond1 = this.getMemoryContent(row.v2!);
                ond2 = this.getMemoryContent(row.v3!);
                destiny = row.v4!;
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) *
                            this.getNumber(ond2);
                }
                else{
                    throw "Error: Tipos incorrectos";
                }

                this._mainMemory.set(destiny, data);
                break;
            case "/":
                ond1 = this.getMemoryContent(row.v2!);
                ond2 = this.getMemoryContent(row.v3!);
                destiny = row.v4!;
                
                isNumber = this.isNumber(ond1) && 
                            this.isNumber(ond2);
                
                if(isNumber){
                    data = this.getNumber(ond1) /
                            this.getNumber(ond2);
                }
                else{
                    throw "Error: Tipos incorrectos";
                }

                this._mainMemory.set(destiny, data);
                break;
            case "WRITE":
                let dat = this._mainMemory.get(row.v4!);
                console.log(dat);
                break;
            default:
                break;
        }

        console.log("ENDED: " + row.v1 + "\n");
        
    }

    private resolvePointer(dir: string){       
         
        if(dir[0] == "*"){
            console.log(this._mainMemory.get(dir.slice(1)));
            return this._mainMemory.get(dir.slice(1));
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
            data = this._mainMemory.get(dir);
        }
        return data;
    }
}