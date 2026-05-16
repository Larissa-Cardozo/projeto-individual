var database = require("../database/config");

function buscarDados(idUsuario) {
    var instrucaoSql = `
        SELECT
            (SELECT nome FROM pokemons WHERE id = u.inicial) AS inicial,

            (SELECT COUNT(*) FROM usuario_ginasios 
                WHERE id_usuario = ${idUsuario} AND concluido = 1
            ) AS ginasios_concluidos,

            (SELECT COUNT(*) FROM usuario_pokemons 
                WHERE id_usuario = ${idUsuario}
            ) AS total_capturados,

            ROUND((
                    -- Inicial = 20%
                    (CASE 
                        WHEN u.inicial IS NOT NULL THEN 20 
                        ELSE 0 
                    END)
                    +
                    -- Ginásios = 40%
                    ((SELECT COUNT(*) FROM usuario_ginasios 
                      WHERE id_usuario = ${idUsuario} AND concluido = 1) / 8.0) * 40
                    +
                    -- Capturas = 40%
                    ((SELECT COUNT(*) FROM usuario_pokemons 
                        WHERE id_usuario = ${idUsuario}) / 125.0) * 40
                ),0
            ) AS conclusao_geral
        FROM usuarios u
        WHERE u.id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTipoDominante(idUsuario) {
    var instrucaoSql = `
        SELECT p.tipo, COUNT(*) AS quantidade
        FROM time_pokemons tp
        JOIN pokemons p ON tp.id_pokemon = p.id
        JOIN times t ON tp.id_time = t.id
        WHERE t.id_usuario = ${idUsuario}
        GROUP BY p.tipo
        ORDER BY quantidade DESC
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDados,
    buscarTipoDominante
};