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

const selectAllNacionalidade = async function(){
    try {
        let sql = 'select * from tbl_nacionalidade'; 

    let rsClassificacao = await prisma.$queryRawUnsafe(sql)

    if(rsClassificacao.length > 0 )
    return rsClassificacao
    } catch (error) {
        return false 
    };    
}

const selectByIdNacionalidade = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_nacionalidade where id_nacionalidade = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsClassificacao = await prisma.$queryRawUnsafe(sql);

            return rsClassificacao;
    
        } catch (error) {
            return false;
            
        }
}

const selectNacionalidadeAtor = async function(){

}

module.exports = {
    selectAllNacionalidade,
    selectByIdNacionalidade,
    selectNacionalidadeAtor
}