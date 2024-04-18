/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const classificacaoDAO = require('../model/DAO/classificacao.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoClassificacao = async function(dadosClassificacao, contentType){
    try{

        console.log(dadosClassificacao);
        
            // validação para aplicação do contentType
            if(String(contentType).toLowerCase() == 'application/json'){
        
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoClassificacaoJSON = {};
            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosClassificacao.caracteristicas == ''    || dadosClassificacao.caracteristicas == undefined       ||  dadosClassificacao.caracteristicas == null               || dadosClassificacao.caracteristicas.length > 150 ||
               dadosClassificacao.faixa_etaria == ''  ||   dadosClassificacao.faixa_etaria == undefined  || dadosClassificacao.faixa_etaria == null   || dadosClassificacao.faixa_etaria.length > 2 ||
               dadosClassificacao.classificacao == '' ||  dadosClassificacao.classificacao == undefined || dadosClassificacao.classificacao == null  || dadosClassificacao.classificacao.length > 45    
            ){
                
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
            
            } else {
        
                
        
             
             
        
                // Encaminha os dados do filme para o DAO inserir dados
                let novoClassificacao = await classificacaoDAO.insertClassificacao(dadosClassificacao);
        
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoClassificacao)
                {
        
                    let ultimoId = await classificacaoDAO.IDClassificacao()
                    console.log(ultimoId)
                    dadosClassificacao.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoClassificacaoJSON.classificacao  = dadosClassificacao
                    novoClassificacaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoClassificacaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoClassificacaoJSON.message = message.SUCCESS_CREATED_ITEM.message 
        
                    return novoClassificacaoJSON; // 201
                }else{
                 
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                  
              }
            } else {
                return message.ERROR_CONTENT_TYPE // 415
            }
        } catch(error){
            return message.ERROR_INTERNAL_SERVER // 500
        }
        
}

const setAtualizarNovoClassificacao = async function(id, dadoAtualizado, contentType){
    try{

        let idClassificacao = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = classificacaoDAO.selectByIdClassificacao()

            
            if(idClassificacao == '' || idClassificacao == undefined || idClassificacao == isNaN(idClassificacao) || idClassificacao == null){
                return message.ERROR_INVALID_ID
                
            }else if(idClassificacao>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarClassificacaoJSON = {}
                // console.log(idClassificacao);
                // console.log(dadoAtualizado);
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.caracteristica == ''    || dadoAtualizado.caracteristica == undefined       ||  dadoAtualizado.caracteristica == null               || dadoAtualizado.caracteristica.length > 150 ||
                    dadoAtualizado.faixa_etaria == ''  ||   dadoAtualizado.faixa_etaria == undefined  || dadoAtualizado.faixa_etaria == null   || dadoAtualizado.faixa_etaria.length > 2 ||
                    dadoAtualizado.classificacao == '' ||  dadoAtualizado.classificacao == undefined || dadoAtualizado.classificacao == null  || dadoAtualizado.classificacao.length > 45           
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosClassificacao = await classificacaoDAO.updateClassificacao(dadoAtualizado, idClassificacao)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosClassificacao){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarClassificacaoJSON.filme       = dadosClassificacao
                                atualizarClassificacaoJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarClassificacaoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarClassificacaoJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarClassificacaoJSON //201
                                
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB //500
                            }
                        
                
                    }
                    
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }


        }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setExcluirNovoClassificacao = async function(id){
    try {
        let idClassificacao = id
    
        if(idClassificacao == '' || idClassificacao == undefined || idClassificacao == isNaN(idClassificacao) || idClassificacao == null){
            return message.ERROR_INVALID_ID
        }else{
            let dadosClassificacao = await classificacaoDAO.deleteClassificacao(idClassificacao)
    
            if(dadosClassificacao){
                message.SUCCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const setListarClassificacao = async function(){
    try {
        let classificacaoJSON = {}

   let dadosClassificacao = await classificacaoDAO.selectAllClassificacao()
   {
    if(dadosClassificacao){

        if(dadosClassificacao.length> 0){
            classificacaoJSON.generos = dadosClassificacao
            classificacaoJSON.quantidade = dadosClassificacao.length
            classificacaoJSON.status_code = 200
            return classificacaoJSON
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

const setListarClassificacaoById = async function(id){
    try {
        // Recebe o id do filme
     
    let idClassificacao = id

    //Cria o objeto JSON
    let classificacaoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(id)

        // Validação para verificar se existem dados de retorno
        if(dadosClassificacao){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosClassificacao.length > 0){
                //Criar o JSON de retorno
                classificacaoJSON.genero = dadosClassificacao
                classificacaoJSON.status_code = 200
    
                
                return classificacaoJSON
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
    setInserirNovoClassificacao,
    setAtualizarNovoClassificacao,
    setExcluirNovoClassificacao,
    setListarClassificacao,
    setListarClassificacaoById
}