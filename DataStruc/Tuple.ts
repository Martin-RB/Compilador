export class Tuple<T1,T2,T3 = any,T4 = any,T5 = any,T6 = any,T7 = any,T8 = any,T9 = any,T10 = any>{
    private _v1 : T1|undefined = undefined;
    private _v2 : T2|undefined = undefined;
    private _v3 : T3|undefined = undefined;
    private _v4 : T4|undefined = undefined;
    private _v5 : T5|undefined = undefined;
    private _v6 : T6|undefined = undefined;
    private _v7 : T7|undefined = undefined;
    private _v8 : T8|undefined = undefined;
    private _v9 : T9|undefined = undefined;
    private _v10 : T10|undefined = undefined;

    constructor(v1 : T1, v2: T2, v3? : T3, v4? : T4, v5? : T5, v6? : T6, v7? : T7, v8? : T8, v9? : T9, v10? : T10){
        this._v1 = v1;
        this._v2 = v2;
        this._v3 = v3;
        this._v4 = v4;
        this._v5 = v5;
        this._v6 = v6;
        this._v7 = v7;
        this._v8 = v8;
        this._v9 = v9;
        this._v10 = v10;
    }

    public get v1(): T1| undefined{
        return this._v1;
    }
    public get v2(): T2| undefined{
        return this._v2;
    }
    public get v3(): T3| undefined{
        return this._v3;
    }
    public get v4(): T4| undefined{
        return this._v4;
    }
    public get v5(): T5| undefined{
        return this._v5;
    }
    public get v6(): T6| undefined{
        return this._v6;
    }
    public get v7(): T7| undefined{
        return this._v7;
    }
    public get v8(): T8| undefined{
        return this._v8;
    }
    public get v9(): T9| undefined{
        return this._v9;
    }
    public get v10(): T10| undefined{
        return this._v10;
    }

    public set v1(value: T1 | undefined){
        this._v1 = value;
    }
    public set v2(value: T2 | undefined){
        this._v2 = value;
    }
    public set v3(value: T3 | undefined){
        this._v3 = value;
    }
    public set v4(value: T4 | undefined){
        this._v4 = value;
    }
    public set v5(value: T5 | undefined){
        this._v5 = value;
    }
    public set v6(value: T6 | undefined){
        this._v6 = value;
    }
    public set v7(value: T7 | undefined){
        this._v7 = value;
    }
    public set v8(value: T8 | undefined){
        this._v8 = value;
    }
    public set v9(value: T9 | undefined){
        this._v9 = value;
    }
    public set v10(value: T10 | undefined){
        this._v10 = value;
    }

    public print(){
        let toPrint = "< ";
        if(this.v1) toPrint += this.getPossibleText(this.v1) + " ";
        if(this.v2) toPrint += this.getPossibleText(this.v2) + " ";
        if(this.v3) toPrint += this.getPossibleText(this.v3) + " ";
        if(this.v4) toPrint += this.getPossibleText(this.v4) + " ";
        if(this.v5) toPrint += this.getPossibleText(this.v5) + " ";
        if(this.v6) toPrint += this.getPossibleText(this.v6) + " ";
        if(this.v7) toPrint += this.getPossibleText(this.v7) + " ";
        if(this.v8) toPrint += this.getPossibleText(this.v8) + " ";
        if(this.v9) toPrint += this.getPossibleText(this.v9) + " ";
        if(this.v10) toPrint += this.getPossibleText(this.v10) + " ";
        console.log(toPrint + " >");
    }

    private getPossibleText(v: any){
        try{
            if("toString" in v) return v.toString();
            if("print" in v) return v.print();
            return JSON.stringify(v);
        }
        catch(e){
        }
        finally{
            return JSON.stringify(v);
        }
    }
}