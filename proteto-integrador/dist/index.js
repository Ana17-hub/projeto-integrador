"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fornecedorRoutes_1 = __importDefault(require("./routes/fornecedorRoutes"));
const produtoRoutes_1 = __importDefault(require("./routes/produtoRoutes"));
const associacaoRoutes_1 = __importDefault(require("./routes/associacaoRoutes"));
const lowdb_1 = __importDefault(require("./database/lowdb"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads')));
async function bootstrap() {
    try {
        // Leia e inicialize o banco somente dentro de uma função async
        await lowdb_1.default.read();
        await lowdb_1.default.write();
        // Monte suas rotas só depois
        app.use('/fornecedores', fornecedorRoutes_1.default);
        app.use('/produtos', produtoRoutes_1.default);
        app.use('/associacoes', associacaoRoutes_1.default);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    }
    catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
}
// Chama a função
bootstrap();
