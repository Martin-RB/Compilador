export class Queue <T>{
    private _array : Array<T> = [];

    push(element:T) : void{
        this._array = [element].concat(this._array);
    }

    pop() : T | undefined{
        return this._array.pop();
    }

    peek() : T | undefined{
        return this._array[this._array.length - 1];
    }

    isEmpty() : boolean{
        return this._array.length == 0;
    }

    clear() : void{
        this._array = [];
    }
    constructor() {
        
    }
}