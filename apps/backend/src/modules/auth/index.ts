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
                id: userId,
                status: 200
            }
        } catch (e: unknown) {
            const prismaCode = e && typeof e === 'object' && 'code' in e ? (e as { code: string }).code : null
            if (prismaCode === 'P1001' || prismaCode === 'P1002' || prismaCode === 'P1017') {
                throw status(503, { message: 'Database unavailable. Please try again later.' })
            }
            if (prismaCode === 'P2002') {
                throw status(400, { message: 'Email already registered.' })
            }
            throw status(400, { message: 'Error while signing up' })
        }
    },{
        body: AuthModel.signUpSchema,
        response:{
            200: AuthModel.signUpResponseSchema,
            400: AuthModel.signUpInvalidSchema,
            503: AuthModel.signUpServiceUnavailableSchema
        }
    })
    .post("/signin", async ({ jwt, body, status, cookie: { auth } }) => {
        try {
            const { correctCredentials, userId } = await AuthService.signIn(body.email, body.password)
            if (!correctCredentials || !userId) {
                throw status(403, { message: "Invalid credentials" })
            }
            const token = await jwt.sign({ userId })
            if (!auth) {
                auth = new Cookie("auth", {})
            }
            auth.set({
                value: token,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
				sameSite: "none",
				secure: true,
            })
            return { message: "SignIn successful" }
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'status' in e) throw e
            const prismaCode = e && typeof e === 'object' && 'code' in e ? (e as { code: string }).code : null
            if (prismaCode === 'P1001' || prismaCode === 'P1002' || prismaCode === 'P1017') {
                throw status(503, { message: "Database unavailable. Please try again later." })
            }
            throw e
        }
    },{
        body: AuthModel.signInSchema,
        response:{
            200: AuthModel.signInResponseSchema,
            403: AuthModel.signInFailedSchema,
            503: AuthModel.signUpServiceUnavailableSchema
        }
    })