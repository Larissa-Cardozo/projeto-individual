var dashboardModel = require("../models/dashboardModel");

async function buscar(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).send("Id de usuario invalido.");
    }

    try {
        var dashboard = await dashboardModel.buscarDashboard(idUsuario);
        res.json(dashboard);
    } catch (erro) {
        console.log(erro);

        if (erro.message === "USUARIO_NAO_ENCONTRADO") {
            return res.status(404).send("Usuario nao encontrado.");
        }

        res.status(500).json(erro.sqlMessage || erro.message);
    }
}

async function salvar(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).send("Id de usuario invalido.");
    }

    try {
        var dashboard = await dashboardModel.salvarDashboard(idUsuario, req.body || {});
        res.json(dashboard);
    } catch (erro) {
        console.log(erro);

        if (erro.message === "USUARIO_NAO_ENCONTRADO") {
            return res.status(404).send("Usuario nao encontrado.");
        }

        res.status(500).json(erro.sqlMessage || erro.message);
    }
}

module.exports = {
    buscar,
    salvar
};
