var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/dados/:idUsuario", function(req, res) {
    dashboardController.buscarDados(req, res);
});

router.get("/tipoDominante/:idUsuario", function(req, res) {
    dashboardController.buscarTipoDominante(req, res);
});

module.exports = router;