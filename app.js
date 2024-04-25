var info = require("./controller/funcao")


/**** 
Para realizar a integração com o banco de dados devemos utilizar uma das seguinte bibliotecas:
 -> SEQUELIZE - É a biblioteca mais antiga
 -> PRISMA ORM - É a biblioteca mais atual (Utilizaremos no projeto)
 -> FASTFY ORM - É a biblioteca mais atual
*****************************************
Para instalação do PRISMA ORM: 
 -> npm install prisma --save - (É responsavel pela conexão com o Banco de dados)
 -> npm install @prisma/client --save - (É responsavel por executar scripts SQL no Banco de dados)
 
Para iniciar o prisma no projeto, devemos:
 -> npx prisma init
*****/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

/*********************** Import dos arquivos de controller do projeto ***********************************/
    const controllerFilmes = require('./controller/controller_filme.js')
    const controllerGenero = require('./controller/controller_genero.js')
    const controllerClassificacao = require ('./controller/controller_classificacao.js')
    const controllerNacionalidade = require ('./controller/controller_nacionalidade.js')
    const controllerSexo = require ('./controller/controller_sexo.js')
    const controllerAtor = require ('./controller/controller_ator.js')
    const controllerDiretor = require ('./controller/controller_diretor.js')
/*******************************************************************************************************/

// Criando um objeto para controlar a chegada dos dados da requisição em formato JSON
const bodyParserJSON = bodyParser.json()


// EndPoint: Versão 1.0 que retorna os dados de um arquivo de filmes.
// Periodo de utilização 01/2024 até 02/2024
app.get('/v1/acmeFilmes/filmes', cors(), async function(request, response, next){
    let listarFilmes = info.getListarFilmes()

    if(listarFilmes){
        response.json(listarFilmes)
        response.status(200)
    }else{
        response.status(404)
    }
    })
    
    app.get('/v1/acmeFilmes/filme/:idfilmes', cors(), async function(request, response, next){
        let id = request.params.idfilmes
        let filme = info.getFilme(id)

        if(filme){
            response.json(filme)
            response.status(200)
        }else{
            response.status(404)
        }
    })

