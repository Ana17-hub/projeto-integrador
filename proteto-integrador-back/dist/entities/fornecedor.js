"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fornecedor = void 0;
const crypto_1 = require("crypto");
class Fornecedor {
    constructor(props) {
        this.id = (0, crypto_1.randomUUID)();
        Object.assign(this, props);
    }
}
exports.Fornecedor = Fornecedor;
