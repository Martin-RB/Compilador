"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stack = /** @class */ (function () {
    function Stack() {
        this.stack = [];
    }
    Stack.prototype.push = function (el) {
        this.stack.push(el);
    };
    Stack.prototype.pop = function () {
        return this.stack.pop();
    };
    Stack.prototype.peek = function () {
        if (!this.isEmpty()) {
            return this.getLastElement();
        }
        else {
            return undefined;
        }
    };
    Stack.prototype.clear = function () {
        this.stack = [];
    };
    Stack.prototype.isEmpty = function () {
        return this.stack.length == 0;
    };
    Stack.prototype.getLastElement = function () {
        return this.stack[this.stack.length - 1];
    };
    Stack.prototype.print = function () {
        var toPrint = "[ ";
        for (var i = 0; i < this.stack.length; i++) {
            var el = this.stack[i];
            toPrint += el + " ";
        }
        console.log(toPrint + "=");
    };
    return Stack;
}());
exports.Stack = Stack;
