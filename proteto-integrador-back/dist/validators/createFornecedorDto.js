"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFornecedorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateFornecedorDto {
}
exports.CreateFornecedorDto = CreateFornecedorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome da empresa é obrigatório.' }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "nomeEmpresa", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O CNPJ é obrigatório.' }),
    (0, class_validator_1.Matches)(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
        message: 'CNPJ inválido. Use o formato 00.000.000/0000-00',
    }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O endereço é obrigatório.' }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "endereco", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O telefone é obrigatório.' }),
    (0, class_validator_1.Matches)(/^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/, {
        message: 'Telefone inválido. Use o formato (00) 0000-0000',
    }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido.' }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O contato principal é obrigatório.' }),
    __metadata("design:type", String)
], CreateFornecedorDto.prototype, "contatoPrincipal", void 0);
