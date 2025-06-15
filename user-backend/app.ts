import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import createApi, { Request, Response } from "lambda-api";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: 'user-backend' });
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

app.post('/post-check', async (req: Request, res: Response) => {
    const age: number = req.body?.age;
    logger.info('age from request', { age });

    if (!age) {
        return res.status(400).send({ message: 'age is invalid' });
    }

    if (age < 18) {
        return res.status(403).send({ message: 'children are not allowed' })
    }

    res.status(200).send({ message: 'You are eligible for this mess' });
});


export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event, context) => {
    event.pathParameters = event.pathParameters || {};
    event.queryStringParameters = event.queryStringParameters || {};

    return app.run(event, context);
};