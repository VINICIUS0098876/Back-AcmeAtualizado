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

const selectAllSexo = async function(){
    try {
        let sql = 'select * from tbl_sexo'; 

    let rsClassificacao = await prisma.$queryRawUnsafe(sql)

    if(rsClassificacao.length > 0 )
    return rsClassificacao
    } catch (error) {
        return false 
    };    
}

const selectByIdSexo = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_sexo where id_sexo = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsClassificacao = await prisma.$queryRawUnsafe(sql);

            return rsClassificacao;
    
        } catch (error) {
            return false;
            
        }
}

const selectNameSexo = async function(nome){
    try {
        let sql = `
            SELECT tbl_ator.*
            FROM tbl_ator
            JOIN tbl_sexo ON tbl_ator.id_sexo = tbl_sexo.id_sexo
            WHERE tbl_sexo.sigla = '${nome}';`
        console.log(sql)
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        console.error(error)
        return false
    }
}

module.exports = {
    selectAllSexo,
    selectByIdSexo,
    selectNameSexo
}