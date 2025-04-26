"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lowdb_1 = __importDefault(require("../database/lowdb"));
const associacaoRoutes = (0, express_1.Router)();
// Listar fornecedores de um produto
associacaoRoutes.get('/:produtoId/fornecedores', async (req, res) => {
    await lowdb_1.default.read();
    const { produtoId } = req.params;
    const assoc = lowdb_1.default.data.associacoes.filter(a => a.produtoId === produtoId);
    const fornecedores = assoc
        .map(a => lowdb_1.default.data.fornecedores.find(f => f.id === a.fornecedorId))
        .filter(Boolean);
    res.json(fornecedores);
});
// Associar fornecedor a produto
associacaoRoutes.post('/:produtoId/fornecedores/:fornecedorId', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const { produtoId, fornecedorId } = req.params;
        if (!lowdb_1.default.data.produtos.find(x => x.id === produtoId)) {
            res.status(404).json({ error: 'Produto não existe' });
            return;
        }
        if (!lowdb_1.default.data.fornecedores.find(x => x.id === fornecedorId)) {
            res.status(404).json({ error: 'Fornecedor não existe' });
            return;
        }
        if (lowdb_1.default.data.associacoes.some(a => a.produtoId === produtoId && a.fornecedorId === fornecedorId)) {
            res.status(409).json({ error: 'Já associado' });
            return;
        }
        lowdb_1.default.data.associacoes.push({ produtoId, fornecedorId });
        await lowdb_1.default.write();
        res.status(201).json({ produtoId, fornecedorId });
    }
    catch (err) {
        next(err);
    }
});
// Desassociar fornecedor de produto
associacaoRoutes.delete('/:produtoId/fornecedores/:fornecedorId', async (req, res) => {
    await lowdb_1.default.read();
    const { produtoId, fornecedorId } = req.params;
    lowdb_1.default.data.associacoes = lowdb_1.default.data.associacoes.filter(a => !(a.produtoId === produtoId && a.fornecedorId === fornecedorId));
    await lowdb_1.default.write();
    res.status(204).send();
});
exports.default = associacaoRoutes;
