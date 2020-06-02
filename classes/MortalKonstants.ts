import { HashMap } from "../DataStruc/HashMap";

// Constant's memory
export class MortalKonstants{
    private _constants: number;
    private _max: number;
    private _registered: HashMap<number>;
    private _dirRelation: HashMap<string>;
    constructor(offset: number, size: number){
        this._constants = offset;
        this._max = size;
        this._registered = new HashMap<number>();
        this._dirRelation = new HashMap<string>();
    }

    request(constant: string){
        let val = this._registered.get(constant);
        if(!val){
            let mem = this.getNewMemory();
            this._registered.set(constant, mem);
            this._dirRelation.set(mem.toString(), constant);
            val = this._registered.get(constant);
        }
        return `${val}`;
    }

    getFromDir(dir: string) {
        return this._dirRelation.get(dir);
    }

    getMax() {
        return this._max;
    }

    private getNewMemory(){
        let num = this._constants;
        this._constants++;
        if(this._constants >= this._max){
            throw "Sobrecarga de memoria para enteros";
        }
        return num;
    }
}