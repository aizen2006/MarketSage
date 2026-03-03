import { prisma } from "db";
const API_KEY_LENGTH = 48;
const API_KEY_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export abstract class ApiKeyService {

    static createRandomApiKey(){
        let suffixKey = "";
        
        for(let i = 0; i < API_KEY_LENGTH; i++){
            suffixKey += API_KEY_CHARACTERS.charAt(Math.floor(Math.random() * API_KEY_CHARACTERS.length));
        }
        return `sk-or-v1-${suffixKey}`
    }

    static async createApiKey(userId:string): Promise<{
        id:string,
        apikey:string
    }>{
        const apikey = this.createRandomApiKey();
        const createdApiKey = await prisma.apikeys.create({
            data: {
                key:apikey,
                userId
            }
        })
        return {
            id: createdApiKey.id.toString(),
            apikey
        }
    }

    static async getApiKeys(userId:string): Promise<{
        id:string,
        userId:string,
        apikey:string,
        disabled:boolean
    }[]>{
        const apiKeys = await prisma.apikeys.findMany({
            where:{
                userId
            }
        })
        return apiKeys.map((apiKey) => ({
            id: apiKey.id.toString(),
            userId: apiKey.userId,
            apikey: apiKey.key,
            disabled: apiKey.disabled
        }))
    }
    static async updateApiKey(apiKeyId:string , userId:string , disabled:boolean): Promise<void>{
        if(disabled){
            await prisma.apikeys.update({
                where:{
                    id:apiKeyId,
                    userId:userId
                },
                data:{
                    disabled: false 
                }
            })
        }else{
            await prisma.apikeys.update({
                where:{
                    id:apiKeyId,
                    userId:userId
                },
                data:{
                    disabled: true 
                }
            })
        }
        
    }
}
