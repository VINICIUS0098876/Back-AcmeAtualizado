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

const insertDiretor = async function(dadosAtor){
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
               '${dadosAtor.foto}',
               '${dadosAtor.id_sexo}'
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

const updateDiretor = async function(id, dadoAtualizado) {
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

const deleteDiretor = async function(id){
    try {
        const sql = `delete from tbl_diretor where id_diretor = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme

    } catch (error) {
        return false
    }
}

const deleteDiretorNacionalidade = async function(id){
    try {
        const sql = `delete from tbl_diretor_nacionalidade where id_diretor = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme

    } catch (error) {
        return false
    }
}

const selectAllDiretor = async function(){
    try {
        let sql = 'select * from tbl_diretor'
    
        // $queryRawUnsafe(sql)
        // $queryRawUnsafe('select * from tbl_filme')
        let rsFilmes = await prisma.$queryRawUnsafe(sql) 
        return rsFilmes
    } catch (error) {
        return false
    }



}

const selectByIdDiretor = async function(id){

    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_diretor where id_diretor = ${id}`
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }

}

const selectNameDiretor = async function(nome){
    try {
        let sql = `select * from tbl_diretor where nome like"%${nome}%"`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }
}

const IDDiretor = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_diretor limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}


module.exports = {
    selectAllDiretor,
    selectByIdDiretor,
    selectNameDiretor,
    deleteDiretor,
    deleteDiretorNacionalidade,
    insertDiretor,
    updateDiretor
}