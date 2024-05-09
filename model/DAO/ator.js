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
        if (dadosAtor.data_falecimento && dadosAtor.data_falecimento !== '') {
            sql = `
                INSERT INTO tbl_ator (nome, nome_artistico, data_nascimento, data_falecimento, biografia, foto, id_sexo)
                VALUES (
                    "${dadosAtor.nome}",
                    "${dadosAtor.nome_artistico}",
                    "${dadosAtor.data_nascimento}",
                    "${dadosAtor.data_falecimento}",
                    "${dadosAtor.biografia}",
                    "${dadosAtor.foto}",
                    "${dadosAtor.id_sexo}"
                )
            `;
        } else {
            sql = `
                INSERT INTO tbl_ator (nome, nome_artistico, data_nascimento, data_falecimento, biografia, foto, id_sexo)
                VALUES (
                    "${dadosAtor.nome}",
                    "${dadosAtor.nome_artistico}",
                    "${dadosAtor.data_nascimento}",
                    NULL,
                    "${dadosAtor.biografia}",
                    "${dadosAtor.foto}",
                    "${dadosAtor.id_sexo}"
                )
            `;
        }

        
        let result = await prisma.$executeRawUnsafe(sql);
        if(result){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateAtor = async function(dadoAtualizado, idAtor) {
    try{
        let sql
        if(dadoAtualizado.data_falecimento != '' &&
        dadoAtualizado.data_falecimento   != null &&
        dadoAtualizado.data_falecimento   != undefined){
            sql = `update tbl_ator SET 
            nome = '${dadoAtualizado.nome}',
            nome_artistico = '${dadoAtualizado.nome_artistico}',
            data_nascimento = '${dadoAtualizado.data_nascimento}',
            data_falecimento = '${dadoAtualizado.data_falecimento}',
            biografia = '${dadoAtualizado.biografia}',
            foto = '${dadoAtualizado.foto}',
            id_sexo = '${dadoAtualizado.id_sexo}'
            WHERE
           tbl_ator.id_ator = ${idAtor}`
        }else{
            sql = `update tbl_ator SET 
            nome = '${dadoAtualizado.nome}',
            nome_artistico = '${dadoAtualizado.nome_artistico}',
            data_nascimento = '${dadoAtualizado.data_nascimento}',
            biografia = '${dadoAtualizado.biografia}',
            foto = '${dadoAtualizado.foto}',
            id_sexo = '${dadoAtualizado.id_sexo}'
            WHERE
            tbl_ator.id_ator = ${idAtor}`
        }
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            for(let nacionalidade of dadoAtualizado.id_nacionalidade){
                sql=`
                
                    update tbl_ator_nacionalidade
                        
                    set

                        id_nacionalidade=${nacionalidade}
                    
                    where id_ator=${idAtor}
                `
                let result=await prisma.$executeRawUnsafe(sql)
                if(result)
                    continue
                else
                    return false
            }
            return true
        }
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteAtor = async function(id){
    try {
        const sql = `delete from tbl_ator where id_ator = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme

    } catch (error) {
        return false
    }
}

const deleteAtorNacionalidade = async function(id){
    try {
        const sql = `delete from tbl_ator_nacionalidade where id_ator = ${id}`
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
        const sql = `select * from tbl_ator where id_ator = ${id}`
    
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

const selectAtorByFilme = async function(id){
    try {
        let sql = `SELECT tbl_ator.id_ator, nome, nome_artistico, data_nascimento, data_falecimento, biografia, foto
        FROM tbl_ator
        INNER JOIN tbl_filme_ator ON tbl_ator.id_ator = tbl_filme_ator.id_ator
        WHERE tbl_filme_ator.id = ${id};
`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }
}

const selectNameById = async function(nome){
    try {
        let sql = `SELECT id_ator FROM tbl_ator WHERE nome = '${nome}'`
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
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
    IDAtor,
    deleteAtorNacionalidade,
    selectAtorByFilme,
    selectNameById,
    
}