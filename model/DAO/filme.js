/****************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados MySQL,
 * aqui realizamos o CRUD utilizando a linguagem sql
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir um novo filme no banco de dados;
const insertFilme = async function(dadosFilme){
    let sql

     try {
        if(dadosFilme.data_relancamento != '' &&
         dadosFilme.data_relancamento   != null &&
         dadosFilme.data_relancamento   != undefined){
             sql = `insert into tbl_filme (nome, 
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario        
                )values(
                                           '${dadosFilme.nome}',
                                           '${dadosFilme.sinopse}',
                                           '${dadosFilme.duracao}',
                                           '${dadosFilme.data_lancamento}',
                                           '${dadosFilme.data_relancamento}',
                                           '${dadosFilme.foto_capa}',
                                           '${dadosFilme.valor_unitario}'
                )`

        }else{
            
            sql = `insert into tbl_filme (nome, 
                sinopse,
                duracao,
                data_lancamento,
                data_relancamento,
                foto_capa,
                valor_unitario        
)values(
               '${dadosFilme.nome}',
               '${dadosFilme.sinopse}',
               '${dadosFilme.duracao}',
               '${dadosFilme.data_lancamento}',
               null,
               '${dadosFilme.foto_capa}',
               '${dadosFilme.valor_unitario}'
)`
        }

             //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados 
               // (insert, update e delete)
            //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

            
             let result = await prisma.$executeRawUnsafe(sql)
    
             if(result){
                return true
             }else{
                return false
             }
        
     } catch (error) {
        
        return false
     }
}

// Função para atualizar um filme no banco de dados;
const updateFilme = async function(id, dadoAtualizado) {
let sql
try{
    if(dadoAtualizado.data_relancamento != '' &&
    dadoAtualizado.data_relancamento   != null &&
    dadoAtualizado.data_relancamento   != undefined){
        sql = `update tbl_filme set 
        nome = '${dadoAtualizado.nome}',
        sinopse = '${dadoAtualizado.sinopse}',
        duracao = '${dadoAtualizado.duracao}',
        data_lancamento = '${dadoAtualizado.data_lancamento}',
        data_relancamento = '${dadoAtualizado.data_relancamento}',
        foto_capa = '${dadoAtualizado.foto_capa}',
        valor_unitario = '${dadoAtualizado.valor_unitario}'
        where
        id = ${id}`
    }else{
        sql = `update tbl_filme set 
        nome = '${dadoAtualizado.nome}',
        sinopse = '${dadoAtualizado.sinopse}',
        duracao = '${dadoAtualizado.duracao}',
        data_lancamento = '${dadoAtualizado.data_lancamento}',
        foto_capa = '${dadoAtualizado.foto_capa}',
        valor_unitario = '${dadoAtualizado.valor_unitario}'
        where
        id = ${id}`
    }
    console.log(sql)
    let result = await prisma.$executeRawUnsafe(sql)
    
    if(result){
       return true
    }else{
       return false
    }
}catch(error){
    return false
}
}

// Função para excluir um filme no banco de dados;
const deleteFilme = async function(id){
    try {
        const sql = `delete from tbl_filme where id = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme

    } catch (error) {
        return false
    }
}

// Função para listar todos os filmes do banco de dados;
const selectAllFilmes = async function(){
    try {
        let sql = 'select * from tbl_filme'
    
        // $queryRawUnsafe(sql)
        // $queryRawUnsafe('select * from tbl_filme')
        let rsFilmes = await prisma.$queryRawUnsafe(sql) 
        return rsFilmes
    } catch (error) {
        return false
    }



}

// Função para buscar um filme do banco de dados pelo ID;
const selectByIdFilme = async function(id){

    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_filme where id = ${id}`
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }

}

const selectNameFilmes = async function(nome){
    try {
        let sql = `select * from tbl_filme where nome like"%${nome}%"`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }



}

const IDFilme = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}


module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectNameFilmes,
    IDFilme
}