var express = require("express");
var router = express.Router();

var pokemonController = require("../controllers/pokemonController");

router.get("/listarTodos", function(req, res) {
    pokemonController.listarTodos(req, res);
});

router.get("/capturados/:idUsuario", function(req, res) {
    pokemonController.listarCapturados(req, res);
});

router.get("/timeAtual/:idUsuario", function(req, res) {
    pokemonController.listarTime(req, res);
});

router.post("/capturar", function(req, res) {
    pokemonController.capturar(req, res);
});

router.post("/inicial", function(req, res) {
    pokemonController.definirInicial(req, res);
});

router.post("/time", function(req, res) {
    pokemonController.adicionarAoTime(req, res);
});

module.exports = router;