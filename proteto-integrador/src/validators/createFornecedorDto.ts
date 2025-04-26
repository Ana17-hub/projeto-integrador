import {IsEmail, IsNotEmpty, Matches} from 'class-validator';

export class CreateFornecedorDto {
    @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
    nomeEmpresa: string;

    @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
    @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
        message: 'CNPJ inválido. Use o formato 00.000.000/0000-00',
    })
    cnpj: string;

    @IsNotEmpty({ message: 'O endereço é obrigatório.' })
    endereco: string;

    @IsNotEmpty({ message: 'O telefone é obrigatório.' })
    @Matches(/^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/, {
        message: 'Telefone inválido. Use o formato (00) 0000-0000',
    })
    telefone: string;

    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    @IsEmail({}, { message: 'E-mail inválido.' })
    email: string;

    @IsNotEmpty({ message: 'O contato principal é obrigatório.' })
    contatoPrincipal: string;
}
