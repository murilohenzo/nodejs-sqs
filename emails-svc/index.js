require('dotenv').config();

const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const nodemailer = require("nodemailer");

const Logger = require("../logger/index");

AWS.config.update({region: process.env.AWS_REGION_SQS });

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
});

function sendMail(message) {
    let sqsMessage = JSON.parse(message.Body);
    const emailMessage = {
        from: process.env.NODEMAILER_USER,
        to: sqsMessage.userEmail,
        subject: 'Pedido Recebido | NodeShop',
        html: `<p>Ola ${sqsMessage.userEmail}.</p. <p>Seu pedido eh ${sqsMessage.itemsQuantity} ${sqsMessage.itemName}. Foi recebido e está sendo processado.</p> <p> Obrigado por comprar conosco! </p>` // Plain text body
    };

    transport.sendMail(emailMessage, (err, info) => {
        if (err) {
            Logger.error(`Service: Emails Service, Action: Error, message: ${err} `)
            console.log(`EmailsSvc | ERROR: ${err}`)
        } else {
            Logger.info(`Service: Emails Service, Action: Successful action, message: ${JSON.stringify(info)} `)
        }
    });
}

// Create our consumer
const app = Consumer.create({
    queueUrl: process.env.AWS_SQS_URL,
    handleMessage: async (message) => {
        sendMail(message);
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    Logger.error(err.message);
});

app.on('processing_error', (err) => {
    Logger.error(err.message);
});

Logger.info('Emails service is running');
app.start();