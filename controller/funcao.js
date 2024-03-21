const {filmes} = require("../modulo/filmes")

const getListarFilmes = function(){
    let status = false
    let JSONFilmes = {}
    let arrayFilmes = []

    for(let cont = 0; cont < filmes.filmes.length; cont++){
        let json = {
            id : filmes.filmes[cont].id,
            nome : filmes.filmes[cont].nome,
            sinopse : filmes.filmes[cont].sinopse,
            duracao : filmes.filmes[cont].duracao,
            data : filmes.filmes[cont].data_lancamento,
            relan : filmes.filmes[cont].data_relancamento,
            foto : filmes.filmes[cont].foto_capa,
            valor : filmes.filmes[cont].valor_unitario
        }
        arrayFilmes.push(json)
    }
    JSONFilmes.filmes = arrayFilmes
    return JSONFilmes
}

const getFilme = function(id){
    let status = false
    let JSONFilmes = {}
    let arrayFilmes = []

    for(let cont = 0; cont < filmes.filmes.length; cont++){
        if(id == filmes.filmes[cont].id){
            let json = {
                id : filmes.filmes[cont].id,
                nome : filmes.filmes[cont].nome,
                sinopse : filmes.filmes[cont].sinopse,
                duracao : filmes.filmes[cont].duracao,
                data : filmes.filmes[cont].data_lancamento,
                relan : filmes.filmes[cont].data_relancamento,
                foto : filmes.filmes[cont].foto_capa,
                valor : filmes.filmes[cont].valor_unitario
            }
            arrayFilmes.push(json)
        }
    }
    JSONFilmes.filme = arrayFilmes
    return JSONFilmes

}

// console.log(getListarFilmes())
// console.log(getFilme())

module.exports = {
    getFilme,
    getListarFilmes
}