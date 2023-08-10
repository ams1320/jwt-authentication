import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpExeptions from "@/utils/exeptions/http.exeption";
import validationMiddelware from "@/middleware/validation-middelware";
import validate from "@/resources/user/user.validation";
import UserService from "./user.service";
import authenticated from "@/middleware/authenticated.middelware";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes()
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`,
            validationMiddelware(validate.register),
            this.register
        );

        this.router.post(`${this.path}/login`,
            validationMiddelware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticated, this.getUser)
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );

            res.status(201).json({ token })

        } catch (error: any) {
            next(new HttpExeptions(400, error.message))
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            res.status(201).json({ token })
        } catch (error: any) {
            console.log(error)
            next(new HttpExeptions(400, error))
        }
    }

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpExeptions(400, "no logged in user"))
        }
        res.status(201).json({ user: req.user })
    }
}

export default UserController;