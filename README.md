# #03 - Node

## Fundamentos de Node.js

- Esse projeto foi feito a partir do 2º módulo do curso de Formação Node.js da Rocketseat.

<div align="center">

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/pt) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/) [![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://render.com/) [![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)](https://insomnia.rest/)
</div>

<div align="center">
        <h2>
          <a href="#information_source-sobre">Sobre</a>&nbsp;|&nbsp;
          <a href="#dizzy-funcionalidades">Funcionalidades</a>&nbsp;|&nbsp;
          <a href="#seedling-requisitos-mínimos">Requisitos</a>&nbsp;|&nbsp;
          <a href="#rocket-tecnologias-utilizadas">Tecnologias</a>&nbsp;|&nbsp;
          <a href="#package-como-baixar-e-executar-o-projeto">Baixar e Executar</a>&nbsp;
        </h2>
</div>

---

<div align="center" >

**[Vídeo no Youtube]()**

</div>

---

## :information_source: Sobre

- Esse é o 2º projeto do curso Formação Node.js da Rocketseat, onde devemos criar uma API simples de criação, atualização e remoção de transações financeiras.
- O objetivo desse projeto é começarmos a usar **micro-frameworks para criação de APIs Rest**, e entendermos como podemos aplicar os conceitos básicos de APIs com essas ferramentas.
- Assim, nesse projeto usamos o **Fastify em conjunto com o knex para conexão com um banco de dados SQLite**, criamos rotas para manipulação de transações financeiras com persistência de dados e realizamos o deploy da aplicação.
- Além disso, abordamos as formas de conexões com banco de dados que podemos utilizar como:
  1. Drives Nativos
  2. Query Builders
  3. ORMs
- Acabamos por escolher o **Query Builder Knex**, é o Query builder mais famoso do ambiente NodeJS, permite **escrever queries SQL de forma mais simples e mais próxima do JavaScript**, sendo uma porta de entrada fácil para lidar com conexão com Banco de dados, além de ser uma ferramenta que nos permite mudar de banco de dados sem muita complexidade, e com isso, usamos o SQLite para desenvolvimento e o Postgres para o ambiente de produção/deploy.
- Por fim, nesse projeto, também abordamos **testes End to End com o auxílio do Vitest e Supertest**, para testarmos todas nossas rotas e garantirmos que elas estão funcionando corretamente.
  
- Tecnologias principais:
   1. Fastify:
       - Ferramenta que **auxilia**  na **criação de rotas**, não **vai opinar sobre qual banco de dados usar**, qual **template engine usar**, ou **qual estrutura de pastas vamos usar**, etc. Ele é focado em ser totalmente **flexível** e em **facilitar** a criação de rotas para uma API Rest.
       - Além disso, ele naturalmente entende o TypeScript e lida muito bem com assincronismo do JavaScript.

   2. Knex:
      - Realiza a **conexão** com **Banco de dado** e nos permite escrever queries SQL de forma mais **simples** e mais **próxima** do JavaScript.
      - Conexão feita com **SQLite** para desenvolvimento e **Postgres** para produção/deploy.

   3. Bancos de dados
      1. SQLite:
         - Banco de dados utilizado para **desenvolvimento**, muito simples e fácil de se lidar para pequenos projetos, além de **simular** um banco de dados **relacional**.
      2. Postgres:
         - Banco de dados utilizado para **produção**/**deploy**, muito robusto e escalável, além de ser um **banco de dados relacional**.

   4. Render:
        - Publicarmos nossa API na plataforma **[Render](https://render.com/)**, que é uma plataforma de deploy que nos permite publicar aplicações de forma **simples** e **rápida**, além de ser **gratuita** para **pequenos projetos**.
  
---

## :dizzy: Funcionalidades

  1. Criamos um servidor HTTP com o **Fastify**;
  2. Configuramos o Knex no projeto para conexão com o banco de dados SQLite e Postgres;
  3. Criamos as estruturas dos Bancos por maio das Migrations com o Knex.
  4. Com a instância do Fastify, criamos rotas para manipulação das transações em conjunto com plugins, com os seguintes métodos:
     1. **```GET - /transactions```** => Listagem de todas transações.
     2. **```GET - /transactions/:id```** => Busca da transação pelo id.
     3. **```GET - /transactions/balance```** => Cálculo do saldo do usuário.
     4. **```POST - /transactions```** => Criação de uma nova transação recebendo **title**, **amount** e **type** no corpo da requisição, e adicionando os campos **```id```**, **```created_at```** e **```session_id```**.
     5. **```DELETE - /transactions/:id```** => Remoção de uma transação de acordo com o id enviado via route params.
     6. **```DELETE - /transactions/```** => Exclusão de **todas** transações.
  5. Todas as transações acima, **realizam suas ações de acordo com o session_id**, que é um **identificador único para cada sessão**, simulando um usuário logado que vai estar aplicado nos Cookies das requisições.
     1. Caso o usuário **não** tenha um **session_id**, ele é criado **automaticamente com a requisição de cadastrar uma nova transação**, e já é aplicado nos Cookies para as próximas requisições.
  6. Em todas transações que **dependem de algum parâmetro** seja pelo **corpo** ou **route params**, temos **validações feitas pelo ZOD**, para garantir que os dados estão sendo enviados corretamente.
  7. Além disso, criamos um **middleware** para **validar** o **```session_id```** em todas rotas, garantindo **acessar** os dados de acordo com o "usuário logado".
  8. Realizamos testes End to End em todas as rotas por meio do Vitest e Supertest, garantindo que todas as rotas estão funcionando corretamente.

---

## :seedling: Requisitos Mínimos

  1. NodeJS
  2. PostgreSQL

---

## :rocket: Tecnologias Utilizadas

- O projeto foi desenvolvido utilizando as seguintes tecnologias:

  1. **[dotenv](https://www.npmjs.com/package/dotenv)**
  2. **[Fastify](https://fastify.dev/)**
  3. **[Knex](http://knexjs.org/)**
  4. **[NodeJS](https://nodejs.org/pt)**
  5. **[Postgres](https://www.postgresql.org/)**
  6. **[SQLite](https://www.sqlite.org/index.html)**
  7. **[Supertest](https://www.npmjs.com/package/supertest)**
  8. **[tsx](https://www.npmjs.com/package/tsx)**
  9. **[tsup](https://tsup.egoist.dev)**
  10. **[TypeScript](https://www.typescriptlang.org/)**
  11. **[Vitest](https://www.npmjs.com/package/vitest)**
  12. **[Zod](https://zod.dev/)**

---

## :package: Como baixar e executar o projeto

### Baixar

- Clonar o projeto:

  ```bash
   git clone https://github.com/Aszurar/dtmoney-back.git
  ```

- É necessário ter o Node.js instalado na máquina assim como todas **tecnologias**/**dependências** citadas acima.
  - [Instalação do NodeJS](https://nodejs.org/en/)

### Instalação das dependências

```bash
  pnpm i
```

### Variáveis de ambiente

- Lembre-se de configurar a .env(**variáveis de ambiente**) antes de rodar o projeto

### Execução das migrations

- Lembre-se de executar as migrations antes de rodar o projeto

```bash
 pnpm knex -- migrate:latest
```

### Execução

- Caso tudo tenha sido instalado com sucesso, basta executar na raiz do projeto:

  ```bash
    pnpm dev
  ```

- Após isso, basta realizar requisições de acordo com as rotas definidas no arquivo `src/routes.js` utilizando o **[Insomnia](https://insomnia.rest/)**, **[Postman](https://www.postman.com/)** ou via terminal com **[httpie](https://httpie.io/)**

<div align="center">

Desenvolvido por :star2: Lucas de Lima Martins de Souza.

</div>
