var pokemonModel = require("../models/pokemonModel");

function definirInicial(req, res) {
    var idUsuario = req.body.idUsuario;
    var idPokemon = req.body.idPokemon;

    pokemonModel.definirInicial(idUsuario, idPokemon)
        .then(function() {
            res.status(200).send("Inicial salvo!");
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarTodos(req, res) {
    pokemonModel.listarTodos()
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function capturar(req, res) {
    var idUsuario = req.body.idUsuario;
    var idPokemon = req.body.idPokemon;

    pokemonModel.capturar(idUsuario, idPokemon)
        .then(function() {
            res.status(200).send("Capturado!");
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarCapturados(req, res) {
    var idUsuario = req.params.idUsuario;

    pokemonModel.listarCapturados(idUsuario)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function adicionarAoTime(req, res) {
    var idTime = req.body.idTime;
    var idPokemon = req.body.idPokemon;

    pokemonModel.adicionarAoTime(idTime, idPokemon)
        .then(function() {
            res.status(200).send("Pokemon adicionado!");
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarTodos,
    capturar,
    listarCapturados,
    definirInicial,
    adicionarAoTime
};