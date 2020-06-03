import { HashMap } from "../DataStruc/HashMap";

export 	interface IArg{
    name: string;
    type: string;
    dir: string;
}

export 	interface IFuncTableRow{
    id: string;
    type: string;
    value: string | undefined;
    numLocalVars: number | undefined;
    args: Array<IArg>;
    ip: number | undefined;
    numTempVars: number | undefined;
    k: number;
}

export class FuncTable extends HashMap<IFuncTableRow>{
    constructor(){
        super();
    }
}