"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lowdb_1 = __importDefault(require("../database/lowdb"));
const Fornecedor_1 = require("../entities/Fornecedor");
const fornecedorRoutes = (0, express_1.Router)();
fornecedorRoutes.get('/', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        res.json(lowdb_1.default.data.fornecedores);
    }
    catch (err) {
        next(err);
    }
});
fornecedorRoutes.get('/:id', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const f = lowdb_1.default.data.fornecedores.find(x => x.id === req.params.id);
        if (!f) {
            res.status(404).json({ error: 'Fornecedor não encontrado' });
            return;
        }
        res.json(f);
    }
    catch (err) {
        next(err);
    }
});
fornecedorRoutes.post('/', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const fornecedor = new Fornecedor_1.Fornecedor(req.body);
        lowdb_1.default.data.fornecedores.push(fornecedor);
        await lowdb_1.default.write();
        res.status(201).json(fornecedor);
    }
    catch (err) {
        next(err);
    }
});
// Atualizar um fornecedor existente
fornecedorRoutes.put('/:id', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const idx = lowdb_1.default.data.fornecedores.findIndex(x => x.id === req.params.id);
        if (idx < 0) {
            res.status(404).json({ error: 'Fornecedor não encontrado' });
            return;
        }
        lowdb_1.default.data.fornecedores[idx] = { ...lowdb_1.default.data.fornecedores[idx], ...req.body };
        await lowdb_1.default.write();
        res.json(lowdb_1.default.data.fornecedores[idx]);
    }
    catch (err) {
        next(err);
    }
});
fornecedorRoutes.delete('/:id', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        lowdb_1.default.data.fornecedores = lowdb_1.default.data.fornecedores.filter(x => x.id !== req.params.id);
        await lowdb_1.default.write();
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = fornecedorRoutes;
