var express = require("express");
var router = express.Router();
var ginasioController = require("../controllers/ginasioController");

router.get("/:idUsuario", function(req, res) {
    ginasioController.listarGinasios(req, res);
});

router.post("/concluir", function(req, res) {
    ginasioController.concluirGinasio(req, res);
});

module.exports = router;