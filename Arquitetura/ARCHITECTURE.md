# Legenda dos componentes

Public Internet: Representa os usuários finais acessando o site através de seus navegadores.

Internet Gateway (IGW): Porta de entrada que permite a comunicação entre a rede da AWS e a internet pública.

VPC (Virtual Private Cloud): Seu ambiente de rede isolado logicamente na nuvem AWS, onde todos os recursos estão hospedados.

Public Subnet (Sub-rede Pública): Camada da rede que possui acesso direto à internet. É onde o servidor web reside para receber conexões.

Web App Server (EC2): Instância de computação que hospeda o site. Ela exibe os valores financeiros para o cliente e envia as ordens de compra/venda para a fila.

Private Subnet (Sub-rede Privada): Camada restrita, sem acesso direto da internet, garantindo a segurança dos dados e do processamento.

RDS Primary (MySQL/PostgreSQL): Banco de dados relacional que armazena informações críticas, como saldo dos usuários, histórico de transações e dados de perfil.

Financial Orders Queue (SQS): Serviço de mensageria que enfileira as requisições de compra e venda. Ele garante que nenhuma ordem seja perdida caso haja um pico de acessos ou instabilidade no processamento.

Order Processor (Lambda): Função sem servidor (serverless) que é disparada automaticamente quando uma nova ordem chega na fila SQS. Ela processa a transação de forma assíncrona.

External Financial API: Serviço externo (fora da AWS) que a Lambda consulta para validar preços de ativos em tempo real ou executar a ordem em uma bolsa de valores/corretora externa.

---

# Justificativa das Escolhas

## Por que foi escolhido o Amazon EC2?

O Amazon EC2 foi escolhido pela simplicidade de implementação e maior controle do ambiente. É uma solução adequada para um MVP, permitindo deploy rápido e fácil gerenciamento da aplicação.

Como alternativa, foi considerado o ECS Fargate, mas ele possui maior complexidade operacional para o cenário inicial.

---

## Por que foi utilizada AWS Lambda?

A AWS Lambda foi utilizada para processamento assíncrono das ordens, permitindo escalabilidade automática e integração simples com o SQS.

Além disso, o modelo de pagamento sob demanda ajuda na redução de custos.

A alternativa considerada foi o uso de workers em ECS, porém com maior custo e complexidade.

---

## Por que foi utilizado o Amazon SQS?

O Amazon SQS foi escolhido para desacoplar o processamento da API principal, aumentando a resiliência da arquitetura.

A fila também permite retry automático e absorção de picos de requisições.

O RabbitMQ foi avaliado, mas descartado devido à maior necessidade de gerenciamento.

---

## Por que foi escolhido o PostgreSQL RDS?

O PostgreSQL RDS foi escolhido por oferecer integridade transacional, importante para operações financeiras.

O banco possui suporte a transações ACID, controle de concorrência e integridade referencial.

O DynamoDB foi considerado, porém apresentava maior complexidade para cenários transacionais.

---

# Como a Arquitetura Escala

## Como a arquitetura escala?

A API pode escalar horizontalmente utilizando múltiplas instâncias EC2 atrás de um Load Balancer.

O SQS absorve picos de requisições e a Lambda escala automaticamente conforme o volume de mensagens.

O PostgreSQL pode crescer utilizando índices, replicação e connection pooling.

---

# Como a Arquitetura Lida com Falhas

## — Como a arquitetura trata falhas?

Se o serviço externo de cotação falhar, a Lambda realiza retry e timeout para evitar bloqueios.

Caso a Lambda falhe, as mensagens continuam armazenadas no SQS até o reprocessamento.

O RDS também oferece backups automáticos e snapshots para recuperação.

---

# Evolução da Arquitetura

## Como a arquitetura pode evoluir?

A arquitetura permite adicionar novos provedores de cotação sem alterar as regras centrais da aplicação.

Também é possível incluir novos tipos de ativos e processadores de forma desacoplada.

---

# Segurança

## Como a segurança é garantida?

A solução utiliza HTTPS, VPC, Security Groups e criptografia em trânsito.

Além disso, o PostgreSQL garante segurança transacional para operações financeiras.

Como evolução futura, está previsto uso de IAM Roles

---

# Observabilidade

## Como investigar falhas no processamento?

A investigação pode ser feita utilizando CloudWatch Logs, métricas do SQS, métricas da Lambda e monitoramento do PostgreSQL.

Os principais alertas seriam crescimento da fila, erros na Lambda e deadlocks no banco.

---

# Estimativa de Custos

##  Qual o custo estimado?

O ambiente inicial teria custo aproximado entre USD 80 e USD 100 por mês.

Os principais custos seriam:

* EC2
* PostgreSQL RDS
* Lambda
* SQS
* CloudWatch

Os valores aumentariam conforme o crescimento da aplicação.
