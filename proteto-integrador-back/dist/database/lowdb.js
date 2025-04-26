"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lowdb_1 = require("lowdb");
const node_1 = require("lowdb/node");
const adapter = new node_1.JSONFile('db.json');
const db = new lowdb_1.Low(adapter, { fornecedores: [], produtos: [], associacoes: [] });
exports.default = db;
