/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const sexoDAO = require('../model/DAO/sexo.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setListarSexo = async function(){
    try {
        let sexoJSON = {}

   let dadosSexo = await sexoDAO.selectAllSexo()
   {
    if(dadosSexo){

        if(dadosSexo.length> 0){
            sexoJSON.generos = dadosSexo
            sexoJSON.quantidade = dadosSexo.length
            sexoJSON.status_code = 200
            return sexoJSON
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

const setListarSexoById = async function(id){
    try {
        // Recebe o id do filme
     
    let idSexo = id

    //Cria o objeto JSON
    let sexoJSON = {}

    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idSexo == '' || idSexo == undefined || isNaN(idSexo)){
        return message.ERROR_INVALID_ID // 400
    }else{
        
        //Encaminha para o DAO localizar o id do filme 
        let dadosSexo = await sexoDAO.selectByIdSexo(id)
        
        
        // Validação para verificar se existem dados de retorno
        if(dadosSexo){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosSexo.length > 0){
                //Criar o JSON de retorno
                sexoJSON.sexo = dadosSexo
                 sexoJSON.status_code = 200
    
                
                return sexoJSON
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
    setListarSexo,
    setListarSexoById
}

