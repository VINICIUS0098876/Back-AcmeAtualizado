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


const insertDiretor = async function(dadosDiretor, contentType){
    try{
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            
    
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoDiretorJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosDiretor.nome==''          ||dadosDiretor.nome==undefined          ||dadosDiretor.nome==null               ||dadosDiretor.nome.length>100            ||
                dadosDiretor.data_nascimento==''  ||dadosDiretor.data_nascimento==undefined  ||dadosDiretor.data_nascimento==null       ||dadosDiretor.data_nascimento.length!=10 ||
                dadosDiretor.biografia==''        ||dadosDiretor.biografia==undefined        ||dadosDiretor.biografia==null             ||dadosDiretor.biografia.length>65000     ||
                dadosDiretor.foto==''             ||dadosDiretor.foto==undefined             ||dadosDiretor.foto==null                  ||dadosDiretor.foto.length>150            ||
                dadosDiretor.id_sexo==''          ||dadosDiretor.id_sexo==undefined          ||dadosDiretor.id_sexo==null               ||isNaN(dadosDiretor.id_sexo)    
                
                ){
                    
                    return message.ERROR_REQUIRED_FIELDS//400
            
                }
            
                else{
            
                    let validateStatus = false
                    // Outra validação com campos obrigatorios ou com digitação inválida
                    if(dadosDiretor.data_falecimento != null &&
                         dadosDiretor.data_falecimento != '' &&
                          dadosDiretor.data_falecimento != undefined){
            
                        if(dadosDiretor.data_falecimento.length != 10){
                            return message.ERROR_REQUIRED_FIELDS//400
                        }else{
                            validateStatus = true
                        }
                    }else{
                        validateStatus = true
                    }
            
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novoDiretor = await diretorDAO.insertDiretor(dadosDiretor)
                        console.log(novoDiretor)
                        
                        if(novoDiretor){
                            let idDiretores = await diretorDAO.IDDiretor()
                            dadosDiretor.id = Number(idDiretores[0].id)
                        }
                        
                        
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoDiretor){
                            // console.log(novoAtor)
                            //Cria o JSON de retorno dos dados (201)
                            novoDiretorJSON.ator       = dadosDiretor
                            novoDiretorJSON.status      = message.SUCCESS_CREATED_ITEM.status
                            novoDiretorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoDiretorJSON.message     = message.SUCCESS_CREATED_ITEM.message
                
                            return novoDiretorJSON //201
                            
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

const updateDiretor = async function(id, dadoAtualizado, contentType){
    try{

        let idDiretor = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = diretorDAO.selectByIdDiretor()
            
            if(idDiretor == '' || idDiretor == undefined || idDiretor == isNaN(idDiretor) || idDiretor == null){
                return message.ERROR_INVALID_ID
            }else if(idDiretor>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{

    
            // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarDiretorJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadoAtualizado.nome==''          ||dadoAtualizado.nome==undefined          ||dadoAtualizado.nome==null               ||dadoAtualizado.nome.length>100            ||
                dadoAtualizado.data_nascimento==''  ||dadoAtualizado.data_nascimento==undefined  ||dadoAtualizado.data_nascimento==null       ||dadoAtualizado.data_nascimento.length!=10 ||
                dadoAtualizado.biografia==''        ||dadoAtualizado.biografia==undefined        ||dadoAtualizado.biografia==null             ||dadoAtualizado.biografia.length>65000     ||
                dadoAtualizado.foto==''             ||dadoAtualizado.foto==undefined             ||dadoAtualizado.foto==null                  ||dadoAtualizado.foto.length>150            ||
                dadoAtualizado.id_sexo==''          ||dadoAtualizado.id_sexo==undefined          ||dadoAtualizado.id_sexo==null               ||isNaN(dadoAtualizado.id_sexo)    
                
                ){
                    return message.ERROR_REQUIRED_FIELDS//400
            
                }
            
                else{
            
                    let validateStatus = false
                    // Outra validação com campos obrigatorios ou com digitação inválida
                    if(dadoAtualizado.data_falecimento != null &&
                         dadoAtualizado.data_falecimento != '' &&
                          dadoAtualizado.data_falecimento != undefined){
            
                        if(dadoAtualizado.data_falecimento.length != 10){
                            return message.ERROR_REQUIRED_FIELDS//400
                        }else{
                            validateStatus = true
                        }
                    }else{
                        validateStatus = true
                    }
            
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let atualizarDiretor = await diretorDAO.updateDiretor(dadoAtualizado, idDiretor)
                        
                        if(atualizarDiretor){
                            let idDiretores = await diretorDAO.IDDiretor()
                            dadoAtualizado.id = Number(idDiretores[0].id)
                        }
                        
                        
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(atualizarDiretor){
                            // console.log(novoAtor)
                            //Cria o JSON de retorno dos dados (201)
                            atualizarDiretorJSON.diretor       = dadoAtualizado
                            atualizarDiretorJSON.status      = message.SUCCESS_CREATED_ITEM.status
                            atualizarDiretorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            atualizarDiretorJSON.message     = message.SUCCESS_CREATED_ITEM.message
                
                            return atualizarDiretorJSON //201
                            
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
    setListarDiretorById,
    insertDiretor,
    updateDiretor
}