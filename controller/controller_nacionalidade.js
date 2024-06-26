/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const nacionalidadeDAO = require('../model/DAO/nacionalidade.js')
const sexoDAO = require('../model/DAO/sexo.js')
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
            nacionalidadeJSON.nacionalidade = dadosNacionalidade
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

const setListarAtorNacionalidade = async function(nome){
    let nomeNacionalidade = nome

    let nacionalidadeJSON = {}

    if(nomeNacionalidade == '' || nomeNacionalidade == undefined){
        return message.ERROR_INVALID_ID // 400
    }else{
        let dadosNacionalidade = await nacionalidadeDAO.selectAtorByNacionalidade(nomeNacionalidade)

    
        if(dadosNacionalidade){
    
            if(dadosNacionalidade.length > 0){
                for(let atores of dadosNacionalidade){
                    let sexoAtor = await sexoDAO.selectByIdSexo(atores.id_sexo)
                    let nacionalidadeAtor = await nacionalidadeDAO.selectNacionalidadeAtor(atores.id_ator)
                    delete atores.id_sexo
                    atores.sexo = sexoAtor
                    atores.nacionalidade = nacionalidadeAtor
                }
                nacionalidadeJSON.Atores = dadosNacionalidade
                nacionalidadeJSON.quantidade = dadosNacionalidade.length
                nacionalidadeJSON.status_code = 200
                
                return nacionalidadeJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
}

const setInserirNacionalidadeAtor = async function (dados,contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let nacionalidadeAdicionadaJSON = {}
    if (dados.id_ator == ''|| dados.id_ator == undefined|| dados.id_ator == null||isNaN(dados.id_ator)||
        dados.id_nacionalidade == ''|| dados.id_nacionalidade == undefined|| dados.id_nacionalidade == null||isNaN(dados.id_nacionalidade)
){
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
            let novaNacionalidadeAdicionada = await nacionalidadeDAO.addNacionalidadeAtor(dados)
            if(novaNacionalidadeAdicionada) {
                nacionalidadeAdicionadaJSON.nacionalidade = dados
                nacionalidadeAdicionadaJSON.status = message.SUCCESS_CREATED_ITEM.status
                nacionalidadeAdicionadaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                nacionalidadeAdicionadaJSON.message = message.SUCCESS_CREATED_ITEM.message
                return nacionalidadeAdicionadaJSON //201
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
    }
} else {
    return message.ERROR_CONTENT_TYPE // 415
}
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}

const setInserirNacionalidadeDiretor = async function (dados,contentType) {
    try {
    if (String(contentType).toLowerCase() == 'application/json'){
    let nacionalidadeAdicionadaJSON = {}
    if (dados.id_diretor == ''|| dados.id_diretor == undefined|| dados.id_diretor == null||isNaN(dados.id_diretor)||
        dados.id_nacionalidade == ''|| dados.id_nacionalidade == undefined|| dados.id_nacionalidade == null||isNaN(dados.id_nacionalidade)
){
       return message.ERROR_REQUIRED_FIELDS //400
    } else {
            let novaNacionalidadeAdicionada = await nacionalidadeDAO.addNacionalidadeDiretor(dados)
            if(novaNacionalidadeAdicionada) {
                nacionalidadeAdicionadaJSON.nacionalidade = dados
                nacionalidadeAdicionadaJSON.status = message.SUCCESS_CREATED_ITEM.status
                nacionalidadeAdicionadaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                nacionalidadeAdicionadaJSON.message = message.SUCCESS_CREATED_ITEM.message
                return nacionalidadeAdicionadaJSON //201
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
    }
} else {
    return message.ERROR_CONTENT_TYPE // 415
}
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}

module.exports = {
    setListarNacionalidade,
    setListarNacionalidadeById,
    setListarAtorNacionalidade,
    setInserirNacionalidadeAtor,
    setInserirNacionalidadeDiretor
}