import {Router,Request,Response,NextFunction} from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpExeptions from "@/utils/exeptions/http.exeption";
import validationMiddelware from "@/middleware/validation-middelware";
import validate from "@/resources/post/psot.validation";
import PostService from "@/resources/post/post.service";

class PostController implements Controller{
    public path = "/posts";
    public router = Router();
    private PostService= new PostService(); 

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes():void{
        this.router.post(
            `${this.path}`,
            validationMiddelware(validate.create),
            this.create ,
        )
    }

    private create =async(
        req:Request,
        res:Response,
        next:NextFunction,
    ):Promise<Response | void>=>{
        try {
            const {title,body}=req.body;

            const post = await this.PostService.create(title,body);

            res.status(201).json({post});

        } catch (error:any) {
            next(new HttpExeptions(400 ,error.message));
        }
    }
}

export default PostController;