import 'source-map-support/register';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export const rollback = async (event, _context) => {
    console.log(event);
    const {transactionId} = event;
    const params = {
        TableName: process.env.tableName,
        Key: {
            transactionId: transactionId
        }
    };

    await dynamo.delete(params).promise();

    return {
        riskRollbackComplete: transactionId
    }
};
