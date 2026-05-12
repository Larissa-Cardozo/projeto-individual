var database = require("../database/config");

function definirInicial(idUsuario, idPokemon) {
    var instrucaoSql = `
        UPDATE usuarios
        SET inicial = ${idPokemon}
        WHERE id = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function listarTodos() {
    var instrucaoSql = `
        SELECT id, nome, tipo
        FROM pokemons
        ORDER BY nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarCapturados(idUsuario) {
    var instrucaoSql = `
        SELECT p.id, p.nome, p.tipo FROM usuario_pokemons up
        JOIN pokemons p
        ON up.id_pokemon = p.id
        WHERE up.id_usuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTime(idTime) {
    var instrucaoSql = `
        SELECT p.id, p.nome, p.tipo FROM time_pokemons tp
        JOIN pokemons p
        ON tp.id_pokemon = p.id
        WHERE tp.id_time = ${idTime};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function capturar(idUsuario, idPokemon) {
    var instrucaoSql = ` 
    INSERT INTO usuario_pokemons (id_usuario, id_pokemon) VALUES(${idUsuario}, ${idPokemon});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function adicionarAoTime(idTime, idPokemon) {
    var instrucaoSql = `
        INSERT INTO time_pokemons (id_time, id_pokemon) VALUES (${idTime}, ${idPokemon});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarTodos,
    listarCapturados,
    capturar,
    adicionarAoTime,
    listarTime,
    definirInicial
};