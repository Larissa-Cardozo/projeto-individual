var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/api/:idUsuario", function (req, res) {
    dashboardController.buscar(req, res);
});

router.post("/api/:idUsuario", function (req, res) {
    dashboardController.salvar(req, res);
});

module.exports = router;
