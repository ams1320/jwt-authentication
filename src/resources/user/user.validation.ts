import joi from "joi";

const register = joi.object({
    name:joi.string().required().max(20),
    email : joi.string().email().required(),
    password:joi.string().min(6).required(),
});

const login = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
});

export default {register,login};