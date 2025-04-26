"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const lowdb_1 = __importDefault(require("../database/lowdb"));
const Produto_1 = require("../entities/Produto");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const produtoRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
produtoRoutes.use('/uploads', express_1.default.static(path_1.default.resolve('uploads')));
produtoRoutes.get('/', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        res.json(lowdb_1.default.data.produtos);
    }
    catch (err) {
        next(err);
    }
});
produtoRoutes.get('/:id', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const p = lowdb_1.default.data.produtos.find(x => x.id === req.params.id);
        if (!p) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json(p);
    }
    catch (err) {
        next(err);
    }
});
produtoRoutes.post('/', upload.single('imagem'), async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const { nomeProduto, codigoBarras, descricao, quantidadeEstoque, categoria, categoriaOutro, dataValidade } = req.body;
        const imagemUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const produto = new Produto_1.Produto({ nomeProduto, codigoBarras, descricao, quantidadeEstoque: Number(quantidadeEstoque), categoria, categoriaOutro, dataValidade, imagemUrl });
        lowdb_1.default.data.produtos.push(produto);
        await lowdb_1.default.write();
        res.status(201).json(produto);
    }
    catch (err) {
        next(err);
    }
});
produtoRoutes.put('/:id', upload.single('imagem'), async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const idx = lowdb_1.default.data.produtos.findIndex(x => x.id === req.params.id);
        if (idx < 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        const old = lowdb_1.default.data.produtos[idx];
        if (req.file && old.imagemUrl)
            fs_1.default.unlinkSync(path_1.default.join('uploads', path_1.default.basename(old.imagemUrl)));
        const update = { ...req.body };
        if (req.file)
            update.imagemUrl = `/uploads/${req.file.filename}`;
        update.quantidadeEstoque = update.quantidadeEstoque !== undefined ? Number(update.quantidadeEstoque) : old.quantidadeEstoque;
        lowdb_1.default.data.produtos[idx] = { ...old, ...update };
        await lowdb_1.default.write();
        res.json(lowdb_1.default.data.produtos[idx]);
    }
    catch (err) {
        next(err);
    }
});
produtoRoutes.delete('/:id', async (req, res, next) => {
    try {
        await lowdb_1.default.read();
        const p = lowdb_1.default.data.produtos.find(x => x.id === req.params.id);
        if (p?.imagemUrl)
            fs_1.default.unlinkSync(path_1.default.join('uploads', path_1.default.basename(p.imagemUrl)));
        lowdb_1.default.data.produtos = lowdb_1.default.data.produtos.filter(x => x.id !== req.params.id);
        await lowdb_1.default.write();
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = produtoRoutes;
