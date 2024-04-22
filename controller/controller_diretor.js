/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const diretorDAO = require('../model/DAO/diretor.js')
const sexoDAO = require ('../model/DAO/sexo.js')
const nacionalidadeDAO = require ('../model/DAO/nacionalidade.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')


const setExcluirDiretor = async function(id){
    try {
        let idDiretor = id
    
        if(idDiretor == '' || idDiretor == undefined || idDiretor == isNaN(idDiretor) || idDiretor == null){
            return message.ERROR_INVALID_ID
        }else{
            let dadosDiretor = await diretorDAO.deleteDiretor(idDiretor)
            let deleteDiretor = await diretorDAO.deleteDiretorNacionalidade(idDiretor)
    
            if(dadosDiretor || deleteDiretor){
               return message.SUCCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const setListarDiretor = async function(){
    try {
        let diretorJSON = {}

   let dadosDiretor = await diretorDAO.selectAllDiretor()
   {
    if(dadosDiretor){

        if(dadosDiretor.length> 0){
            for(let diretores of dadosDiretor){
                let sexoDiretor = await sexoDAO.selectByIdSexo(diretores.id_sexo)
                let nacionalidadeDiretor = await nacionalidadeDAO.selectNacionalidadeDiretor(diretores.id_diretor)
                delete diretores.id_sexo
                diretores.sexo = sexoDiretor
                diretores.nacionalidade = nacionalidadeDiretor
            }
            // for(let nacional of dadosAtor){
            //     let nacionalAtor = await nacionalidadeDAO.selectByIdNacionalidade(nacional.id_nacionalidade)
            //     delete nacional.id_nacionalidade
            //     nacional.nacionalidade = nacionalAtor
            // }
            diretorJSON.diretores = dadosDiretor
            diretorJSON.quantidade = dadosDiretor.length
            diretorJSON.status_code = 200
            return diretorJSON
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

const setListarDiretorById = async function(id){
     // Recebe o id do filme
     let idDiretor = id

     //Cria o objeto JSON
     let diretorJSON = {}
 
 
     //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
     if(idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)){
         return message.ERROR_INVALID_ID // 400
     }else{
 
         //Encaminha para o DAO localizar o id do filme 
         let dadosDiretor = await diretorDAO.selectByIdDiretor(idDiretor)
 
 
         // Validação para verificar se existem dados de retorno
         if(dadosDiretor){
 
             // Validação para verificar a quantidade de itens encontrados.
             if(dadosDiretor.length > 0){

                for(let diretores of dadosDiretor){
                    let sexoDiretor = await sexoDAO.selectByIdSexo(diretores.id_sexo)
                    let nacionalidadeDiretor = await nacionalidadeDAO.selectNacionalidadeDiretor(diretores.id_diretor)
                    delete diretores.id_sexo
                    diretores.sexo = sexoDiretor
                    diretores.nacionalidade = nacionalidadeDiretor
                }

                 //Criar o JSON de retorno
                 diretorJSON.diretor = dadosDiretor
                 diretorJSON.status_code = 200
     
                 return diretorJSON
             }else{
                 return message.ERROR_NOT_FOUND // 404
             }
 
         }else{
             return message.ERROR_INTERNAL_SERVER_DB // 500
         }
     }
}


module.exports = {
    setExcluirDiretor,
    setListarDiretor,
    setListarDiretorById
}