/********************************** V2 DOS ENDPOINTS ********************************************/


    // -> EndPoint: Versão 2.0 - Retorna os dados de filme do Banco de Dados
    app.get('/v2/acmeFilmes/filme', cors(), async function(request, response){


        // -> Chama a função da controller para retornar todos os filmes
        let dadosFilmes = await controllerFilmes.getListarFilmes()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosFilmes.status_code)
        response.json(dadosFilmes)
    })

    //EndPoint: Ele retorna os dados do filme filtrado pelo nome
    app.get('/v2/acmeFilmes/Filmes/Filtro', cors(), async function(request, response){
        let nome = request.query.nome
        let dadosFilmes = await controllerFilmes.getNomeFilme(nome)

        response.status(dadosFilmes.status_code)
        response.json(dadosFilmes)
    })

    app.get('/v2/acmeFilmes/Filmes/FiltroClassificacao', cors(), async function(request, response){
        let nome = request.query.nome
        let dadosClassificacao = await controllerFilmes.getFilmeByClassificacao(nome)

        response.status(dadosClassificacao.status_code)
        response.json(dadosClassificacao)
    })

    // EndPoint: ele retorna os dados pelo id
    app.get('/v2/acmeFilmes/filme/:id', cors(), async function(request, response, next){

        // Recebe o id da requisição
        let idFilme = request.params.id
        // Encaminha o ID para a controller buscar o Filme
        let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

        //
        response.status(dadosFilme.status_code)
        response.json(dadosFilme)
    })

    //EndPoint: Ele insere dados sobre o filme
    app.post('/v2/acmeFilmes/filme', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)
        
        response.status(resultDadosNovoFilme.status_code)
        response.json(resultDadosNovoFilme)
    })

    //EndPoint: Ele deleta os dados pelo id 
    app.delete('/v2/acmeFilmes/filme/:id', cors(), async function(request, response, next){
        let idFilme = request.params.id

        let dadosFilme = await controllerFilmes.setExcluirFilme(idFilme)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)
    })

    app.put('/v2/acmeFilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){
        let contentType = request.headers['content-type']
        let dadosBody = request.body
        let idFilme = request.params.id

        let dadosFilme = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)
    })

    /*********************************************** GENERO **********************************************/
    app.get('/v2/acmeFilmes/genero', cors(), async function(request, response){


        // -> Chama a função da controller para retornar todos os filmes
        let dadosGenero = await controllerGenero.getListarGenero()

        if(dadosGenero){
            response.json(dadosGenero);
            response.status(200);
        } else {
                response.json({message: 'Nenhum registro nessa porra'})
                response.status(404)
        }
    })

    app.delete('/v2/acmeFilmes/genero/:id', cors(), async function(request, response, next){
        let idGenero = request.params.id

        let dadosGenero = await controllerGenero.setExcluirGenero(idGenero)

        response.status(dadosGenero.status_code)
        response.json(dadosGenero)
    })

    app.post('/v2/acmeFilmes/genero', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoGenero = await controllerGenero.setInserirNovoGenero(dadosBody, contentType)
        
        console.log(resultDadosNovoGenero);
        response.status(200)
        response.json(resultDadosNovoGenero)
    })
    
    app.put('/v2/acmeFilmes/genero/:id', cors(), bodyParserJSON, async function(request, response){
        let contentType = request.headers['content-type']
        let dadosBody = request.body
        let idGenero = request.params.id

        let dadosGenero = await controllerGenero.setAtualizarGenero(idGenero, dadosBody, contentType)

        console.log(dadosGenero)
        response.status(200)
        response.json(dadosGenero)
    })

    app.get('/v2/acmeFilmes/genero/Filtro', cors(), async function(request, response){
        let nome = request.query.nome
        let dadosGenero = await controllerGenero.getNomeGenero(nome)

        response.status(dadosGenero.status_code)
        response.json(dadosGenero)
    })

    app.get('/v2/acmeFilmes/genero/:id', cors(), async function(request, response, next){

        // Recebe o id da requisição
        let idGenero = request.params.id
        // Encaminha o ID para a controller buscar o Filme
        let dadosGenero = await controllerGenero.getBuscarGenero(idGenero)

        //
        response.status(200)
        response.json(dadosGenero)
    })

    /************************************************** Classificação *****************************************/
    app.post('/v2/filmesAcme/classificacao', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaClassificacao = await controllerClassificacao.setInserirNovoClassificacao(dadosBody, contentType)
    
    
        response.status(200);
        response.json(resultDadosNovaClassificacao);
    
    })

    app.delete('/v2/filmesAcme/deleteClassificacao/:id', cors (), async function (request,response,next){

        let idClassificacao = request.params.id
    
        let dadosClassificacao = await controllerClassificacao.setExcluirNovoClassificacao(idClassificacao);
    
        response.status(dadosClassificacao.status_code);
        response.json(dadosClassificacao)
    })

    app.get('/v2/filmesAcme/classificacao', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosClassificacao = await controllerClassificacao.setListarClassificacao();
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosClassificacao){
            response.json(dadosClassificacao);
            response.status(200);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v2/filmesAcme/classificacao/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idClassificacao = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosClassificacao = await controllerClassificacao.setListarClassificacaoById(idClassificacao);
    
        response.status(dadosClassificacao.status_code);
        response.json(dadosClassificacao);
    })

    app.put('/v2/filmesAcme/uptadeClassificacao/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idClassificacao = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeClassificacao = await controllerClassificacao.setAtualizarNovoClassificacao(idClassificacao, dadosBody, contentType);
    
        console.log();
        response.status(200)
        response.json(resultUptadeClassificacao)
    
    })

    /***************************************** NACIONALIDADE ************************************************************/

    app.get('/v2/filmesAcme/nacionalidade', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosNacionalidade = await controllerNacionalidade.setListarNacionalidade();
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosNacionalidade){
            response.json(dadosNacionalidade);
            response.status(200);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v2/filmesAcme/nacionalidade/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idNacionalidade = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosNacionalidade = await controllerNacionalidade.setListarNacionalidadeById(idNacionalidade);
    
        response.status(dadosNacionalidade.status_code);
        response.json(dadosNacionalidade);
    })

    app.get('/v2/acmeFilmes/nacionalidade/Filtro', cors(), async function(request, response){
        let nome = request.query.nome
        let dadosNacionalidade = await controllerNacionalidade.setListarAtorNacionalidade(nome)

        response.status(dadosNacionalidade.status_code)
        response.json(dadosNacionalidade)
    })

    /********************************************** SEXO ****************************************************************/

    app.get('/v2/filmesAcme/sexo', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosSexo = await controllerSexo.setListarSexo();
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosSexo){
            response.json(dadosSexo);
            response.status(200);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v2/filmesAcme/sexo/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idSexo = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosSexo = await controllerSexo.setListarSexoById(idSexo);
    
        response.status(dadosSexo.status_code);
        response.json(dadosSexo);
    })

    app.get('/v2/acmeFilmes/sexo/Filtro', cors(), async function(request, response){
        let nome = request.query.nome
        let dadosSexo = await controllerSexo.setListarAtorSexo(nome)

        response.status(dadosSexo.status_code)
        response.json(dadosSexo)
    })

    /*********************************************** ATOR ****************************************************************/
    app.get('/v2/filmesAcme/atores', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosAtor = await controllerAtor.setListarAtor()
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
       response.status(dadosAtor.status_code)
       response.json(dadosAtor)
    });

    app.get('/v2/filmesAcme/atores/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idAtor = request.params.id
    
        //encaminha o id para a acontroller buscar o Ator
        let dadosAtor = await controllerAtor.setListarAtorById(idAtor)
    
        response.status(dadosAtor.status_code);
        response.json(dadosAtor);
    })

    app.delete('/v2/filmesAcme/deleteAtor/:id', cors (), async function (request,response,next){

        let idAtor = request.params.id
    
        let dadosAtor = await controllerAtor.setExcluirAtor(idAtor)
    
        response.status(dadosAtor.status_code);
        response.json(dadosAtor)
    })

    app.post('/v2/filmesAcme/atores', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoAtor = await controllerAtor.setInserirAtor(dadosBody, contentType)
    
    
        response.status(resultDadosNovoAtor.status_code);
        response.json(resultDadosNovoAtor);
    
    })

    app.put('/v2/filmesAcme/updateAtor/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idAtor = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeAtor = await controllerAtor.setAtualizarAtor(idAtor, dadosBody, contentType);
    
        
        response.status(resultUptadeAtor.status_code)
        response.json(resultUptadeAtor)
    
    })

    /************************************* DIRETOR **********************************************************/

    app.get('/v2/filmesAcme/diretores', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosDiretor = await controllerDiretor.setListarDiretor()
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
       response.status(dadosDiretor.status_code)
       response.json(dadosDiretor)
    });

    app.get('/v2/filmesAcme/diretores/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idDiretor = request.params.id
    
        //encaminha o id para a acontroller buscar o Ator
        let dadosDiretor = await controllerDiretor.setListarDiretorById(idDiretor)
    
        response.status(dadosDiretor.status_code);
        response.json(dadosDiretor);
    })

    app.delete('/v2/filmesAcme/deleteDiretor/:id', cors (), async function (request,response,next){

        let idDiretor = request.params.id
    
        let dadosDiretor = await controllerDiretor.setExcluirDiretor(idDiretor)
    
        response.status(dadosDiretor.status_code);
        response.json(dadosDiretor)
    })

    app.post('/v2/filmesAcme/diretores', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoDiretor = await controllerDiretor.insertDiretor(dadosBody, contentType)
    
    
        response.status(resultDadosNovoDiretor.status_code);
        response.json(resultDadosNovoDiretor);
    
    })

    app.put('/v2/filmesAcme/updateDiretor/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idDiretor = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeDiretor = await controllerDiretor.updateDiretor(idDiretor, dadosBody, contentType)
    
        
        response.status(resultUptadeDiretor.status_code)
        response.json(resultUptadeDiretor)
    
    })




    app.listen('8080', function(){
        console.log('API funcionando!!')
    })
