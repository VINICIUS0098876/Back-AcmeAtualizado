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

const insertGenero = async function(dadosGenero){
    try {
        const sql = `insert into tbl_genero(nome)values('${dadosGenero.nome}')`
        console.log(sql)
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

const updateGenero = async function(idGenero, dadosGenero){
    let sql
    try {
        sql = `update tbl_genero set nome = '${dadosGenero.nome}' where tbl_genero.id_genero = ${idGenero}`
        
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

const deleteGenero = async function(id){
    try {
        const sql = `delete from tbl_genero where id_genero = ${id}`
        let rsGenero = await prisma.$executeRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }
}

const selectAllGenero = async function(){
    try {
        let  sql = `select * from tbl_genero order by id_genero desc`
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        
        if (rsGenero.length > 0 )
        console.log(rsGenero);
        return rsGenero
    } catch (error) {
        return false
    }
}

const selectByIdGenero = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_genero where tbl_genero.id_genero = ${id}`

        console.log(sql);
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }
}

const selectNameGenero = async function(nome){
    try {
        let sql = `select * from tbl_genero where nome like"%${nome}%"`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }
}

const IDGenero = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_genero limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}


module.exports = {
    insertGenero,
    updateGenero,
    deleteGenero,
    selectAllGenero,
    selectByIdGenero,
    selectNameGenero,
    IDGenero
}