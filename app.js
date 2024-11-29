const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueURL = "SQS_URL";
const receiveMessages = async () => {
    const params = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
    };

    try {
        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            data.Messages.forEach(message => {
                console.log(message);
                const orderDetails = JSON.parse(message.Body);


                console.log("Pedido processado com sucesso:");
                orderDetails.forEach(item => {
                    console.log(`ID do produto: ${item.id}, Preço: ${item.price}, Quantidade: ${item.quantity}`);
                });

                const deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: message.ReceiptHandle,
                };

                sqs.deleteMessage(deleteParams, (err, data) => {
                    if (err) {
                        console.error("Erro ao excluir a mensagem:", err);
                    } else {
                        console.log("Mensagem excluída com sucesso.");
                    }
                });
            });
        } else {
            console.log("Nenhuma mensagem disponível.");
        }
    } catch (error) {
        console.error("Erro ao processar a mensagem:", error);
    }

};

receiveMessages();
