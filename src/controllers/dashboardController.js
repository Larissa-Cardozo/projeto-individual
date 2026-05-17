var dashboardModel = require("../models/dashboardModel");

function buscarDados(req, res) {
    var idUsuario = req.params.idUsuario;

    dashboardModel.buscarDados(idUsuario)
        .then(function(resultado) {
            res.json(resultado[0]); // retorna só o primeiro objeto
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function buscarTipoDominante(req, res) {
    var idUsuario = req.params.idUsuario;

    dashboardModel.buscarTipoDominante(idUsuario)
        .then(function(resultado) {
            res.json(resultado[0]); // retorna só o primeiro objeto
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function registrarHistorico(req, res) {
    var idUsuario = req.body.idUsuario;
    var porcentagem = req.body.porcentagem;

    dashboardModel.registrarHistorico(idUsuario, porcentagem)
        .then(function() {
            res.status(200).send("Histórico registrado!");
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function buscarHistorico(req, res) {
    var idUsuario = req.params.idUsuario;

    dashboardModel.buscarHistorico(idUsuario)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarDados,
    buscarTipoDominante,
    registrarHistorico,
    buscarHistorico
};