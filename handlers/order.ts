import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import uuidv4 from 'uuid/v4';
import * as AWS from 'aws-sdk';

const stepfunctions = new AWS.StepFunctions();

// @ts-ignore
export const placeOrder: APIGatewayProxyHandler = async (event, _context) => {
    const order = JSON.parse(event.body);
    const transactionId = uuidv4();
    const stateMachineArn = process.env.statemachine_arn;
    const params = {
        stateMachineArn,
        input: JSON.stringify({
            transactionId,
            order
        })
    };
    const {executionArn} = await stepfunctions.startExecution(params).promise();
    return checkStatus(executionArn)
        .then(result => ({
                statusCode: 200,
                body:
                    JSON.stringify({
                        message: 'Your order was placed successfully!',
                        result
                    })
            })
        )
        .catch(error => ({
            statusCode: 500,
            body:
                JSON.stringify({
                    message: 'Failed to place order, but at least we rolled back!',
                    error
                })
        }));
};

const checkStatus = (executionArn) => {
    return new Promise((resolve, reject) => {
        const check = async () => {
            const executionResult = await stepfunctions.describeExecution({executionArn}).promise();
            console.log("Status is : " + executionResult.status);
            switch (executionResult.status) {
                case 'RUNNING' :
                    setTimeout(() => check(), 2000);
                    break;
                case'SUCCEEDED':
                    resolve(executionResult.output);
                    break;
                default: //FAILED, TIMED_OUT, ABORTED
                    reject("Failed to place order.");
            }
        };
        check();
    });
};
