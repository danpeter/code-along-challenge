import 'source-map-support/register';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export const reserveOrder = async (event, _context) => {
    console.log(event);
    const {transactionId, order} = event;

    sometimesBreak();

    //TODO: Check item is in inventory ....
    const params = {
        TableName: process.env.tableName,
        Item: {
            transactionId: transactionId,
            order
        }
    };
    await dynamo.put(params).promise();

    return {
        orderReserved: transactionId
    };
};

function sometimesBreak() {
    if (Math.floor(Math.random() * 2) == 1) {
        throw new Error("Failed to align pylons!")
    }
}
