# Sistema de Ordens de Investimento

Sistema fullstack para criação e processamento de ordens de investimento.

---

# 🚀 Tecnologias Utilizadas

## Backend
- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker

## Frontend
- Next.js
- React

---

# 🚀 Funcionalidades

## Backend
- Listagem de ativos
- Criação de ordens de compra
- Criação de ordens de venda
- Cancelamento de ordens pendentes
- Processamento assíncrono de ordens
- Histórico de transações
- Integração com serviço externo de cotações
- Retry e timeout para falhas externas
- Tratamento de concorrência

## Frontend
- Visualização de ativos
- Compra de ativos
- Venda de ativos
- Visualização de ordens
- Atualização automática de status
- Cancelamento de ordens
- Visualização de posições do usuário

---

# 🚀 Estrutura do Projeto

```text
investment-system/
│
├── backend/
├── frontend/
├── quotation-service/
├── README.md
└── ARCHITECTURE.md
Arquitetura
```

---

# 🚀 Como Executar o Projeto

## Pré-requisitos

- Node.js 18+
- Docker
- Docker Compose
- PostgreSQL
- npm

---

# 🚀 1. Clonar repositório

```bash
git clone <repo-url>
cd investment-system
```

---

# 🚀 2. Subir PostgreSQL com Docker

```bash
docker-compose up -d
```

---

# 🚀 3. Backend

## Entrar na pasta

```bash
cd backend
```

## Instalar dependências

```bash
npm install
```

## Executar migrations

```bash
npx prisma migrate dev
```

## Executar seed

```bash
npx prisma db seed
```

## Rodar backend

```bash
npm run start:dev
```

Backend disponível em:

```text
http://localhost:3000
```

---

# 🚀 4. Serviço de Cotações

## Entrar na pasta

```bash
cd quotation-service
```

## Instalar dependências

```bash
npm install
```

## Rodar serviço

```bash
npm start
```

Serviço disponível em:

```text
http://localhost:3001
```

---

# 🚀 5. Frontend

## Entrar na pasta

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Rodar frontend

```bash
npm run dev -- -p 3002
```

Frontend disponível em:

```text
http://localhost:3002
```

---

# 🚀 Fluxo de Processamento de Ordens

## Criação
1. Usuário cria ordem
2. Ordem salva como `PENDING`
3. Ordem enviada para fila

---

## Processamento
1. Worker consome fila
2. Sistema consulta serviço de cotações
3. Retry e timeout são aplicados
4. Ordem:
   - `EXECUTED`
   - ou `REJECTED`

---

## Atualização de saldo
- Compra aumenta posição
- Venda diminui posição

---

# 🚀 Tratamento de Falhas

O serviço de cotações externo é propositalmente instável:
- timeout
- latência variável
- falhas aleatórias

---

# Estratégias adotadas

## Retry
O sistema tenta novamente em caso de falha temporária.

## Timeout
Requisições possuem timeout para evitar bloqueio do processamento.

## Rejeição segura
Caso o serviço permaneça indisponível:
- ordem é rejeitada
- consistência financeira preservada

---

# 🚀 Tratamento de Concorrência

## Cenário

Usuário possui:

```text
100 ITUB4
```

Usuário envia simultaneamente:

```text
2 ordens de venda de 80
```

---

# Estratégia adotada

Foi utilizada:
- transação no PostgreSQL
- lock pessimista

---

# Resultado

| Ordem | Resultado |
|---|---|
| Primeira | EXECUTADA |
| Segunda | REJEITADA |

---

# Trade-offs

## Benefício
Garantia de integridade financeira.

## Desvantagem
Menor throughput em cenários extremos de concorrência.

---

# 🚀 Decisões Técnicas

## PostgreSQL ao invés de NoSQL

Foi escolhido PostgreSQL devido a:
- transações ACID
- consistência
- integridade financeira
- controle de concorrência

---

## NestJS ao invés de Express puro

NestJS foi escolhido por:
- arquitetura modular
- injeção de dependência
- escalabilidade
- organização
- manutenção facilitada

---

## Fila em Memória

No código foi utilizada fila em memória pela simplicidade do desafio.

Em ambiente produtivo:
- Amazon SQS seria utilizado

---

# Sugestão de Observabilidade

Logs monitorados:
- falhas de cotação
- timeout
- retries
- ordens rejeitadas
- erros de processamento

Métricas:
- tamanho da fila
- tempo de processamento
- taxa de falhas

---

# Sugestões ao Provedor de Cotações

Melhorias sugeridas:
- SLA definido 
- endpoint de healthcheck mais robusto
- cache distribuído

---

OBSERVAÇÕES: Foi disponibilizada a pasta Images onde criei conceitualmente as telas onde devemos constar os dados de operações, posição e ativos. 
Há uma imagem do das ordens criadas como massa de teste durante a simulação do desafio.
A pasta Arquitetura contém o um exemplo conceitual de arquitetura que julguei estar de acordo a desafio bem como sua legenda no arquivo ARCHITECTURE