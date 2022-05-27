## Nodejs-SQS

- Estudos sobre AWS SQS, para isso foi desenvolvido dois services
  - Orders Service
    - Responsavel por cadastrar uma ordem de pedido e armazenar na  fila do SQS
  - Emails Service
    - Responsavel por consumir a fila de ordem de pedido e enviar um email via gmail para o usuario, que fez o cadastro da ordem de pedido, essa ordem e pega via o consumer-sqs e pegando as informacoes do pedido

### Logs do funcionamento dos dois services

![Screenshot from 2022-05-27 12-01-23](https://user-images.githubusercontent.com/28688721/170726061-332f663d-d231-431a-b575-a684de882e09.png)
