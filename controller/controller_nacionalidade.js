/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const nacionalidadeDAO = require('../model/DAO/nacionalidade.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setListarNacionalidade = async function(){
    try {
        let nacionalidadeJSON = {}

   let dadosNacionalidade = await nacionalidadeDAO.selectAllNacionalidade()
   {
    if(dadosNacionalidade){

        if(dadosNacionalidade.length> 0){
            nacionalidadeJSON.generos = dadosNacionalidade
            nacionalidadeJSON.quantidade = dadosNacionalidade.length
            nacionalidadeJSON.status_code = 200
            return nacionalidadeJSON
        }else{
            return message.ERROR_NOT_FOUND
        }
    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }

    } 
    }
    catch (error) {
        return message.ERROR_INTERNAL_SERVER
}
}

const setListarNacionalidadeById = async function(id){
    try {
        // Recebe o id do filme
     
    let idNacionalidade = id

    //Cria o objeto JSON
    let nacionalidadeJSON = {}

    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)){
        return message.ERROR_INVALID_ID // 400
    }else{
        
        //Encaminha para o DAO localizar o id do filme 
        let dadosNacionalidade = await nacionalidadeDAO.selectByIdNacionalidade(id)
        
        
        // Validação para verificar se existem dados de retorno
        if(dadosNacionalidade){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosNacionalidade.length > 0){
                //Criar o JSON de retorno
                nacionalidadeJSON.nacionalidade = dadosNacionalidade
                 nacionalidadeJSON.status_code = 200
    
                
                return nacionalidadeJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
   } catch (error) {
       return message.ERROR_INTERNAL_SERVER_DB
   }
}

module.exports = {
    setListarNacionalidade,
    setListarNacionalidadeById
}