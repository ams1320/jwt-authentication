import { Request, Response, NextFunction } from 'express';
import HttpExeption from '@/utils/exeptions/http.exeption';

function errorMiddelware(
    error: HttpExeption,
    req: Request,
    res: Response,
    next: NextFunction
) : void {
    const status = error.status || 500;
    const message = error.message || "something went wrong";

    res.status(status).send({
        status,
        message
    })
}

export default errorMiddelware;
