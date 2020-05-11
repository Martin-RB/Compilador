import { Tuple } from "./Tuple";

export class HashMap<T> {

    _array : Array<Tuple<string, T>> = [];

    public get(key : string) : T | undefined{

        for (let i = 0; i < this._array.length; i++) {
            const el = this._array[i];
            
            if(el.v1 == key){
                return el.v2;
            }
        }
        return undefined;
    }

    public set(key:string, value: T): void{
        for (let i = 0; i < this._array.length; i++) {
            const el = this._array[i];
            if(el.v1 == key){
                el.v2 = value;
                return;
            }
        }
        this._array.push(new Tuple<string, T>(key, value));
    }

    /**
     * exist
     */
    public exist(key : string) : boolean {
        for (let i = 0; i < this._array.length; i++) {
            const el = this._array[i];
            if(el.v1 == key){
                return true;
            }
        }
        return false;
    }

    public print(){
        this._array.forEach(el => {
            el.print()
        });
    }

    public buildFromJSON(obj: any){
        for (const key in obj) {
            
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if(typeof element == "object"){
                    let actual = new HashMap();
                    actual.buildFromJSON(element);
                    this._array.push(new Tuple<string, T>(key, actual as unknown as T));
                }
                else{                    
                    this._array.push(new Tuple<string, T>(key, element as unknown as T));
                }
            }
        }
    }
    
    constructor() {
        
    }
}