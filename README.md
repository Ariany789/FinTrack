# FinTrack

Sistema de gerenciamento financeiro pessoal desenvolvido com o objetivo de facilitar o controle, a organização e o acompanhamento das finanças.

O FinTrack permite centralizar informações financeiras em um único ambiente, possibilitando o registro de receitas e despesas, acompanhamento do saldo, organização por categorias e visualização da situação financeira de forma clara e estruturada.

O projeto também foi desenvolvido como uma aplicação prática de desenvolvimento Full Stack, aplicando conceitos de arquitetura de software, desenvolvimento de APIs, persistência de dados, autenticação, regras de negócio e integração entre frontend e backend.

---

## Sobre o projeto

O controle financeiro é uma atividade importante para compreender como o dinheiro está sendo utilizado ao longo do tempo. Entretanto, acompanhar receitas, despesas e diferentes categorias manualmente pode se tornar trabalhoso e pouco organizado.

O FinTrack foi desenvolvido para solucionar esse problema por meio de uma aplicação web que concentra as principais informações financeiras do usuário.

A aplicação busca oferecer uma experiência simples e objetiva, permitindo que o usuário registre suas movimentações e acompanhe sua evolução financeira através de informações organizadas.

O projeto foi pensado desde o início considerando aspectos encontrados em aplicações reais, como:

* Persistência de dados
* Validação de informações
* Regras de negócio
* Operações CRUD
* Organização por categorias
* Filtros e consultas
* Dashboard financeiro
* Comunicação entre frontend e backend
* Estrutura preparada para evolução

---

## Objetivos

Os principais objetivos do FinTrack são:

* Criar uma aplicação real para gerenciamento financeiro pessoal.
* Permitir o controle de receitas e despesas.
* Facilitar a visualização do saldo financeiro.
* Organizar movimentações por categorias.
* Aplicar boas práticas de desenvolvimento de software.
* Desenvolver uma arquitetura organizada e escalável.
* Praticar a integração entre frontend, backend e banco de dados.
* Implementar autenticação e proteção de dados.
* Desenvolver uma API organizada.
* Criar um projeto completo para composição de portfólio profissional.

---

## Funcionalidades

### Autenticação e usuários

* Cadastro de usuários
* Login
* Autenticação
* Proteção de recursos privados
* Gerenciamento das informações do usuário
* Controle de acesso aos dados financeiros

### Gestão financeira

* Cadastro de receitas
* Cadastro de despesas
* Consulta de movimentações
* Atualização de movimentações
* Exclusão de movimentações
* Definição de categorias
* Registro de descrição
* Registro de valores
* Registro de datas
* Identificação do tipo de movimentação

### Dashboard

O sistema possui uma área destinada à visualização das principais informações financeiras do usuário.

Entre os dados apresentados estão:

* Saldo
* Total de receitas
* Total de despesas
* Movimentações recentes
* Distribuição das despesas
* Informações agrupadas por período
* Indicadores financeiros

### Organização das informações

O sistema também foi planejado para permitir:

* Filtragem de movimentações
* Organização por período
* Organização por categoria
* Ordenação dos resultados
* Paginação de dados
* Consultas específicas

---

## Arquitetura

O FinTrack utiliza uma arquitetura baseada na separação entre frontend, backend e banco de dados.

```text
                         FINTRACK

                            Usuário
                               |
                               v
                     +-------------------+
                     |     Frontend      |
                     |   Interface Web   |
                     +---------+---------+
                               |
                               | HTTP / REST
                               v
                     +-------------------+
                     |      Backend      |
                     |      API REST     |
                     +---------+---------+
                               |
                    +----------+----------+
                    |                     |
                    v                     v
             Regras de negócio       Autenticação
                    |
                    v
             +-------------------+
             |     Database      |
             |  Dados persistidos|
             +-------------------+
```

### Frontend

O frontend é responsável pela interface da aplicação e pela interação com o usuário.

Entre suas responsabilidades estão:

* Apresentação das informações
* Formulários
* Dashboard
* Navegação
* Validações de interface
* Consumo da API
* Gerenciamento do estado da aplicação

### Backend

O backend concentra a lógica da aplicação e disponibiliza os recursos necessários para o frontend.

Entre suas responsabilidades estão:

* Disponibilização da API
* Autenticação
* Autorização
* Validação de dados
* Regras de negócio
* Operações CRUD
* Comunicação com o banco de dados
* Processamento das informações financeiras

