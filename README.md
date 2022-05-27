## Nodejs-SQS

- Estudos sobre AWS SQS, para isso foi desenvolvido dois services
  - Orders Service
    - Responsavel por cadastrar uma ordem de pedido e armazenar na  fila do SQS
  - Emails Service
    - Responsavel por consumir a fila de ordem de pedido e enviar um email via gmail para o usuario, que fez o cadastro da ordem de pedido, essa ordem e pega via o consumer-sqs e pegando as informacoes do pedido