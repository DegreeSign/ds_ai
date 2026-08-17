import { AiSuccessResponseText, AiSuccessResponseImage, AiFailedResponse, AiInputParams } from "../types";
declare const 
/** fetch available model ids from the endpoint's `GET /models` */
fetchModels: ({ apiKey, baseURL, }: {
    apiKey: string;
    baseURL: string;
}) => Promise<string[]>, 
/** AI Text / Image */
dsAI: <T>({ apiKey, baseURL, responseType, prompt, model, format, pricing, }: AiInputParams) => Promise<AiSuccessResponseText<T> | AiSuccessResponseImage | AiFailedResponse>;
export { AiInputParams, dsAI, fetchModels, };
