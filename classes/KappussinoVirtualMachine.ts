import { Tuple } from "../DataStruc/Tuple";
import { FuncTable } from "./FuncTable";

export class KapussinoVirtualMachine{
    
    private _quads : Array<Tuple<string, string, string, string>>;
    private _funcTable: FuncTable;
    private _

    constructor(quads: Array<Tuple<string, string, string, string>>, funcTable: FuncTable){
        this._quads = quads;
        this._funcTable = funcTable;
    }

    resolve(){
        this._quads.forEach(el => {
            this.resolveIt(el);
        });
    }

    private resolveIt(row: Tuple<string, string, string, string>){
        switch (row.v1) {
            case "WRITE":
                console.log(row.v4);
                break;
            default:
                break;
        }
    }
}