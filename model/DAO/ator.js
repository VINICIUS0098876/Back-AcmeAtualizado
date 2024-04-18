/****************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados MySQL,
 * aqui realizamos o CRUD utilizando a linguagem sql
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')


// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertAtor = async function(dadosAtor){
    let sql

     try {
        if(dadosAtor.data_falecimento != '' &&
         dadosAtor.data_falecimento   != null &&
         dadosAtor.data_falecimento  != undefined){
             sql = `insert into tbl_ator (nome, 
                                            nome_artistico,
                                            data_nascimento,
                                            data_falecimento,
                                            biografia,
                                            foto,
                                            id_sexo        
                )values(
                                           "${dadosAtor.nome}",
                                           "${dadosAtor.nome_artistico}",
                                           '${dadosAtor.data_nascimento}',
                                           '${dadosAtor.data_falecimento}',
                                           '${dadosAtor.biografia}',
                                           '${dadosAtor.foto}',
                                           '${dadosAtor.id_sexo}'

                                           
                )`

        }else{
            
            sql = `insert into tbl_ator (nome, 
                nome_artistico,
                data_nascimento,
                data_falecimento,
                biografia,
                foto,
                id_sexo
)values(
               "${dadosAtor.nome}",
               "${dadosAtor.nome_artistico}",
               '${dadosAtor.data_nascimento}',
               'null',
               '${dadosAtor.biografia}',
               '${dadosFilme.foto}',
               '${dadosFilme.id_sexo}',
)`
        }

             //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados 
               // (insert, update e delete)
            //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)

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

const updateAtor = async function(id, dadoAtualizado) {
    let sql
    try{
        if(dadoAtualizado.data_falecimento != '' &&
        dadoAtualizado.data_falecimento   != null &&
        dadoAtualizado.data_falecimento   != undefined){
            sql = `update tbl_ator set 
            nome = "${dadoAtualizado.nome}",
            sinopse = "${dadoAtualizado.nome_artistico}",
            duracao = '${dadoAtualizado.data_nascimento}',
            data_lancamento = '${dadoAtualizado.data_falecimento}',
            data_relancamento = '${dadoAtualizado.biografia}',
            foto_capa = '${dadoAtualizado.foto}',
            valor_unitario = '${dadoAtualizado.id_sexo}',
            where
            id = ${id}`
        }else{
            sql = `update tbl_ator set 
            nome = "${dadoAtualizado.nome}",
            sinopse = "${dadoAtualizado.nome_artistico}",
            duracao = '${dadoAtualizado.data_nascimento}',
            data_lancamento = '${dadoAtualizado.biografia}',
            foto_capa = '${dadoAtualizado.foto}',
            valor_unitario = '${dadoAtualizado.id_sexo}',
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

const deleteAtor = async function(id){
    try {
        const sql = `delete from tbl_ator where id = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme

    } catch (error) {
        return false
    }
}

const selectAllAtor = async function(){
    try {
        let sql = 'select * from tbl_ator'
    
        // $queryRawUnsafe(sql)
        // $queryRawUnsafe('select * from tbl_filme')
        let rsFilmes = await prisma.$queryRawUnsafe(sql) 
        return rsFilmes
    } catch (error) {
        return false
    }



}

const selectByIdAtor = async function(id){

    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_ator where id = ${id}`
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }

}

const selectNameAtor = async function(nome){
    try {
        let sql = `select * from tbl_ator where nome like"%${nome}%"`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }
}

const IDAtor = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_ator limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

module.exports = {
    insertAtor,
    updateAtor,
    deleteAtor,
    selectAllAtor,
    selectByIdAtor,
    selectNameAtor,
    IDAtor
}