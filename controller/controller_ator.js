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

const setInserirAtor = async function(dadosAtor, contentType){
    try{
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
    
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoAtorJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosAtor.nome==''          ||dadosAtor.nome==undefined          ||dadosAtor.nome==null               ||dadosAtor.nome.length>100            ||
                dadosAtor.nome_artistico==''   || dadosAtor.nome_artistico==undefined  || dadosAtor.nome_artistico==null       || dadosAtor.nome_artistico.length>100 ||
                dadosAtor.data_nascimento==''  ||dadosAtor.data_nascimento==undefined  ||dadosAtor.data_nascimento==null       ||dadosAtor.data_nascimento.length!=10 ||
                dadosAtor.biografia==''        ||dadosAtor.biografia==undefined        ||dadosAtor.biografia==null             ||dadosAtor.biografia.length>65000     ||
                dadosAtor.foto==''             ||dadosAtor.foto==undefined             ||dadosAtor.foto==null                  ||dadosAtor.foto.length>150            ||
                dadosAtor.id_sexo==''          ||dadosAtor.id_sexo==undefined          ||dadosAtor.id_sexo==null                  
                
                ){
                    return message.ERROR_REQUIRED_FIELDS//400
            
                }
            
                else{
            
                    let validateStatus = false
                    // Outra validação com campos obrigatorios ou com digitação inválida
                    if(dadosAtor.data_falecimento != null &&
                         dadosAtor.data_falecimento != '' &&
                          dadosAtor.data_falecimento != undefined){
            
                        if(dadosAtor.data_falecimento.length != 10){
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
                        let novoAtor = await atorDAO.insertAtor(dadosAtor)
                        
                        if(novoAtor){
                            let idAtores = await atorDAO.IDAtor()
                            dadosAtor.id = Number(idAtores[0].id)
                        }
                        
                        console.log()
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoAtor){
                            // console.log(novoAtor)
                            //Cria o JSON de retorno dos dados (201)
                            novoAtorJSON.ator       = dadosAtor
                            novoAtorJSON.status      = message.SUCCESS_CREATED_ITEM.status
                            novoAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoAtorJSON.message     = message.SUCCESS_CREATED_ITEM.message
                
                            return novoAtorJSON //201
                            
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

const setAtualizarAtor = async function(id, dadoAtualizado, contentType){
    try{

        let idAtor = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = atorDAO.selectByIdAtor()
            
            if(idAtor == '' || idAtor == undefined || idAtor == isNaN(idAtor) || idAtor == null){
                return message.ERROR_INVALID_ID
            }else if(idAtor>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{

    
            // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarAtorJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadoAtualizado.nome==''          ||dadoAtualizado.nome==undefined          ||dadoAtualizado.nome==null               ||dadoAtualizado.nome.length>100            ||
                dadoAtualizado.nome_artistico==''   || dadoAtualizado.nome_artistico==undefined  || dadoAtualizado.nome_artistico==null       || dadoAtualizado.nome_artistico.length>100 ||
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
                        let atualizarAtor = await atorDAO.updateAtor(dadoAtualizado, idAtor)
                        
                        if(atualizarAtor){
                            let idAtores = await atorDAO.IDAtor()
                            dadoAtualizado.id = Number(idAtores[0].id)
                        }
                        
                        
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(atualizarAtor){
                            // console.log(novoAtor)
                            //Cria o JSON de retorno dos dados (201)
                            atualizarAtorJSON.ator       = dadoAtualizado
                            atualizarAtorJSON.status      = message.SUCCESS_CREATED_ITEM.status
                            atualizarAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            atualizarAtorJSON.message     = message.SUCCESS_CREATED_ITEM.message
                
                            return atualizarAtorJSON //201
                            
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

const setExcluirAtor = async function(id){
    try {
        let idAtor = id
    
        if(idAtor == '' || idAtor == undefined || idAtor == isNaN(idAtor) || idAtor == null){
            return message.ERROR_INVALID_ID
        }else{
            let dadosAtor = await atorDAO.deleteAtor(idAtor)
            let deleteAtor = await atorDAO.deleteAtorNacionalidade(idAtor)
    
            if(dadosAtor || deleteAtor){
               return message.SUCCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

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
                let nacionalidadeAtor = await nacionalidadeDAO.selectNacionalidadeAtor(atores.id_ator)
                delete atores.id_sexo
                atores.sexo = sexoAtor
                atores.nacionalidade = nacionalidadeAtor
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
         if(dadosAtor){
 
             // Validação para verificar a quantidade de itens encontrados.
             if(dadosAtor.length > 0){

                for(let atores of dadosAtor){
                    let sexoAtor = await sexoDAO.selectByIdSexo(atores.id_sexo)
                    let nacionalidadeAtor = await nacionalidadeDAO.selectNacionalidadeAtor(atores.id_ator)
                    delete atores.id_sexo
                    atores.sexo = sexoAtor
                    atores.nacionalidade = nacionalidadeAtor
                }

                 //Criar o JSON de retorno
                 atorJSON.ator = dadosAtor
                 atorJSON.status_code = 200
     
                 return atorJSON
             }else{
                 return message.ERROR_NOT_FOUND // 404
             }
 
         }else{
             return message.ERROR_INTERNAL_SERVER_DB // 500
         }
     }
}

const setListarIdByName = async function(nome){
    let nomeAtor = nome

    let atorJSON = {}

    if(nomeAtor == '' || nomeAtor == undefined){
        return message.ERROR_INVALID_ID // 400
    }else{
        let dadosAtor = await atorDAO.selectNameById(nome)
    
        if(dadosAtor){
    
            if(dadosAtor.length > 0){
                atorJSON.nome = dadosAtor
                atorJSON.quantidade = dadosAtor.length
                atorJSON.status_code = 200
                
                return atorJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
}

module.exports = {
    setListarAtor,
    setListarAtorById,
    setExcluirAtor,
    setAtualizarAtor,
    setInserirAtor,
    setListarIdByName
}