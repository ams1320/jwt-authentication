import express ,{Application} from "express";
import mongoose from "mongoose";
import compression from"compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import  Controller from "@/utils/interfaces/controller.interface";
import ErrorMiddelware from "@/middleware/error-middelware";

class App{
    public express:Application;
    public port:number;

    constructor(controllers:Controller[],port:number){
        this.express =express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddelware();
        this.initialiseController(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddelware():void{
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended:false}));
        this.express.use(helmet());
        this.express.use(morgan('dev'));
        this.express.use(cors());
        this.express.use(compression());

    }

    private initialiseController(controllers :Controller[]):void{
        controllers.forEach((controller:Controller)=>{
            this.express.use("/api",controller.router)
        })
    }

    private initialiseErrorHandling():void{
        this.express.use(ErrorMiddelware);
    }

    private initialiseDatabaseConnection():void{
        const{MONGO_PATH} = process.env;
        mongoose.connect(`${MONGO_PATH}`)
        .then(()=>console.log("connected to database"))
        .catch((error)=>console.log(error.message))
    }

    public listen():void{
        this.express.listen(this.port,()=>{
            console.log(`app listening on port ${this.port}`)
        })
    }
}

export default App;