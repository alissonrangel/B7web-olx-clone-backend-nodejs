import {checkSchema} from 'express-validator'

export default {
  signup: checkSchema({
    name:{
      notEmpty: true,
      trim: true,
      isLength:{
        options: {
          min: 2
        }
      },
      errorMessage: 'Nome precisa de pelo menos 2 caracteres.'
    },
    email:{
      notEmpty: true,
      isEmail: true,
      normalizeEmail: true,
      errorMessage: 'E-mail inválido.'
    },
    password: {
      // notEmpty: true, // se eu boto um minimo não precisa notEmpty
      isLength:{
        options: { min: 2 }
      },
      errorMessage: 'Senha precisa de pelo menos 2 caracteres.'
    },
    state: {
      notEmpty: true,
      errorMessage: 'Estado não preenchido.'
    }
  }),
  signin: checkSchema({
    email:{
      isEmail: true,
      normalizeEmail: true,
      errorMessage: 'E-mail inválido.'
    },
    password: {
      isLength:{
        options: { min: 2 }
      },
      errorMessage: 'Senha precisa de pelo menos 2 caracteres.'
    }
  })
}