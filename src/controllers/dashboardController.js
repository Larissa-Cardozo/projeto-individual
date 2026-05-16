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

module.exports = {
    buscarDados,
    buscarTipoDominante
};