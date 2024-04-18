/****************************************************************
 * Objetivo: Arquivo responsavel pelas validações e consistências de dados de filme
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const generoDAO = require('../model/DAO/genero.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoGenero = async function(dadosGenero, contentType){
    try{
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
    
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoGeneroJSON = {}
            
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosGenero.nome == ''                  || dadosGenero.nome == undefined            || dadosGenero.nome == null            || dadosGenero.nome.length > 45           
                ){
                    return message.ERROR_REQUIRED_FIELDS
                }
            
                else{
            
                    let validateStatus = true
            
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novoGenero = await generoDAO.insertGenero(dadosGenero)
                        
                        if(novoGenero){
                            let idGenero = await generoDAO.IDGenero()
                            dadosGenero.id = Number(idGenero[0].id)
                        }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoGenero){
                
                            //Cria o JSON de retorno dos dados (201)
                            novoGeneroJSON.filme       = dadosGenero
                            novoGeneroJSON.status      = message.SUCCESS_CREATED_ITEM.status
                            novoGeneroJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoGeneroJSON.message     = message.SUCCESS_CREATED_ITEM.message
                
                            return novoGeneroJSON //201
                            
                        }else{
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    }else{
                        validateStatus = false
                    }
            
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }

}

const setAtualizarGenero = async function(id, dadoAtualizado, contentType){

    try{

        let idGenero = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = generoDAO.selectByIdGenero()
            
            if(idGenero == '' || idGenero == undefined || idGenero == isNaN(idGenero) || idGenero == null){
                return message.ERROR_INVALID_ID

            }else if(idGenero>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                    let atualizarGeneroJSON = {}

                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome == ''                  || dadoAtualizado.nome == undefined            || dadoAtualizado.nome == null            || dadoAtualizado.nome.length > 80          
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{
                        let validateStatus = true

                          
                
                        // Validação para verificar se a variavel booleana é verdadeira
                        if(validateStatus){
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosGenero = await generoDAO.updateGenero(idGenero, dadoAtualizado)
                            
                            // Validação para verificar se o DAO inseriu os dados do DB
                            console.log(dadosGenero)
                            if(dadosGenero){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarGeneroJSON.filme       = dadosGenero
                                atualizarGeneroJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarGeneroJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarGeneroJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarGeneroJSON //201
                                
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB //500
                            }
                        }else{
                            validateStatus = false
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

const setExcluirGenero = async function(id){
try {
    let idGenero = id

    if(idGenero == '' || idGenero == undefined || idGenero == isNaN(idGenero) || idGenero == null){
        return message.ERROR_INVALID_ID
    }else{
        let dadosGenero = await generoDAO.deleteGenero(idGenero)

        if(dadosGenero){
            message.SUCCESS_DELETED_ITEM
        }else{
            return message.ERROR_NOT_FOUND
        }
    }
} catch (error) {
    return message.ERROR_INTERNAL_SERVER
}
}

const getListarGenero = async function(){
  

    try {
        let generoJSON = {}

   let dadosGenero = await generoDAO.selectAllGenero()
   {
    if(dadosGenero){

        if(dadosGenero.length> 0){
            generoJSON.generos = dadosGenero
            generoJSON.quantidade = dadosGenero.length
            generoJSON.status_code = 200
            return generoJSON
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
}}

const getBuscarGenero = async function(id){
    try {
         // Recebe o id do filme
      
     let idGenero = id

     //Cria o objeto JSON
     let generoJSON = {}
 
 
     //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
     if(idGenero == '' || idGenero == undefined || isNaN(idGenero)){
         return message.ERROR_INVALID_ID // 400
     }else{
 
         //Encaminha para o DAO localizar o id do filme 
         let dadosGenero = await generoDAO.selectByIdGenero(id)
 
         // Validação para verificar se existem dados de retorno
         if(dadosGenero){
 
             // Validação para verificar a quantidade de itens encontrados.
             if(dadosGenero.length > 0){
                 //Criar o JSON de retorno
                 generoJSON.genero = dadosGenero
                 generoJSON.status_code = 200
     
                 
                 return generoJSON
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

const getNomeGenero = async function(nome){
    let nomeGenero = nome

    let generoJSON = {}

    if(nomeGenero == '' || nomeGenero == undefined){
        return message.ERROR_INVALID_ID // 400
    }else{
        let dadosGenero = await generoDAO.selectNameGenero(nome)
    
        if(dadosGenero){
    
            if(dadosGenero.length > 0){
                generoJSON.nome = dadosGenero
                generoJSON.quantidade = dadosGenero.length
                generoJSON.status_code = 200
                
                return generoJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
}

module.exports = {
    setInserirNovoGenero,
    setAtualizarGenero,
    setExcluirGenero,
    getListarGenero,
    getBuscarGenero,
    getNomeGenero
    
}


// let idGenero = id

        // // Validação de content-type (apenas aplication/json)
        // if(String(contentType).toLowerCase() == 'application/json'){
        //     let dadosID = generoDAO.selectByIdGenero()
            
        //     if(idGenero == '' || idGenero == undefined || idGenero == isNaN(idGenero) || idGenero == null){
        //         return message.ERROR_INVALID_ID

        //     }else if(idGenero>dadosID.length){
        //         return message.ERROR_NOT_FOUND
        //     }else{
        //         // Cria o objeto JSON para devolver os dados criados na requisição
        //             let atualizarGeneroJSON = {}

        //             //Validação de campos obrigatórios ou com digitação inválida
        //             if(dadoAtualizado.nome == ''                  || dadoAtualizado.nome == undefined            || dadoAtualizado.nome == null            || dadoAtualizado.nome.length > 80          
                    
        //             ){
        //                 return message.ERROR_REQUIRED_FIELDS
        //             }
                
        //             else{
        //                 let validateStatus = false

                        
                
                    
                
        //                 // Validação para verificar se a variavel booleana é verdadeira
        //                 if(validateStatus){
                
        //                     // Encaminha os dados do filme para o DAO inserir no DB
        //                     let dadosGenero = await generoDAO.updateGenero(idGenero, dadoAtualizado)
                            
        //                     // Validação para verificar se o DAO inseriu os dados do DB
        //                     console.log(dadosGenero)
        //                     if(dadosGenero){
                    
        //                         //Cria o JSON de retorno dos dados (201)
        //                         atualizarGeneroJSON.filme       = dadosGenero
        //                         atualizarGeneroJSON.status      = message.SUCCESS_UPDATED_ITEM.status
        //                         atualizarGeneroJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
        //                         atualizarGeneroJSON.message     = message.SUCCESS_UPDATED_ITEM.message
        //                         return atualizarFilmeJSON //201
                                
        //                     }else{
        //                         return message.ERROR_INTERNAL_SERVER_DB //500
        //                     }
        //                 }else{
        //                     validateStatus = false
        //                 }
                
        //             }
                    
        //         }
        //     }else{
        //         return message.ERROR_CONTENT_TYPE //415
        //     }







         // let idGenero = id

        // if(idGenero == '' || idGenero == undefined || isNaN (idGenero)){
        //     return message.ERROR_INVALID_ID
        // } else {
        //     if(String(contentType).toLowerCase() == 'application/json'){
        //         let updateGeneroJson = {};
        //         if(dadoAtualizado.nome == ''                      || dadoAtualizado.nome == undefined               ||  dadoAtualizado.nome == null               || dadoAtualizado.nome.length > 40

        //         ){

        //             return message.ERROR_REQUIRED_FIELDS
        //         } else {
        //             let validateStatus = true;

        //             let generoById = await generoDAO.selectByIdGenero(id)

        //             if(generoById.length>0){
        //                 if(validateStatus){
        //                     let updateGenero = await generoDAO.updateGenero(id, dadoAtualizado);

        //                     console.log(updateGenero)
        //                     if(updateGenero){
                                
        //                 updateGeneroJson.genero = dadoAtualizado
        //                 updateGeneroJson.status = message.SUCESS_UPTADE_ITEM.status
        //                 updateGeneroJson.status_code = message.SUCESS_UPTADE_ITEM.status_code
        //                 updateGeneroJson.message = message.SUCESS_UPTADE_ITEM.message
    
        //                 return updateGeneroJson;
        //                     } else {
        //                         return message.ERROR_INTERNAL_SERVER_DB
        //                     }
        //                 }
        //             } else {
        //                 return message.ERROR_NOT_FOUND
        //             }
        //         }
        //     } else {
        //         return message.ERROR_CONTENT_TYPE
        //     }
        // }