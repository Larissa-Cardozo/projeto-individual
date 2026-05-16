CREATE DATABASE pokemonIndividual;
USE pokemonIndividual;

-- USUÁRIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    inicial VARCHAR(30),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE usuarios;

CREATE TABLE pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    tipo VARCHAR(20)
);
INSERT INTO pokemons (nome, tipo) VALUES
('Bulbassauro', 'Planta'),
('Ivivassauro', 'Planta'),
('Venussauro', 'Planta'),
('Charmander', 'Fogo'),
('Charmeleon', 'Fogo'),
('Charizard', 'Fogo'),
('Squirtle', 'Água'),
('Wartortle', 'Água'),
('Blastoise', 'Água'),
('Caterpie', 'Inseto'),
('Metapod', 'Inseto'),
('Butterfree', 'Inseto'),
('Weedle', 'Inseto'),
('Kakuna', 'Inseto'),
('Beedrill', 'Inseto'),
('Pidgey', 'Voador'),
('Pidgeotto', 'Voador'),
('Pidgeot', 'Voador'),
('Rattata', 'Normal'),
('Raticate', 'Normal'),
('Spearow', 'Voador'),
('Fearow', 'Voador'),
('Ekans', 'Veneno'),
('Arbok', 'Veneno'),
('Pikachu', 'Elétrico'),
('Raichu', 'Elétrico'),
('Sandshrew', 'Terra'),
('Sandslash', 'Terra'),
('Nidoran Fêmea', 'Veneno'),
('Nidorina', 'Veneno'),
('Nidoqueen', 'Veneno'),
('Nidoran Macho', 'Veneno'),
('Nidorino', 'Veneno'),
('Nidoking', 'Veneno'),
('Clefairy', 'Fada'),
('Clefable', 'Fada'),
('Vulpix', 'Fogo'),
('Ninetales', 'Fogo'),
('Jigglypuff', 'Fada'),
('Wigglytuff', 'Fada'),
('Zubat', 'Veneno'),
('Golbat', 'Veneno'),
('Oddish', 'Planta'),
('Gloom', 'Planta'),
('Vileplume', 'Planta'),
('Paras', 'Inseto'),
('Parasect', 'Inseto'),
('Venonat', 'Inseto'),
('Venomoth', 'Inseto'),
('Diglett', 'Terra'),
('Dugtrio', 'Terra'),
('Miau', 'Normal'),
('Persian', 'Normal'),
('Psyduck', 'Água'),
('Golduck', 'Água'),
('Mankey', 'Lutador'),
('Primeape', 'Lutador'),
('Growlithe', 'Fogo'),
('Arcanine', 'Fogo'),
('Poliwag', 'Água'),
('Poliwhirl', 'Água'),
('Poliwrath', 'Água'),
('Abra', 'Psíquico'),
('Kadabra', 'Psíquico'),
('Alakazam', 'Psíquico'),
('Machop', 'Lutador'),
('Machoke', 'Lutador'),
('Machamp', 'Lutador'),
('Bellsprout', 'Planta'),
('Weepinbell', 'Planta'),
('Victreebel', 'Planta'),
('Tentacool', 'Água'),
('Tentacruel', 'Água'),
('Geodude', 'Pedra'),
('Graveler', 'Pedra'),
('Golem', 'Pedra'),
('Ponyta', 'Fogo'),
('Rapidash', 'Fogo'),
('Slowpoke', 'Água'),
('Slowbro', 'Água'),
('Magnemite', 'Elétrico'),
('Magneton', 'Elétrico'),
('Farfetchd', 'Voador'),
('Doduo', 'Voador'),
('Dodrio', 'Voador'),
('Seel', 'Água'),
('Dewgong', 'Água'),
('Grimer', 'Veneno'),
('Muk', 'Veneno'),
('Shellder', 'Água'),
('Cloyster', 'Água'),
('Gastly', 'Fantasma'),
('Haunter', 'Fantasma'),
('Gengar', 'Fantasma'),
('Onix', 'Pedra'),
('Drowzee', 'Psíquico'),
('Hypno', 'Psíquico'),
('Krabby', 'Água'),
('Kingler', 'Água'),
('Voltorb', 'Elétrico'),
('Electrode', 'Elétrico'),
('Exeggcute', 'Planta'),
('Exeggutor', 'Planta'),
('Cubone', 'Terra'),
('Marowak', 'Terra'),
('Hitmonlee', 'Lutador'),
('Hitmonchan', 'Lutador'),
('Lickitung', 'Normal'),
('Koffing', 'Veneno'),
('Weezing', 'Veneno'),
('Rhyhorn', 'Terra'),
('Rhydon', 'Terra'),
('Chansey', 'Normal'),
('Tangela', 'Planta'),
('Kangaskhan', 'Normal'),
('Horsea', 'Água'),
('Seadra', 'Água'),
('Goldeen', 'Água'),
('Seaking', 'Água'),
('Staryu', 'Água'),
('Starmie', 'Água'),
('Mr. Mime', 'Psíquico'),
('Scyther', 'Inseto'),
('Jynx', 'Gelo'),
('Electabuzz', 'Elétrico'),
('Magmar', 'Fogo'),
('Pinsir', 'Inseto'),
('Tauros', 'Normal'),
('Magikarp', 'Água'),
('Gyarados', 'Água'),
('Lapras', 'Água'),
('Ditto', 'Normal'),
('Eevee', 'Normal'),
('Vaporeon', 'Água'),
('Jolteon', 'Elétrico'),
('Flareon', 'Fogo'),
('Porygon', 'Normal'),
('Omanyte', 'Pedra'),
('Omastar', 'Pedra'),
('Kabuto', 'Pedra'),
('Kabutops', 'Pedra'),
('Aerodactyl', 'Pedra'),
('Snorlax', 'Normal'),
('Articuno', 'Gelo'),
('Zapdos', 'Elétrico'),
('Moltres', 'Fogo'),
('Dratini', 'Dragão'),
('Dragonair', 'Dragão'),
('Dragonite', 'Dragão'),
('Mewtwo', 'Psíquico'),
('Mew', 'Psíquico');

-- PROGRESSO GERAL
CREATE TABLE progresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    starter VARCHAR(20),
    ginasios_completos INT DEFAULT 0,
    total_capturados INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- GINÁSIOS
CREATE TABLE ginasios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    lider VARCHAR(50)
);

-- PROGRESSO NOS GINÁSIOS
CREATE TABLE usuario_ginasios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    id_ginasio INT UNIQUE,
    concluido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_ginasio) REFERENCES ginasios(id)
);

-- POKÉMONS DO USUÁRIO
CREATE TABLE usuario_pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    id_pokemon INT UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemons(id)
);

CREATE TABLE times (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nome_time VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- POKÉMONS DOS TIMES
CREATE TABLE time_pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_time INT UNIQUE,
    id_pokemon INT UNIQUE,
    FOREIGN KEY (id_time) REFERENCES times(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemons(id)
);

INSERT INTO times (id_usuario, nome_time)
VALUES (1, 'Time Principal');

select* from usuarios;

