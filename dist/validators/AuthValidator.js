"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    signup: (0, express_validator_1.checkSchema)({
        name: {
            trim: true,
            isLength: {
                options: {
                    min: 2
                }
            },
            errorMessage: 'Nome precisa de pelo menos 2 caracteres.'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido.'
        },
        password: {
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisa de pelo menos 2 caracteres.'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado não preenchido.'
        }
    }),
    signin: (0, express_validator_1.checkSchema)({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido.'
        },
        password: {
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisa de pelo menos 2 caracteres.'
        }
    })
};
