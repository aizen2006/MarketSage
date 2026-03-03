import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./model";

export const app = new Elysia({prefix : "/apikeys"})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET! 
        })
    )
    .resolve(async({cookie:{ auth }, status , jwt}) => {
        if(!auth){
            return status(401)
        }
        const decoded = await jwt.verify(auth.value as string);
        if (!decoded || !decoded.userId){
            return status(401)
        }

        return {
            userId:decoded.userId as number
        }

    })
    .post("/create",async ({ status , userId }) => {
        const { id, apikey } = await ApiKeyService.createApiKey(String(userId));
        if(!id || !apikey){
            return status(401, {
                message: "Error while creating api key"
            })
        }
        return status(200, {
            id,
            userId: String(userId),
            apikey,
            disabled: false
        })
    },{
        response:{
            200: ApiKeyModel.createApiKeyResponse,
            401: ApiKeyModel.createApiKeyInvalidSchema
        }
    })
    .get("/" ,async({userId , status })=>{
        const apiKeys = await ApiKeyService.getApiKeys(String(userId));
        if(!apiKeys){
            return status(404, {
                message: "No api keys found"
            })
        }
        return status(200,{
            apiKeys: apiKeys
        })
    },{
        response:{
            200: ApiKeyModel.getApiKeyResponse,
            404: ApiKeyModel.getApiKeysNotFoundSchema
        }
    })
    .put("/",async ({body , status , userId })=>{
        try{
            await ApiKeyService.updateApiKey( body.apiKeyId , String(userId) , body.disabled );
            return status(200, {
                message: "Api key has been Updated successfully"
            })
        }catch(e){
            return status(411,{
                message:"Error while updating api key"
            })
        }
    },{
        body: ApiKeyModel.updateApiKeySchema,
        response:{
            200: ApiKeyModel.updateApiKeyResponse,
            411: ApiKeyModel.updateApiKeyInvalidSchema
        }
    })