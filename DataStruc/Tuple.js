"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tuple = /** @class */ (function () {
    function Tuple(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10) {
        this._v1 = undefined;
        this._v2 = undefined;
        this._v3 = undefined;
        this._v4 = undefined;
        this._v5 = undefined;
        this._v6 = undefined;
        this._v7 = undefined;
        this._v8 = undefined;
        this._v9 = undefined;
        this._v10 = undefined;
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
    Object.defineProperty(Tuple.prototype, "v1", {
        get: function () {
            return this._v1;
        },
        set: function (value) {
            this._v1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v2", {
        get: function () {
            return this._v2;
        },
        set: function (value) {
            this._v2 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v3", {
        get: function () {
            return this._v3;
        },
        set: function (value) {
            this._v3 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v4", {
        get: function () {
            return this._v4;
        },
        set: function (value) {
            this._v4 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v5", {
        get: function () {
            return this._v5;
        },
        set: function (value) {
            this._v5 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v6", {
        get: function () {
            return this._v6;
        },
        set: function (value) {
            this._v6 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v7", {
        get: function () {
            return this._v7;
        },
        set: function (value) {
            this._v7 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v8", {
        get: function () {
            return this._v8;
        },
        set: function (value) {
            this._v8 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v9", {
        get: function () {
            return this._v9;
        },
        set: function (value) {
            this._v9 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tuple.prototype, "v10", {
        get: function () {
            return this._v10;
        },
        set: function (value) {
            this._v10 = value;
        },
        enumerable: true,
        configurable: true
    });
    Tuple.prototype.print = function () {
        var toPrint = "< ";
        if (this.v1)
            toPrint += this.getPossibleText(this.v1) + " ";
        if (this.v2)
            toPrint += this.getPossibleText(this.v2) + " ";
        if (this.v3)
            toPrint += this.getPossibleText(this.v3) + " ";
        if (this.v4)
            toPrint += this.getPossibleText(this.v4) + " ";
        if (this.v5)
            toPrint += this.getPossibleText(this.v5) + " ";
        if (this.v6)
            toPrint += this.getPossibleText(this.v6) + " ";
        if (this.v7)
            toPrint += this.getPossibleText(this.v7) + " ";
        if (this.v8)
            toPrint += this.getPossibleText(this.v8) + " ";
        if (this.v9)
            toPrint += this.getPossibleText(this.v9) + " ";
        if (this.v10)
            toPrint += this.getPossibleText(this.v10) + " ";
        console.log(toPrint + " >");
    };
    Tuple.prototype.getPossibleText = function (v) {
        try {
            if ("toString" in v)
                return v.toString();
            if ("print" in v)
                return v.print();
            return JSON.stringify(v);
        }
        catch (e) {
        }
        finally {
            return JSON.stringify(v);
        }
    };
    return Tuple;
}());
exports.Tuple = Tuple;
