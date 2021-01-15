# Documentação da API "employees"

## Requisitos
-   Um funcionário deve possuir como atributos : Id , Idade , Nome e Cargo  
-   Salvar as informações necessárias em um banco de dados relacional ou não relacional de sua escolha dentro de uma infraestrutura AWS  
-   Será necessário que a Lambda consiga consultar, deletar e atualizar um funcionário e que ele esteja acessível via internet
-   É necessário que todas as mudanças sejam realizadas via Terraform

## API
-Acesso pelo url https://8isovz24u7.execute-api.us-east-1.amazonaws.com/api/employees
|Método|Endpoint|Função|Parâmetros|Retorno|
|------|--------|--------|--------|--------|
|GET|/api/employees|Selecionar Funcionários|N.A.|Array com todos os funcionários (JSON)|
|GET|/api/employees/:id|Selecionar Funcionário|N.A.|Funcionário(JSON) cujo uuid=id
|POST|/api/employees|Adicionar Funcionário|{"age":age,"name":name,"role":role}|Funcionário adicionado
|PUT|/api/employees/:id|Atualizar Funcionário|{("age":age),("name":name),("role":role)}|Funcionário atualizado
|DELETE|/api/employees/:id|Deletar Funcionário|N.A.|Funcionário deletado

 - ("name":name) significa que o parâmetro name, por exemplo, é opcional
 - Todo funcionário é identificável por um uuid de versão 4
 
## Tecnologias, arquiteturas e implementação
- Cumpre com os padrões **REST**
- *Framework* utiliza **node.js** (com **express** para requisições e respostas, e **joi** para validação de input) e **NoSQL** (database)
- Serviços da AWS utilizados foram **Lambda**, **API Gateway** e **DynamoDB**
- Foi utilizado **Terraform** para automatizar estruturação da AWS
- Versionamento em **git** (github)
- Arquitetura de **DAO** simplificada (sem façade)
- Erros e parâmetros mal formados são resolvidos com devido *status code*
- GET *requests* podem ser feitos diretamente pelo *browser*. Demais *requests* podem ser feitos pelo *postman* (ou qualquer outra ferramenta de requisições HTTP) passando os atributos descritos na sessão anterior em forma de JSON

## Exemplos da Utilização
**GET**
![enter image description here](https://i.imgur.com/KcEFMXR.png)

**GET**
![enter image description here](https://i.imgur.com/qx2cKvm.png)

**POST**
![enter image description here](https://i.imgur.com/48DDAAs.png)

**PUT**
![enter image description here](https://i.imgur.com/DLWA2OR.png)

**DELETE**
![enter image description here](https://i.imgur.com/FoyOCTw.png)

**EXEMPLO DE ERRO**
![enter image description here](https://i.imgur.com/F8I4d9z.png)
