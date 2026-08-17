import { AiPricing } from '../types';
declare const dsGenImage: ({ apiKey, baseURL, description, model, imageModel, pricing, }: {
    apiKey: string;
    baseURL: string;
    description: string;
    model?: string;
    imageModel: string;
    pricing?: AiPricing;
}) => Promise<{
    prompt?: string;
    url?: string;
    costUSD?: string;
}>;
export { dsGenImage, };
