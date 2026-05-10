-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
CREATE DATABASE pokemonIndividual;
USE pokemonIndividual;

-- USUÁRIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POKÉMONS
CREATE TABLE pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    tipo VARCHAR(20),
    imagem VARCHAR(255)
);

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
    id_usuario INT,
    id_ginasio INT,
    concluido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_ginasio) REFERENCES ginasios(id)
);

-- POKÉMONS DO USUÁRIO
CREATE TABLE usuario_pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_pokemon INT,
    capturado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemons(id)
);

-- TIMES
CREATE TABLE times (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nome_time VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- POKÉMONS DOS TIMES
CREATE TABLE time_pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_time INT,
    id_pokemon INT,
    FOREIGN KEY (id_time) REFERENCES times(id),
    FOREIGN KEY (id_pokemon) REFERENCES pokemons(id)
);