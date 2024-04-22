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


const insertClassificacao = async function(dadosClassificao){
    console.log('teste');
    try {
        const sql = `insert into tbl_classificacao(faixa_etaria, classificacao, caracteristica, icone)values('${dadosClassificao.faixa_etaria}',
        '${dadosClassificao.classificacao}',
        '${dadosClassificao.caracteristica}',
        '${dadosClassificao.icone}')`
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

const updateClassificacao = async function(dadosClassificacao, idClassificacao){
    let sql
    try {
        sql = `update tbl_classificacao set
        faixa_etaria = '${dadosClassificacao.faixa_etaria}',
        classificacao = '${dadosClassificacao.classificacao}',
        caracteristica = '${dadosClassificacao.caracteristica}',
        icone = '${dadosClassificacao.icone}'
        where tbl_classificacao.id_classificacao = ${idClassificacao}`
        
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

const deleteClassificacao = async function(id){
    try {
        let sql = `delete from tbl_classificacao WHERE id_classificacao = ${id}`

        let rsClassificacao = await prisma.$queryRawUnsafe(sql);

        return rsClassificacao
    } catch (error) {
        return false
    }
}

const selectAllClassificacao = async function(){
    try {
        let sql = 'select * from tbl_classificacao'; 

    let rsClassificacao = await prisma.$queryRawUnsafe(sql)

    if(rsClassificacao.length > 0 )
    return rsClassificacao
    } catch (error) {
        return false 
    };    
}

const selectByIdClassificacao = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_classificacao where id_classificacao = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsClassificacao = await prisma.$queryRawUnsafe(sql);

            return rsClassificacao;
    
        } catch (error) {
            return false;
            
        }
}

const IDClassificacao = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_classificacao limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}


module.exports = {
    insertClassificacao,
    updateClassificacao,
    deleteClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    IDClassificacao
}

