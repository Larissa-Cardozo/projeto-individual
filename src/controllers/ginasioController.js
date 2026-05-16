var ginasioModel = require("../models/ginasioModel");

function listarGinasios(req, res) {
    var idUsuario = req.params.idUsuario;

    ginasioModel.listarGinasios(idUsuario)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function concluirGinasio(req, res) {
    var idUsuario = req.body.idUsuario;
    var idGinasio = req.body.idGinasio;
    var concluido = req.body.concluido;

    // chama função diferente dependendo se está marcando ou desmarcando
    if (concluido) {
        acao = ginasioModel.concluirGinasio(idUsuario, idGinasio);
    }else {
        acao = ginasioModel.desconcluirGinasio(idUsuario, idGinasio);
    }

    acao
        .then(function() {
            res.status(200).send("Ginásio atualizado!");
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarGinasios,
    concluirGinasio
};