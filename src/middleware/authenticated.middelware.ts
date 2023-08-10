import {Request,Response,NextFunction} from 'express';
import { verifyToken } from '@/utils/interfaces/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpExeption from '@/utils/exeptions/http.exeption';
import jwt from "jsonwebtoken";

async function authenticationMiddelware(
    req:Request,
    res:Response,
    next:NextFunction
)  :Promise<Response |void> {
    const bearer = req.headers.authorization;

    if(!bearer || !bearer.startsWith("Bearer ")){
        return res.status(401).json({error : "unauthorised"})
    }
    const accessToken = bearer.split('Bearer: ')[1].trim();

    try {
        const payload : Token | jwt.JsonWebTokenError = await verifyToken(
            accessToken
        );

        if(payload instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({error:"Unauthorised"})
        }

        const user = await UserModel.findById(payload.id).select('-password').exec()

        if(!user){
            return next(new HttpExeption(401,"Unauthorised"))
        }
        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpExeption(401,"Unauthorised"))
    }
} 
export default authenticationMiddelware;