### Banco de dados

O banco de dados é responsável pela persistência das informações da aplicação.

Entre os dados armazenados estão:

* Usuários
* Transações
* Categorias
* Informações financeiras
* Datas de criação e atualização

---

## Estrutura do projeto

A estrutura do projeto é organizada de forma a separar as responsabilidades de cada camada da aplicação.

```text
fintrack/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── tests/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   │
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

A estrutura pode evoluir conforme novas funcionalidades forem adicionadas ao projeto.

---

## Fluxo da aplicação

O funcionamento básico do FinTrack segue o fluxo:

```text
Usuário
   |
   v
Frontend
   |
   | Requisição HTTP
   v
Backend
   |
   +--> Autenticação
   |
   +--> Validação
   |
   +--> Regra de negócio
   |
   +--> Persistência
   |
   v
Banco de dados
   |
   v
Backend
   |
   | Resposta HTTP
   v
Frontend
   |
   v
Usuário
```

Esse modelo permite manter as responsabilidades separadas e facilita a manutenção e evolução do sistema.

---

## Segurança

A aplicação considera práticas de segurança para proteger as informações dos usuários.

Entre elas estão:

* Autenticação de usuários
* Proteção de recursos privados
* Validação das informações recebidas
* Controle de acesso
* Armazenamento seguro de credenciais
* Separação de informações sensíveis através de variáveis de ambiente
* Proteção das informações financeiras associadas a cada usuário

Cada usuário deve possuir acesso somente aos seus próprios dados financeiros.

---

## Regras de negócio

O FinTrack também considera regras para garantir a consistência das informações.

Exemplos:

* Uma movimentação deve estar associada a um usuário.
* O usuário não deve conseguir acessar movimentações pertencentes a outro usuário.
* Valores financeiros devem ser validados antes de serem armazenados.
* Os dados obrigatórios devem ser informados corretamente.
* Receitas e despesas devem possuir um tipo definido.
* As movimentações devem possuir uma categoria quando aplicável.
* Operações de atualização e exclusão devem respeitar as permissões do usuário.

As regras podem ser ampliadas conforme novas funcionalidades forem implementadas.

---

## API

O backend disponibiliza uma API responsável pela comunicação entre o frontend e o servidor.

A API segue o conceito de arquitetura REST, utilizando requisições HTTP para realizar operações sobre os recursos da aplicação.

As principais operações seguem o padrão:

| Método    | Operação | Descrição             |
| --------- | -------- | --------------------- |
| GET       | Read     | Consulta informações  |
| POST      | Create   | Cria um novo registro |
| PUT/PATCH | Update   | Atualiza um registro  |
| DELETE    | Delete   | Remove um registro    |

Os recursos da API estão relacionados principalmente a:

* Usuários
* Autenticação
* Transações
* Categorias
* Informações financeiras

---

## CRUD de transações

As transações representam as principais movimentações financeiras do sistema.

O ciclo de gerenciamento segue o padrão CRUD:

```text
Create
   |
   v
Criar transação
   |
   v
Read
   |
   v
Consultar transações
   |
   v
Update
   |
   v
Atualizar transação
   |
   v
Delete
   |
   v
Excluir transação
```

Esse modelo permite que o usuário tenha controle completo sobre seus registros financeiros.

---

## Tecnologias

O projeto foi desenvolvido utilizando tecnologias voltadas para desenvolvimento web moderno.

### Backend

* API REST
* Arquitetura baseada em camadas
* ORM para comunicação com o banco de dados
* Sistema de autenticação
* Validação de dados
* Migrations para gerenciamento do banco de dados

### Frontend

* Aplicação web responsiva
* Componentização
* Integração com API REST
* Gerenciamento de estado
* Validação de formulários

### Banco de dados

O sistema utiliza um banco de dados relacional para armazenamento e relacionamento das informações da aplicação.

### Ferramentas

* Git
* GitHub
* Gerenciador de dependências
* Ambiente virtual
* Ferramentas de desenvolvimento e testes

---

## Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir as ferramentas necessárias instaladas na máquina.

Também é necessário configurar o banco de dados utilizado pela aplicação.

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Depois:

```bash
cd fintrack
```

### 2. Configurar o backend

Entre no diretório do backend:

```bash
cd backend
```

Instale as dependências necessárias utilizando o gerenciador de pacotes definido pelo projeto.

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` baseado nas configurações necessárias para o ambiente local.

