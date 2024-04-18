/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const atorDAO = require('../model/DAO/ator.js')
const sexoDAO = require ('../model/DAO/sexo.js')
const nacionalidadeDAO = require ('../model/DAO/nacionalidade.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoClassificacao = async function(dadosClassificacao, contentType){}

const setAtualizarNovoClassificacao = async function(id, dadoAtualizado, contentType){}

const setExcluirNovoClassificacao = async function(id){}

const setListarAtor = async function(){
    try {
        let atorJSON = {}

   let dadosAtor = await atorDAO.selectAllAtor()
   console.log(dadosAtor)
   {
    if(dadosAtor){

        if(dadosAtor.length> 0){
            for(let atores of dadosAtor){
                let sexoAtor = await sexoDAO.selectByIdSexo(atores.id_sexo)
                delete atores.id_sexo
                atores.sexo = sexoAtor
            }
            // for(let nacional of dadosAtor){
            //     let nacionalAtor = await nacionalidadeDAO.selectByIdNacionalidade(nacional.id_nacionalidade)
            //     delete nacional.id_nacionalidade
            //     nacional.nacionalidade = nacionalAtor
            // }
            atorJSON.ator = dadosAtor
            atorJSON.quantidade = dadosAtor.length
            atorJSON.status_code = 200
            return atorJSON
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

const setListarAtorById = async function(id){
     // Recebe o id do filme
     let idAtor = id

     //Cria o objeto JSON
     let atorJSON = {}
 
 
     //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
     if(idAtor == '' || idAtor == undefined || isNaN(idAtor)){
         return message.ERROR_INVALID_ID // 400
     }else{
 
         //Encaminha para o DAO localizar o id do filme 
         let dadosAtor = await atorDAO.selectByIdAtor(idAtor)
 
 
         // Validação para verificar se existem dados de retorno
         if(dadosFilme){
 
             // Validação para verificar a quantidade de itens encontrados.
             if(dadosFilme.length > 0){
                 //Criar o JSON de retorno
                 filmesJSON.filmes = dadosFilme
                 filmesJSON.status_code = 200
     
                 return filmesJSON
             }else{
                 return message.ERROR_NOT_FOUND // 404
             }
 
         }else{
             return message.ERROR_INTERNAL_SERVER_DB // 500
         }
     }
}

module.exports = {
    setListarAtor
}