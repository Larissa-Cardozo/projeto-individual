var database = require("../database/config");

var TOTAL_POKEMONS_KANTO = 151;
var TIME_PRINCIPAL = "Time principal";
var STARTERS_VALIDOS = ["Charmander", "Bulbasaur", "Squirtle"];
var GINASIOS_PADRAO = [
    { nome: "Pewter Gym", lider: "Brock" },
    { nome: "Cerulean Gym", lider: "Misty" },
    { nome: "Vermilion Gym", lider: "Lt. Surge" },
    { nome: "Celadon Gym", lider: "Erika" },
    { nome: "Fuchsia Gym", lider: "Koga" },
    { nome: "Saffron Gym", lider: "Sabrina" },
    { nome: "Cinnabar Gym", lider: "Blaine" },
    { nome: "Viridian Gym", lider: "Giovanni" }
];

function escaparTexto(valor) {
    return String(valor || "")
        .trim()
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

function normalizarTipo(valor) {
    var texto = String(valor || "").trim();

    if (!texto) {
        return "Normal";
    }

    var tipoNormalizado = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    return tipoNormalizado.slice(0, 20);
}

function sanitizarStarter(starter) {
    return STARTERS_VALIDOS.includes(starter) ? starter : null;
}

function sanitizarListaPokemons(lista, limite) {
    var itens = Array.isArray(lista) ? lista : [];
    var vistos = {};
    var resultado = [];

    for (var indice = 0; indice < itens.length; indice++) {
        var pokemon = itens[indice] || {};
        var nome = String(pokemon.nome || "").trim().slice(0, 50);

        if (!nome) {
            continue;
        }

        var chave = nome.toLowerCase();

        if (vistos[chave]) {
            continue;
        }

        vistos[chave] = true;
        resultado.push({
            nome: nome,
            tipo: normalizarTipo(pokemon.tipo)
        });

        if (resultado.length === limite) {
            break;
        }
    }

    return resultado;
}

function sanitizarGinasios(idsRecebidos, idsDisponiveis) {
    var itens = Array.isArray(idsRecebidos) ? idsRecebidos : [];
    var permitidos = {};
    var unicos = {};
    var resultado = [];

    idsDisponiveis.forEach(function (idGinasio) {
        permitidos[Number(idGinasio)] = true;
    });

    for (var indice = 0; indice < itens.length; indice++) {
        var idAtual = Number(itens[indice]);

        if (!Number.isInteger(idAtual) || !permitidos[idAtual] || unicos[idAtual]) {
            continue;
        }

        unicos[idAtual] = true;
        resultado.push(idAtual);
    }

    return resultado;
}

function montarResumo(starter, ginasios, capturados, timeAtual) {
    var ginasiosVencidos = ginasios.filter(function (ginasio) {
        return Number(ginasio.concluido) === 1;
    }).length;

    var pokemonsCapturados = capturados.length;
    var progressoStarter = starter ? 1 : 0;
    var progressoGinasios = ginasiosVencidos / GINASIOS_PADRAO.length;
    var progressoCapturas = Math.min(pokemonsCapturados, TOTAL_POKEMONS_KANTO) / TOTAL_POKEMONS_KANTO;
    var percentualConclusao = Math.round(((progressoStarter + progressoGinasios + progressoCapturas) / 3) * 100);
    var tipoMaisPresente = calcularTipoMaisPresente(timeAtual);

    return {
        starter: starter || "",
        percentualConclusao: percentualConclusao,
        ginasiosVencidos: ginasiosVencidos,
        totalGinasios: GINASIOS_PADRAO.length,
        pokemonsCapturados: pokemonsCapturados,
        metaCapturas: TOTAL_POKEMONS_KANTO,
        tipoMaisPresente: tipoMaisPresente.tipo,
        quantidadeTipoMaisPresente: tipoMaisPresente.quantidade
    };
}

function calcularTipoMaisPresente(timeAtual) {
    if (!timeAtual.length) {
        return {
            tipo: "Sem time",
            quantidade: 0
        };
    }

    var contagem = {};
    var tipoVencedor = "Sem time";
    var maiorQuantidade = 0;

    timeAtual.forEach(function (pokemon) {
        var tipo = pokemon.tipo || "Normal";
        contagem[tipo] = (contagem[tipo] || 0) + 1;

        if (contagem[tipo] > maiorQuantidade) {
            maiorQuantidade = contagem[tipo];
            tipoVencedor = tipo;
        }
    });

    return {
        tipo: tipoVencedor,
        quantidade: maiorQuantidade
    };
}

function obterNomesGinasiosSql() {
    return GINASIOS_PADRAO.map(function (ginasio) {
        return "'" + escaparTexto(ginasio.nome) + "'";
    }).join(", ");
}

async function buscarUsuario(idUsuario) {
    var resultado = await database.executar(`
        SELECT id, nome
        FROM usuarios
        WHERE id = ${idUsuario}
        LIMIT 1;
    `);

    if (!resultado.length) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }

    return resultado[0];
}

