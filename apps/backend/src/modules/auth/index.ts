import { Cookie, Elysia } from "elysia";
import { AuthModel } from './model';
import { AuthService } from './service';
import { jwt } from "@elysiajs/jwt";

export const app = new Elysia({prefix: "/auth"})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET! 
        })
    )
    .post("/signup", async ({ body , status }) => {
        try {
            const userId = await AuthService.signUp(body.email, body.password)
            return {
                id:userId,
                status:200
            }
        } catch(e: any){
            throw status(400, {
                message:'Error while signing up'
            })
        }
    },{
        body: AuthModel.signUpSchema,
        response:{
            200: AuthModel.signUpResponseSchema,
			400: AuthModel.signUpInvalidSchema
        }
    })
    .post("/signin",async({jwt , body , status , cookie:{ auth }})=>{
        const { correctCredentials , userId } = await AuthService.signIn(body.email, body.password);
        if(!correctCredentials || !userId){
            throw status(403, {
                message:"Invalid credentials"
            })
        }
        const token = await jwt.sign({ userId })
        if(!auth){
            auth = new Cookie("auth",{});
        }
        auth.set({
            value:token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,

        })
        return {
            message:"SignIn successful"
        }
    },{
        body: AuthModel.signInSchema,
        response:{
            200: AuthModel.signInResponseSchema,
			403: AuthModel.signInFailedSchema
        }
    })