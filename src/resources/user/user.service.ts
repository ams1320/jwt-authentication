import UserModel from "./user.model";
import token from "@/utils/interfaces/token";

class UserService {

    private user = UserModel;

    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                role
            });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error("couldnt create new user")
        }
    }


    public async login(email: string, password: string): Promise<string | Error> {
        try {
            const user =await this.user.findOne({email});
            console.log(user)
        if(!user){
            throw new Error('there is no user with this email');
        }

        if(await user.isValidPassword(password)){
            return token.createToken(user);
        }else{
            throw new Error('wrong deatails given')
        }
        } catch (error:any) {
            console.log(error.message);
            
         throw new Error("unable to login")   
        }
    }
}

export default UserService;