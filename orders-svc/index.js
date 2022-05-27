require('dotenv').config();

const express = require('express');
const morganLogger = require("../middleware/morganLogger");

const AWS = require('aws-sdk');
const { getCrossAccountCredentials } = require("../config/iam");


const Logger = require("../logger/index");

AWS.config.update({region: process.env.AWS_REGION_SQS });

const app = express();

app.use(express.json());
app.use(morganLogger);

// the new endpoint
app.post('/order', async (req, res) => {

  const { userEmail, itemName, itemPrice, itemsQuantity } = req.body;

  const accessParams = await getCrossAccountCredentials;
  
  // Create an SQS service object
  const sqs = new AWS.SQS(accessParams);

  let orderData = {
    'userEmail': userEmail,
    'itemName': itemName,
    'itemPrice': itemPrice,
    'itemsQuantity': itemsQuantity
}

let sqsOrderData = {
    MessageAttributes: {
      "userEmail": {
        DataType: "String",
        StringValue: orderData.userEmail
      },
      "itemName": {
        DataType: "String",
        StringValue: orderData.itemName
      },
      "itemPrice": {
        DataType: "Number",
        StringValue: orderData.itemPrice
      },
      "itemsQuantity": {
        DataType: "Number",
        StringValue: orderData.itemsQuantity
      }
    },
    MessageBody: JSON.stringify(orderData),
    QueueUrl: process.env.AWS_SQS_URL
};

    // Send the order data to the SQS queue
    let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();

    sendSqsMessage.then((data) => {
        Logger.info(`Service: Orders Service, Action: Successful action, message: ${data.MessageId} `)
        res.status(200).json({
          message: "Obrigado pelo seu pedido. Verifique sua caixa de entrada para o e-mail de confirmação."
        })
    }).catch((err) => {
      Logger.error(`Service: Orders Service, Action: Error, message: ${err} `)
      res.status(400).json({
        message: "Encontramos um erro. Por favor, tente novamente."
      })
    });
});

app.listen(process.env.PORT, () => {
  Logger.info(`Orders service listening on port ${process.env.PORT}`);
});