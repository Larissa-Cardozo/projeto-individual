const TOTAL_POKEMONS_KANTO = 151;
const LIMITE_TIME = 6;
const MODO_MOCK = true;
const CHAVE_STORAGE = "pokegreen-dashboard";

const STARTERS = [
    {
        nome: "Bulbasaur",
        tipo: "Grass",
        descricao: "Escolha equilibrada e tranquila para comecar."
    },
    {
        nome: "Charmander",
        tipo: "Fire",
        descricao: "Opcao ofensiva para quem quer uma jornada mais agressiva."
    },
    {
        nome: "Squirtle",
        tipo: "Water",
        descricao: "Linha defensiva simples de evoluir ao longo do jogo."
    }
];

const GINASIOS_PADRAO = [
    { id: 1, nome: "Pewter Gym", lider: "Brock" },
    { id: 2, nome: "Cerulean Gym", lider: "Misty" },
    { id: 3, nome: "Vermilion Gym", lider: "Lt. Surge" },
    { id: 4, nome: "Celadon Gym", lider: "Erika" },
    { id: 5, nome: "Fuchsia Gym", lider: "Koga" },
    { id: 6, nome: "Saffron Gym", lider: "Sabrina" },
    { id: 7, nome: "Cinnabar Gym", lider: "Blaine" },
    { id: 8, nome: "Viridian Gym", lider: "Giovanni" }
];

const CORES_TIPOS = {
    Normal: "#cbd5e1",
    Fire: "#fb7185",
    Water: "#60a5fa",
    Grass: "#86efac",
    Electric: "#facc15",
    Ice: "#93c5fd",
    Fighting: "#fb923c",
    Poison: "#c084fc",
    Ground: "#d6a96d",
    Flying: "#7ddcff",
    Psychic: "#f9a8d4",
    Bug: "#a3e635",
    Rock: "#c4a76a",
    Ghost: "#a78bfa",
    Dragon: "#818cf8",
    Dark: "#94a3b8",
    Steel: "#9ca3af"
};

let dashboardAtual = null;
let graficoProgresso = null;
let graficoTipos = null;

window.adicionarPokemon = adicionarPokemon;
window.adicionarAoTime = adicionarAoTime;
window.salvarDashboard = salvarDashboard;

inicializarDashboard();

async function inicializarDashboard() {
    preencherNomeTreinador();

    try {
        const dados = await carregarDashboard();
        dashboardAtual = normalizarDashboard(dados);

        if (obterPaginaAtual() === "dashboard") {
            renderizarVisaoGeral();
        }

        if (obterPaginaAtual() === "projeto") {
            renderizarProjeto();
        }
    } catch (erro) {
        console.error("Erro ao iniciar dashboard:", erro);
        mostrarStatus("Nao foi possivel carregar os dados da dashboard.", "erro");
        renderizarFallbackGraficos("Nao foi possivel carregar os graficos.");
    }
}

function obterPaginaAtual() {
    return document.body ? document.body.dataset.page : "";
}

function preencherNomeTreinador() {
    const campoNome = document.getElementById("nomeTreinadorSidebar");

    if (campoNome) {
        campoNome.textContent = obterNomeTreinador();
    }
}

function obterNomeTreinador() {
    return String(sessionStorage.NOME_USUARIO || "Treinador").trim() || "Treinador";
}

function obterIdUsuario() {
    const idUsuario = Number(sessionStorage.ID_USUARIO);
    return Number.isInteger(idUsuario) && idUsuario > 0 ? idUsuario : 1;
}

function obterChaveDashboard() {
    return `${CHAVE_STORAGE}-${obterIdUsuario()}`;
}

async function carregarDashboard() {
    if (MODO_MOCK) {
        return carregarDashboardMock();
    }

    return carregarDashboardApi();
}

function carregarDashboardMock() {
    const chave = obterChaveDashboard();
    const salvo = localStorage.getItem(chave);

    if (salvo) {
        try {
            return JSON.parse(salvo);
        } catch (erro) {
            console.warn("Mock salvo invalido. Recriando base local.", erro);
        }
    }

    const base = criarDashboardMock();
    localStorage.setItem(chave, JSON.stringify(base));
    return base;
}

async function carregarDashboardApi() {
    const resposta = await fetch(`/dashboard/api/${obterIdUsuario()}`);

    if (!resposta.ok) {
        throw new Error("Falha ao buscar dashboard.");
    }

    return resposta.json();
}

