export class Stack<T> {
    private stack : Array<T> = [];

    push(el : T) : void{
        this.stack.push(el);
    }

    pop() : T|undefined{
        return this.stack.pop();
    }

    peek() : T|undefined {
        if(!this.isEmpty()){
            return this.getLastElement();
        }
        else{
            return undefined;
        }
    }

    clear() : void {
        this.stack = [];
    }

    isEmpty() : boolean{
        return this.stack.length == 0;
    }

    private getLastElement() : T{
        return this.stack[this.stack.length - 1];
    }

    print(){
        let toPrint = "[ ";
        for (let i = 0; i < this.stack.length; i++) {
            const el = this.stack[i];
            toPrint += el + " ";
        }
        console.log(toPrint + "=");
        
    }

    constructor() {
        
    }
}