async function garantirGinasiosPadrao() {
    for (var indice = 0; indice < GINASIOS_PADRAO.length; indice++) {
        var ginasio = GINASIOS_PADRAO[indice];
        var nomeEscapado = escaparTexto(ginasio.nome);
        var liderEscapado = escaparTexto(ginasio.lider);
        var existente = await database.executar(`
            SELECT id
            FROM ginasios
            WHERE nome = '${nomeEscapado}'
            LIMIT 1;
        `);

        if (!existente.length) {
            await database.executar(`
                INSERT INTO ginasios (nome, lider)
                VALUES ('${nomeEscapado}', '${liderEscapado}');
            `);
        }
    }
}

async function garantirProgressoUsuario(idUsuario) {
    var progresso = await database.executar(`
        SELECT id
        FROM progresso
        WHERE id_usuario = ${idUsuario}
        LIMIT 1;
    `);

    if (!progresso.length) {
        await database.executar(`
            INSERT INTO progresso (id_usuario, starter, ginasios_completos, total_capturados)
            VALUES (${idUsuario}, NULL, 0, 0);
        `);
    }
}

async function garantirPokemon(pokemon) {
    var nomeEscapado = escaparTexto(pokemon.nome);
    var tipoEscapado = escaparTexto(pokemon.tipo);
    var pokemonExistente = await database.executar(`
        SELECT id, tipo
        FROM pokemons
        WHERE LOWER(nome) = LOWER('${nomeEscapado}')
        LIMIT 1;
    `);

    if (pokemonExistente.length) {
        await database.executar(`
            UPDATE pokemons
            SET tipo = '${tipoEscapado}'
            WHERE id = ${pokemonExistente[0].id};
        `);

        return pokemonExistente[0].id;
    }

    var insercao = await database.executar(`
        INSERT INTO pokemons (nome, tipo, imagem)
        VALUES ('${nomeEscapado}', '${tipoEscapado}', '');
    `);

    return insercao.insertId;
}

async function buscarOuCriarTimePrincipal(idUsuario) {
    var time = await database.executar(`
        SELECT id
        FROM times
        WHERE id_usuario = ${idUsuario}
        ORDER BY id
        LIMIT 1;
    `);

    if (time.length) {
        return time[0].id;
    }

    var insercao = await database.executar(`
        INSERT INTO times (id_usuario, nome_time)
        VALUES (${idUsuario}, '${escaparTexto(TIME_PRINCIPAL)}');
    `);

    return insercao.insertId;
}

