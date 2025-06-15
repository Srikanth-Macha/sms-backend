import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import createApi, { Request, Response } from "lambda-api";

const app = createApi();
let globalEvent: APIGatewayProxyEventV2;

// Global Exception Filter
app.use((err, req, res, next) => {
    // Use Error specific handling
    console.error(err);
    res.send({ status: 500, message: 'Internal server error' });

    if (next) next();
});

app.get('/default', (_req: Request, res: Response) => {
    res.send({ message: 'server is healthy and running' });
});

app.post('/post-check', (req: Request, res: Response) => {
    const age: number = req.body?.age;

    console.log('request version is ', req?.version);
    console.log('whole event is ', globalEvent);

    const { app, ...print } = req;
    res.status(201).send(JSON.stringify(print));
});


export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event, context) => {
    event.pathParameters = event.pathParameters || {};
    event.queryStringParameters = event.queryStringParameters || {};

    globalEvent = event;
    return app.run(event, context);
};