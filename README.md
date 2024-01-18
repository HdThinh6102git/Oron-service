
# Resources needed

1. VS Code
2. Download PostgreSQL, pgAdmin4, and DBeaver
3. Download Node.js v18.14.2 (the project is currently using this version)
 
# How to run source code

1. Clone the source code from GitHub
   > Repository URL: https://github.com/HdThinh6102git/Oron-service
   > If you have already cloned the repository, make sure to run "git pull" each time you want to get the latest code.
2. Open the project in VS Code.
3. Open the terminal and run "npm i" to install dependencies.
4. Copy the ".env.dev" file and create a new file named ".env".
5. In pgAdmin, create a new database with the specified database name, password, user, and port (matching the configuration in the ".env" file).
6. Run "npm run start:dev" in the terminal.
7. Run the command "npm run migrate:up" to apply migrations to the database. Then, check if the tables have been created in the database.
8. Use the API to import address data by calling the "import address" endpoint.
9. Use DBeaver or pgAdmin to add data to the "Role" table with the name "USER".
10. Run tests on the APIs.

# Service

Node.js framework NestJS project structure

## Configuration

1. Create a `.env` file
    - Rename the [.env.dev](.env.dev) file to `.env` to fix it.
2. Edit env config
    - Edit the file in the [config](src/config) folder.
    - `default`, `development`, `production`

## Installation

```sh
# 1-1. npm < v7 or Node.js <= v18.14.0
npm i

## Development

```sh
npm run start:dev
# https://docs.nestjs.com/recipes/repl
npm run start:repl
```

Run [http://localhost:3500](http://localhost:3500)
## Folders

```js
+-- bin // Custom tasks
+-- dist // Source build
+-- public // Static Files
+-- src
|   +-- config // Environment Configuration
|   +-- entity // TypeORM Entities
|   +-- auth // Authentication
|   +-- common // Global Nest Module
|   |   +-- constants // Constant value and Enum
|   |   +-- controllers // Nest Controllers
|   |   +-- decorators // Nest Decorators
|   |   +-- dto // DTO (Data Transfer Object) Schema, Validation
|   |   +-- filters // Nest Filters
|   |   +-- guards // Nest Guards
|   |   +-- interceptors // Nest Interceptors
|   |   +-- interfaces // TypeScript Interfaces
|   |   +-- middleware // Nest Middleware
|   |   +-- pipes // Nest Pipes
|   |   +-- providers // Nest Providers
|   |   +-- * // models, repositories, services...
|   +-- shared // Shared Nest Modules
|   +-- gql // GraphQL Structure
|   +-- * // Other Nest Modules, non-global, same as common structure above
+-- test // Jest testing
+-- typings // Modules and global type definitions

// Module structure
// Add folders according to module scale. If it's small, you don't need to add folders.
+-- src/greeter
|   +-- * // folders
|   +-- greeter.constant.ts
|   +-- greeter.controller.ts
|   +-- greeter.service.ts
|   +-- greeter.module.ts
|   +-- greeter.*.ts
|   +-- index.ts
```

# [ORONAPI] CRUD Restful API for Social Media App Built With NestJS - PostgreSQL - TypeORM
## Introduction
Here is my source code for building Restful API of a social media app for users who want to share their redundant food or something, and then others can register to receive those things. 
## Motivation
 In Vietnam's daily life, I realized that there are many households with excess food that is not used up. Meanwhile, some people need that amount of food for their living, to make pet food for example. Moreover, it is the demand to give and take old things together. From that actual need, I decided to build a social media app dedicated to sharing utensils (food, items, ..) to make this sharing more efficient and convenient and called the application as ORON (Our Redundances Other Necessaries).
## Class Diagram
<p align="center">
  <i>Link class diagram: https://drive.google.com/file/d/1OqqU6cUDUg2Oe8Fo04Y2_PoL0qibSTc5/view?usp=sharing</i><br/>
</p>

## Main functions: 
* **CRUD User**
* **Authentication/Authorization (Spring Security/ JWT Auth)**
* **CRUD Post**
* **CRUD PostRegister**
* **CRUD Comment**

### git commit rule
> type(scope?): subject
>
```angular2html
type ở trên có thể là:
    - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
    - chore: add something without touching production code (Eg: update npm dependencies)
    - docs: Documentation only changes
    - feat: A new feature
    - fix: A bug fix
    - perf: A code change that improves performance
    - refactor: A code change that neither fixes a bug nor adds a feature
    - revert: Reverts a previous commit
    - style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
    - test: Adding missing tests or correcting existing tests
```
migrate generate (auto generate all changes (foreign drop table)): npm run migrate:generate
migrate up (up all migrate files to the database): npm run migrate:up
migrate down (rollback file latest database): npm run migrate:down
```
