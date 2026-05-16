var database = require("../database/config");

function listarGinasios(idUsuario) {
    var instrucaoSql = `
        SELECT g.id, g.nome, g.lider,
            CASE WHEN ug.concluido IS NULL THEN 0 ELSE ug.concluido END AS concluido
        FROM ginasios g
        LEFT JOIN usuario_ginasios ug 
            ON g.id = ug.id_ginasio 
            AND ug.id_usuario = ${idUsuario}
        ORDER BY g.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function concluirGinasio(idUsuario, idGinasio) {
    var instrucaoSql = `
        INSERT INTO usuario_ginasios (id_usuario, id_ginasio, concluido)
        VALUES (${idUsuario}, ${idGinasio}, 1)
        ON DUPLICATE KEY UPDATE concluido = 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function desconcluirGinasio(idUsuario, idGinasio) {
    var instrucaoSql = `
        UPDATE usuario_ginasios
        SET concluido = 0
        WHERE id_usuario = ${idUsuario} AND id_ginasio = ${idGinasio};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarGinasios,
    concluirGinasio,
    desconcluirGinasio
};