async function salvarDashboard() {
    if (!dashboardAtual) {
        return;
    }

    try {
        if (MODO_MOCK) {
            localStorage.setItem(obterChaveDashboard(), JSON.stringify(dashboardAtual));
            mostrarStatus("Mocks salvos localmente. Depois basta trocar o mock pelo fetch do endpoint.", "sucesso");
            return;
        }

        const resposta = await fetch(`/dashboard/api/${obterIdUsuario()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(montarPayloadParaSalvar(dashboardAtual))
        });

        if (!resposta.ok) {
            throw new Error("Falha ao salvar dashboard.");
        }

        const dadosAtualizados = await resposta.json();
        dashboardAtual = normalizarDashboard(dadosAtualizados);
        renderizarProjeto();
        mostrarStatus("Progresso salvo com sucesso.", "sucesso");
    } catch (erro) {
        console.error("Erro ao salvar dashboard:", erro);
        mostrarStatus("Nao foi possivel salvar seu progresso agora.", "erro");
    }
}

function montarPayloadParaSalvar(dados) {
    return {
        starter: dados.resumo.starter || null,
        ginasiosConcluidos: dados.ginasios
            .filter(function (ginasio) {
                return Number(ginasio.concluido) === 1;
            })
            .map(function (ginasio) {
                return ginasio.id;
            }),
        capturados: dados.capturados.map(function (pokemon) {
            return {
                nome: pokemon.nome,
                tipo: pokemon.tipo
            };
        }),
        timeAtual: dados.timeAtual.map(function (pokemon) {
            return {
                nome: pokemon.nome,
                tipo: pokemon.tipo
            };
        })
    };
}

function criarDashboardMock() {
    return {
        usuario: {
            id: obterIdUsuario(),
            nome: obterNomeTreinador()
        },
        resumo: {
            starter: "Bulbasaur"
        },
        ginasios: [
            { id: 1, nome: "Pewter Gym", lider: "Brock", concluido: 1 },
            { id: 2, nome: "Cerulean Gym", lider: "Misty", concluido: 1 },
            { id: 3, nome: "Vermilion Gym", lider: "Lt. Surge", concluido: 1 },
            { id: 4, nome: "Celadon Gym", lider: "Erika", concluido: 0 },
            { id: 5, nome: "Fuchsia Gym", lider: "Koga", concluido: 0 },
            { id: 6, nome: "Saffron Gym", lider: "Sabrina", concluido: 0 },
            { id: 7, nome: "Cinnabar Gym", lider: "Blaine", concluido: 0 },
            { id: 8, nome: "Viridian Gym", lider: "Giovanni", concluido: 0 }
        ],
        capturados: [
            { id: 1, nome: "Bulbasaur", tipo: "Grass" },
            { id: 2, nome: "Pikachu", tipo: "Electric" },
            { id: 3, nome: "Pidgeotto", tipo: "Flying" },
            { id: 4, nome: "Nidoran", tipo: "Poison" },
            { id: 5, nome: "Gyarados", tipo: "Water" },
            { id: 6, nome: "Snorlax", tipo: "Normal" },
            { id: 7, nome: "Oddish", tipo: "Grass" },
            { id: 8, nome: "Growlithe", tipo: "Fire" }
        ],
        timeAtual: [
            { id: 1, nome: "Bulbasaur", tipo: "Grass" },
            { id: 2, nome: "Pikachu", tipo: "Electric" },
            { id: 3, nome: "Pidgeotto", tipo: "Flying" },
            { id: 5, nome: "Gyarados", tipo: "Water" },
            { id: 6, nome: "Snorlax", tipo: "Normal" },
            { id: 8, nome: "Growlithe", tipo: "Fire" }
        ]
    };
}

function normalizarDashboard(dados) {
    const bruto = dados || {};
    const ginasiosBrutos = Array.isArray(bruto.ginasios) ? bruto.ginasios : [];
    const capturadosBrutos = Array.isArray(bruto.capturados) ? bruto.capturados : [];
    const timeBruto = Array.isArray(bruto.timeAtual) ? bruto.timeAtual : [];
    const starter = sanitizarStarter(bruto.resumo && bruto.resumo.starter);

    const ginasios = GINASIOS_PADRAO.map(function (padrao, indice) {
        const atual = ginasiosBrutos.find(function (ginasio) {
            return Number(ginasio.id) === padrao.id || String(ginasio.nome || "").toLowerCase() === padrao.nome.toLowerCase();
        }) || {};

        return {
            id: Number(atual.id) || padrao.id || indice + 1,
            nome: atual.nome || padrao.nome,
            lider: atual.lider || padrao.lider,
            concluido: Number(atual.concluido) === 1 ? 1 : 0
        };
    });

    const capturados = normalizarListaPokemons(capturadosBrutos, TOTAL_POKEMONS_KANTO);
    const capturadosPorNome = {};

    capturados.forEach(function (pokemon) {
        capturadosPorNome[pokemon.nome.toLowerCase()] = true;
    });

    const timeAtual = normalizarListaPokemons(timeBruto, LIMITE_TIME).filter(function (pokemon) {
        return capturadosPorNome[pokemon.nome.toLowerCase()];
    });

    return {
        usuario: {
            id: Number(bruto.usuario && bruto.usuario.id) || obterIdUsuario(),
            nome: bruto.usuario && bruto.usuario.nome ? bruto.usuario.nome : obterNomeTreinador()
        },
        resumo: montarResumo(starter, ginasios, capturados, timeAtual),
        ginasios: ginasios,
        capturados: capturados,
        timeAtual: timeAtual
    };
}

function sanitizarStarter(starter) {
    return STARTERS.some(function (item) {
        return item.nome === starter;
    }) ? starter : "";
}

function normalizarListaPokemons(lista, limite) {
    const itens = Array.isArray(lista) ? lista : [];
    const vistos = {};
    const resultado = [];

    for (let indice = 0; indice < itens.length; indice += 1) {
        const pokemon = itens[indice] || {};
        const nome = formatarNomePokemon(pokemon.nome);

        if (!nome) {
            continue;
        }

        const chave = nome.toLowerCase();

        if (vistos[chave]) {
            continue;
        }

        vistos[chave] = true;
        resultado.push({
            id: Number(pokemon.id) || Date.now() + indice,
            nome: nome,
            tipo: normalizarTipo(pokemon.tipo)
        });

        if (resultado.length === limite) {
            break;
        }
    }

    return resultado;
}

function montarResumo(starter, ginasios, capturados, timeAtual) {
    const ginasiosVencidos = ginasios.filter(function (ginasio) {
        return Number(ginasio.concluido) === 1;
    }).length;

    const progressoStarter = starter ? 1 : 0;
    const progressoGinasios = ginasiosVencidos / GINASIOS_PADRAO.length;
    const progressoCapturas = Math.min(capturados.length, TOTAL_POKEMONS_KANTO) / TOTAL_POKEMONS_KANTO;
    const percentualConclusao = Math.round(((progressoStarter + progressoGinasios + progressoCapturas) / 3) * 100);
    const tipoMaisPresente = calcularTipoMaisPresente(timeAtual);

    return {
        starter: starter || "",
        percentualConclusao: percentualConclusao,
        ginasiosVencidos: ginasiosVencidos,
        totalGinasios: GINASIOS_PADRAO.length,
        pokemonsCapturados: capturados.length,
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

    const contagem = {};
    let tipoVencedor = "Sem time";
    let maiorQuantidade = 0;

    timeAtual.forEach(function (pokemon) {
        const tipo = pokemon.tipo || "Normal";
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

function normalizarTipo(tipo) {
    const texto = String(tipo || "Normal").trim().toLowerCase();

    if (!texto) {
        return "Normal";
    }

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarNomePokemon(nome) {
    return String(nome || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 50);
}

function renderizarVisaoGeral() {
    if (!dashboardAtual) {
        return;
    }

    preencherTexto("percentualConclusao", `${dashboardAtual.resumo.percentualConclusao}%`);
    preencherTexto("starterAtual", dashboardAtual.resumo.starter || "Nao definido");
    preencherTexto("ginasiosVencidos", `${dashboardAtual.resumo.ginasiosVencidos}/${dashboardAtual.resumo.totalGinasios}`);
    preencherTexto("capturasTotais", String(dashboardAtual.resumo.pokemonsCapturados));
    preencherTexto("tipoDominante", dashboardAtual.resumo.tipoMaisPresente);

    const barraConclusao = document.getElementById("barraConclusao");

    if (barraConclusao) {
        barraConclusao.style.width = `${dashboardAtual.resumo.percentualConclusao}%`;
    }

    renderizarGraficoDeProgresso();
    renderizarGraficoDeTipos();
}

function renderizarGraficoDeProgresso() {
    const canvas = document.getElementById("graficoProgresso");

    if (!canvas) {
        return;
    }

    if (!window.Chart) {
        exibirMensagemGrafico(canvas, "Chart.js nao foi carregado.");
        return;
    }

    const percentualGinasios = Math.round((dashboardAtual.resumo.ginasiosVencidos / dashboardAtual.resumo.totalGinasios) * 100);
    const percentualCapturas = Math.round((dashboardAtual.resumo.pokemonsCapturados / dashboardAtual.resumo.metaCapturas) * 100);

    if (graficoProgresso) {
        graficoProgresso.destroy();
    }

    graficoProgresso = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Starter", "Ginasios", "Capturas"],
            datasets: [
                {
                    data: [
                        dashboardAtual.resumo.starter ? 100 : 0,
                        percentualGinasios,
                        percentualCapturas
                    ],
                    backgroundColor: ["#7ddcff", "#ffcb05", "#86efac"],
                    borderRadius: 12,
                    maxBarThickness: 64
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (contexto) {
                            return `${contexto.parsed.y}% concluido`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#f4f7ff",
                        font: {
                            family: "Telex",
                            size: 13
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: "#dce9ff",
                        callback: function (valor) {
                            return `${valor}%`;
                        }
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.08)"
                    }
                }
            }
        }
    });
}

function renderizarGraficoDeTipos() {
    const canvas = document.getElementById("graficoTipos");

    if (!canvas) {
        return;
    }

    if (!window.Chart) {
        exibirMensagemGrafico(canvas, "Chart.js nao foi carregado.");
        return;
    }

    const distribuicaoTipos = agruparTiposDoTime();

    if (graficoTipos) {
        graficoTipos.destroy();
    }

    graficoTipos = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: distribuicaoTipos.map(function (item) {
                return item.tipo;
            }),
            datasets: [
                {
                    data: distribuicaoTipos.map(function (item) {
                        return item.quantidade;
                    }),
                    backgroundColor: distribuicaoTipos.map(function (item) {
                        return item.cor;
                    }),
                    borderColor: "#091322",
                    borderWidth: 4,
                    hoverOffset: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "58%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#f4f7ff",
                        usePointStyle: true,
                        padding: 18,
                        font: {
                            family: "Telex",
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (contexto) {
                            const sufixo = contexto.parsed > 1 ? "pokemons" : "pokemon";
                            return `${contexto.label}: ${contexto.parsed} ${sufixo}`;
                        }
                    }
                }
            }
        }
    });
}

function agruparTiposDoTime() {
    if (!dashboardAtual.timeAtual.length) {
        return [
            {
                tipo: "Sem dados",
                quantidade: 1,
                cor: "rgba(220, 233, 255, 0.35)"
            }
        ];
    }

    const contagem = {};

    dashboardAtual.timeAtual.forEach(function (pokemon) {
        const tipo = pokemon.tipo || "Normal";
        contagem[tipo] = (contagem[tipo] || 0) + 1;
    });

    return Object.keys(contagem).map(function (tipo) {
        return {
            tipo: tipo,
            quantidade: contagem[tipo],
            cor: CORES_TIPOS[tipo] || "#c4b5fd"
        };
    });
}

function renderizarProjeto() {
    if (!dashboardAtual) {
        return;
    }

    preencherTexto("tipoMaisPresentePainel", dashboardAtual.resumo.tipoMaisPresente);
    renderizarStarterLista();
    renderizarListaGinasios();
    renderizarListaCapturados();
    renderizarSelectTime();
    renderizarListaTime();

    const mensagemStatus = document.getElementById("mensagemStatus");

    if (mensagemStatus && !mensagemStatus.dataset.preenchido) {
        mostrarStatus("Seus dados continuam mockados. Quando quiser ligar no banco, basta usar o endpoint ja existente.", "sucesso");
        mensagemStatus.dataset.preenchido = "true";
    }
}

function renderizarStarterLista() {
    const container = document.getElementById("starterLista");

    if (!container) {
        return;
    }

    container.innerHTML = STARTERS.map(function (starter) {
        const ativo = dashboardAtual.resumo.starter === starter.nome ? "ativo" : "";

        return `
            <button type="button" class="starter-card ${ativo}" data-starter="${escaparHtml(starter.nome)}">
                <h4>${escaparHtml(starter.nome)}</h4>
                <p>${escaparHtml(starter.tipo)}</p>
                <p>${escaparHtml(starter.descricao)}</p>
            </button>
        `;
    }).join("");

    container.querySelectorAll("[data-starter]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            dashboardAtual.resumo.starter = botao.dataset.starter;
            dashboardAtual.resumo = montarResumo(
                dashboardAtual.resumo.starter,
                dashboardAtual.ginasios,
                dashboardAtual.capturados,
                dashboardAtual.timeAtual
            );
            renderizarProjeto();
        });
    });
}

function renderizarListaGinasios() {
    const container = document.getElementById("ginasiosLista");

    if (!container) {
        return;
    }

    container.innerHTML = dashboardAtual.ginasios.map(function (ginasio) {
        return `
            <label class="ginasio-item">
                <div class="ginasio-info">
                    <h4>${escaparHtml(ginasio.nome)}</h4>
                    <p>Lider: ${escaparHtml(ginasio.lider)}</p>
                </div>
                <div class="ginasio-check">
                    <input type="checkbox" data-ginasio-id="${ginasio.id}" ${Number(ginasio.concluido) === 1 ? "checked" : ""}>
                    <span>Concluido</span>
                </div>
            </label>
        `;
    }).join("");

    container.querySelectorAll("[data-ginasio-id]").forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            const id = Number(checkbox.dataset.ginasioId);
            const ginasio = dashboardAtual.ginasios.find(function (item) {
                return Number(item.id) === id;
            });

            if (!ginasio) {
                return;
            }

            ginasio.concluido = checkbox.checked ? 1 : 0;
            dashboardAtual.resumo = montarResumo(
                dashboardAtual.resumo.starter,
                dashboardAtual.ginasios,
                dashboardAtual.capturados,
                dashboardAtual.timeAtual
            );
        });
    });
}

function renderizarListaCapturados() {
    const container = document.getElementById("capturadosLista");

    if (!container) {
        return;
    }

    if (!dashboardAtual.capturados.length) {
        container.innerHTML = `<div class="estado-vazio">Nenhuma captura mockada ainda.</div>`;
        return;
    }

    container.innerHTML = dashboardAtual.capturados.map(function (pokemon) {
        return `
            <div class="pokemon-card">
                <div class="pokemon-info">
                    <h4>${escaparHtml(pokemon.nome)}</h4>
                    <span class="tag-tipo">${escaparHtml(pokemon.tipo)}</span>
                </div>
                <button type="button" class="botao botao-secundario botao-pequeno" data-remover-captura="${escaparHtml(pokemon.nome)}">Remover</button>
            </div>
        `;
    }).join("");

    container.querySelectorAll("[data-remover-captura]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            removerPokemon(botao.dataset.removerCaptura);
        });
    });
}

function renderizarSelectTime() {
    const select = document.getElementById("pokemonTimeSelect");

    if (!select) {
        return;
    }

    const nomesNoTime = {};

    dashboardAtual.timeAtual.forEach(function (pokemon) {
        nomesNoTime[pokemon.nome.toLowerCase()] = true;
    });

    const opcoesDisponiveis = dashboardAtual.capturados.filter(function (pokemon) {
        return !nomesNoTime[pokemon.nome.toLowerCase()];
    });

    if (!opcoesDisponiveis.length) {
        select.innerHTML = `<option value="">Adicione ou remova pokemons para montar o time</option>`;
        return;
    }

    select.innerHTML = `<option value="">Selecione um pokemon</option>` + opcoesDisponiveis.map(function (pokemon) {
        return `<option value="${escaparHtml(pokemon.nome)}">${escaparHtml(pokemon.nome)} - ${escaparHtml(pokemon.tipo)}</option>`;
    }).join("");
}

function renderizarListaTime() {
    const container = document.getElementById("timeLista");

    if (!container) {
        return;
    }

    if (!dashboardAtual.timeAtual.length) {
        container.innerHTML = `<div class="estado-vazio">Seu time principal ainda esta vazio.</div>`;
        return;
    }

    container.innerHTML = dashboardAtual.timeAtual.map(function (pokemon) {
        return `
            <div class="time-card">
                <div class="time-info">
                    <h4>${escaparHtml(pokemon.nome)}</h4>
                    <span class="tag-tipo">${escaparHtml(pokemon.tipo)}</span>
                </div>
                <button type="button" class="botao botao-secundario botao-pequeno" data-remover-time="${escaparHtml(pokemon.nome)}">Remover</button>
            </div>
        `;
    }).join("");

    container.querySelectorAll("[data-remover-time]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            removerDoTime(botao.dataset.removerTime);
        });
    });
}

function adicionarPokemon(evento) {
    evento.preventDefault();

    const inputNome = document.getElementById("pokemonNome");
    const selectTipo = document.getElementById("pokemonTipo");

    if (!inputNome || !selectTipo) {
        return;
    }

    const nome = formatarNomePokemon(inputNome.value);
    const tipo = normalizarTipo(selectTipo.value);

    if (!nome) {
        mostrarStatus("Digite o nome do pokemon antes de adicionar.", "erro");
        return;
    }

    const jaExiste = dashboardAtual.capturados.some(function (pokemon) {
        return pokemon.nome.toLowerCase() === nome.toLowerCase();
    });

    if (jaExiste) {
        mostrarStatus("Esse pokemon ja esta na lista de capturas.", "erro");
        return;
    }

    dashboardAtual.capturados.push({
        id: Date.now(),
        nome: nome,
        tipo: tipo
    });

    dashboardAtual.resumo = montarResumo(
        dashboardAtual.resumo.starter,
        dashboardAtual.ginasios,
        dashboardAtual.capturados,
        dashboardAtual.timeAtual
    );

    inputNome.value = "";
    selectTipo.value = tipo;
    renderizarProjeto();
    mostrarStatus("Captura mockada adicionada com sucesso.", "sucesso");
}

function adicionarAoTime(evento) {
    evento.preventDefault();

    const select = document.getElementById("pokemonTimeSelect");

    if (!select || !select.value) {
        mostrarStatus("Selecione um pokemon capturado para entrar no time.", "erro");
        return;
    }

    if (dashboardAtual.timeAtual.length >= LIMITE_TIME) {
        mostrarStatus("O time principal aceita no maximo 6 pokemons.", "erro");
        return;
    }

    const pokemonSelecionado = dashboardAtual.capturados.find(function (pokemon) {
        return pokemon.nome === select.value;
    });

    if (!pokemonSelecionado) {
        mostrarStatus("Pokemon selecionado nao encontrado.", "erro");
        return;
    }

    dashboardAtual.timeAtual.push({
        id: pokemonSelecionado.id,
        nome: pokemonSelecionado.nome,
        tipo: pokemonSelecionado.tipo
    });

    dashboardAtual.resumo = montarResumo(
        dashboardAtual.resumo.starter,
        dashboardAtual.ginasios,
        dashboardAtual.capturados,
        dashboardAtual.timeAtual
    );

    renderizarProjeto();
    mostrarStatus("Pokemon adicionado ao time principal.", "sucesso");
}

function removerPokemon(nome) {
    const chave = String(nome || "").toLowerCase();

    dashboardAtual.capturados = dashboardAtual.capturados.filter(function (pokemon) {
        return pokemon.nome.toLowerCase() !== chave;
    });

    dashboardAtual.timeAtual = dashboardAtual.timeAtual.filter(function (pokemon) {
        return pokemon.nome.toLowerCase() !== chave;
    });

    dashboardAtual.resumo = montarResumo(
        dashboardAtual.resumo.starter,
        dashboardAtual.ginasios,
        dashboardAtual.capturados,
        dashboardAtual.timeAtual
    );

    renderizarProjeto();
}

function removerDoTime(nome) {
    const chave = String(nome || "").toLowerCase();

    dashboardAtual.timeAtual = dashboardAtual.timeAtual.filter(function (pokemon) {
        return pokemon.nome.toLowerCase() !== chave;
    });

    dashboardAtual.resumo = montarResumo(
        dashboardAtual.resumo.starter,
        dashboardAtual.ginasios,
        dashboardAtual.capturados,
        dashboardAtual.timeAtual
    );

    renderizarProjeto();
}

function preencherTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function mostrarStatus(texto, tipo) {
    const campoStatus = document.getElementById("mensagemStatus");

    if (!campoStatus) {
        return;
    }

    campoStatus.textContent = texto;
    campoStatus.classList.remove("sucesso", "erro");

    if (tipo) {
        campoStatus.classList.add(tipo);
    }
}

function exibirMensagemGrafico(canvas, mensagem) {
    if (!canvas || !canvas.parentElement) {
        return;
    }

    canvas.parentElement.innerHTML = `<div class="estado-vazio mensagem-grafico-vazio">${escaparHtml(mensagem)}</div>`;
}

function renderizarFallbackGraficos(mensagem) {
    exibirMensagemGrafico(document.getElementById("graficoProgresso"), mensagem);
    exibirMensagemGrafico(document.getElementById("graficoTipos"), mensagem);
}

function escaparHtml(texto) {
    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
