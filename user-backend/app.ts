import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import createApi, { Request, Response } from "lambda-api";

const app = createApi();

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
    const jsonArray = [];

    for (let index = 0; index < age; index++) {
        jsonArray.push({ message: `Use age is ${index}` });
    }

    res.status(201).send(jsonArray);
});


export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event, context) => {
    event.pathParameters = event.pathParameters || {};
    event.queryStringParameters = event.queryStringParameters || {};

    return app.run(event, context);
};