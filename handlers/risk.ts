import 'source-map-support/register';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export const calculateRisk = async (event, _context) => {
    console.log(event);
    const {transactionId, order} = event;

    const riskValue = order.cost * 3.14;
    const params = {
        TableName: process.env.tableName,
        Item: {
            transactionId: transactionId,
            riskValue: riskValue
        }
    };
    await dynamo.put(params).promise();


    return {
        riskValue: riskValue
    }
};
