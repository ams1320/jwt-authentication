import { cleanEnv, port, str } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        PORT :port({default:3000}),
        MONGO_PATH : str(),
        JWT_SECRET : str(),
    })
}

export default validateEnv;