async function buscarDashboard(idUsuario) {
    var usuario = await buscarUsuario(idUsuario);

    await garantirGinasiosPadrao();
    await garantirProgressoUsuario(idUsuario);

    var progresso = await database.executar(`
        SELECT starter
        FROM progresso
        WHERE id_usuario = ${idUsuario}
        LIMIT 1;
    `);

    var ginasios = await database.executar(`
        SELECT
            g.id,
            g.nome,
            g.lider,
            CASE WHEN ug.concluido = 1 THEN 1 ELSE 0 END AS concluido
        FROM ginasios g
        LEFT JOIN usuario_ginasios ug
            ON ug.id_ginasio = g.id
            AND ug.id_usuario = ${idUsuario}
        WHERE g.nome IN (${obterNomesGinasiosSql()})
        ORDER BY g.id;
    `);

    var capturados = await database.executar(`
        SELECT
            p.id,
            p.nome,
            p.tipo
        FROM usuario_pokemons up
        INNER JOIN pokemons p
            ON p.id = up.id_pokemon
        WHERE up.id_usuario = ${idUsuario}
            AND up.capturado = 1
        GROUP BY p.id, p.nome, p.tipo
        ORDER BY p.nome;
    `);

    var timeAtual = await database.executar(`
        SELECT
            p.id,
            p.nome,
            p.tipo
        FROM times t
        INNER JOIN time_pokemons tp
            ON tp.id_time = t.id
        INNER JOIN pokemons p
            ON p.id = tp.id_pokemon
        WHERE t.id_usuario = ${idUsuario}
            AND t.id = (
                SELECT id
                FROM times
                WHERE id_usuario = ${idUsuario}
                ORDER BY id
                LIMIT 1
            )
        ORDER BY tp.id;
    `);

    var starter = progresso.length ? progresso[0].starter : null;

    return {
        usuario: usuario,
        resumo: montarResumo(starter, ginasios, capturados, timeAtual),
        ginasios: ginasios,
        capturados: capturados,
        timeAtual: timeAtual
    };
}

async function salvarDashboard(idUsuario, dadosDashboard) {
    await buscarUsuario(idUsuario);
    await garantirGinasiosPadrao();
    await garantirProgressoUsuario(idUsuario);

    var ginasiosDisponiveis = await database.executar(`
        SELECT id
        FROM ginasios
        WHERE nome IN (${obterNomesGinasiosSql()})
        ORDER BY id;
    `);

    var idsDisponiveis = ginasiosDisponiveis.map(function (item) {
        return Number(item.id);
    });

    var starter = sanitizarStarter(dadosDashboard.starter);
    var ginasiosConcluidos = sanitizarGinasios(dadosDashboard.ginasiosConcluidos, idsDisponiveis);
    var capturados = sanitizarListaPokemons(dadosDashboard.capturados, TOTAL_POKEMONS_KANTO);
    var capturadosIndexados = {};

    capturados.forEach(function (pokemon) {
        capturadosIndexados[pokemon.nome.toLowerCase()] = true;
    });

    var timeAtual = sanitizarListaPokemons(dadosDashboard.timeAtual, 6).filter(function (pokemon) {
        return capturadosIndexados[pokemon.nome.toLowerCase()];
    });

    var starterSql = starter ? "'" + escaparTexto(starter) + "'" : "NULL";

    await database.executar(`
        UPDATE progresso
        SET starter = ${starterSql},
            ginasios_completos = ${ginasiosConcluidos.length},
            total_capturados = ${capturados.length}
        WHERE id_usuario = ${idUsuario};
    `);

    await database.executar(`
        DELETE FROM usuario_ginasios
        WHERE id_usuario = ${idUsuario};
    `);

    for (var indiceGinasio = 0; indiceGinasio < ginasiosConcluidos.length; indiceGinasio++) {
        await database.executar(`
            INSERT INTO usuario_ginasios (id_usuario, id_ginasio, concluido)
            VALUES (${idUsuario}, ${ginasiosConcluidos[indiceGinasio]}, 1);
        `);
    }

    await database.executar(`
        DELETE FROM usuario_pokemons
        WHERE id_usuario = ${idUsuario};
    `);

    for (var indicePokemon = 0; indicePokemon < capturados.length; indicePokemon++) {
        var pokemonIdCapturado = await garantirPokemon(capturados[indicePokemon]);

        await database.executar(`
            INSERT INTO usuario_pokemons (id_usuario, id_pokemon, capturado)
            VALUES (${idUsuario}, ${pokemonIdCapturado}, 1);
        `);
    }

    var idTimePrincipal = await buscarOuCriarTimePrincipal(idUsuario);

    await database.executar(`
        DELETE FROM time_pokemons
        WHERE id_time = ${idTimePrincipal};
    `);

    for (var indiceTime = 0; indiceTime < timeAtual.length; indiceTime++) {
        var pokemonIdTime = await garantirPokemon(timeAtual[indiceTime]);

        await database.executar(`
            INSERT INTO time_pokemons (id_time, id_pokemon)
            VALUES (${idTimePrincipal}, ${pokemonIdTime});
        `);
    }

    return buscarDashboard(idUsuario);
}

module.exports = {
    buscarDashboard,
    salvarDashboard
};