Exemplo:

```env
DATABASE_URL=
SECRET_KEY=
ENVIRONMENT=
```

As informações sensíveis não devem ser armazenadas diretamente no código ou enviadas para o repositório.

### 4. Configurar o banco de dados

Execute as migrations necessárias para criar e atualizar a estrutura do banco de dados.

### 5. Executar o backend

Inicie o servidor da API utilizando o comando configurado no projeto.

### 6. Executar o frontend

Abra um novo terminal, entre no diretório do frontend e instale as dependências.

Depois, execute o servidor de desenvolvimento.

Após iniciar os dois serviços, o frontend poderá se comunicar com a API do FinTrack.

---

## Variáveis de ambiente

As variáveis de ambiente são utilizadas para manter configurações sensíveis fora do código-fonte.

Exemplo:

```env
DATABASE_URL=
SECRET_KEY=
ENVIRONMENT=
```

O arquivo `.env` deve permanecer fora do controle de versão.

Para isso, ele deve estar incluído no `.gitignore`.

---

## Testes

O projeto foi estruturado para permitir a implementação de testes automatizados nas diferentes camadas da aplicação.

Os testes podem abranger:

* Autenticação
* Usuários
* Transações
* Categorias
* Regras de negócio
* Validações
* Endpoints da API

O objetivo dos testes é garantir que as funcionalidades continuem funcionando corretamente conforme o sistema evolui.

---

## Roadmap

O desenvolvimento do FinTrack é realizado de maneira incremental.

### Concluído

* Estrutura inicial do projeto
* Definição da proposta da aplicação
* Organização inicial da arquitetura

### Em desenvolvimento

* Sistema de autenticação
* Gerenciamento de usuários
* Gerenciamento de transações
* Categorias
* Dashboard financeiro
* Integração entre frontend e backend

### Próximas etapas

* Implementação completa do controle financeiro
* Filtros avançados
* Paginação
* Ordenação
* Indicadores financeiros
* Gráficos
* Testes automatizados
* Melhorias de experiência do usuário
* Deploy em ambiente de produção
* Documentação completa da API

---

## Boas práticas utilizadas

Durante o desenvolvimento do projeto são consideradas boas práticas como:

* Separação de responsabilidades
* Organização por camadas
* Código reutilizável
* Validação de dados
* Tratamento de erros
* Variáveis de ambiente
* Versionamento com Git
* Commits organizados
* Documentação
* Testes automatizados
* Princípios de segurança
* Código preparado para manutenção e evolução

---

## Git e commits

O projeto utiliza Git para controle de versão.

Os commits seguem uma convenção semântica para facilitar a compreensão do histórico.

Exemplos:

```text
feat: adiciona cadastro de transações
feat: implementa autenticação de usuários
fix: corrige cálculo do saldo
refactor: reorganiza camada de serviços
test: adiciona testes para transações
docs: atualiza documentação
chore: atualiza dependências
```

---

## Contribuição

Contribuições podem ser realizadas através de Pull Requests.

Para contribuir:

1. Faça um fork do projeto.
2. Crie uma nova branch.
3. Realize as alterações.
4. Execute os testes.
5. Faça um commit descrevendo a alteração.
6. Envie a branch para o GitHub.
7. Abra um Pull Request.

Exemplo:

```bash
git checkout -b feature/nova-funcionalidade
```

Depois:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

---

## Licença

Este projeto está sob a licença definida no arquivo `LICENSE` deste repositório.

---

## Autora

Desenvolvido por **Ariany Sthefany**.

O FinTrack faz parte do processo de desenvolvimento de projetos práticos com foco em evolução técnica, aplicação de boas práticas e construção de soluções próximas de cenários reais de desenvolvimento de software.

---

## Considerações finais

O FinTrack foi desenvolvido com o propósito de ir além de um simples projeto de gerenciamento financeiro.

A aplicação representa uma oportunidade de aplicar conceitos de desenvolvimento de software em um sistema completo, trabalhando desde a interface com o usuário até a persistência e processamento dos dados.

O projeto continuará evoluindo com a implementação de novas funcionalidades, melhorias de arquitetura, testes, segurança, experiência do usuário e disponibilização em ambiente de produção.

O objetivo final é construir uma aplicação sólida, organizada, funcional e preparada para representar um projeto real de desenvolvimento Full Stack.
