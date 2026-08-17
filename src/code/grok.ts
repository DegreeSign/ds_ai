import {
    AiTextResponse,
    AiResponseUsage,
    AiResults,
    AiSuccessResponseText,
    AiSuccessResponseImage,
    AiPromptObj,
    AiImageResponse,
    AiFailedResponse,
    AiFullResponse,
    AiInputParams,
    AiReqObj,
    AiPricing,
    AiModelsResponse,
} from "../types";
import {
    AI_PRICING_UNIT,
    AI_DEFAULT_MODEL,
    AI_SETUP,
    aiSourcesStatement,
} from "./constants";

const
    aiRequest = (
        prompt: AiPromptObj[],
    ) =>
        `The JSON response object should follow this TS interface. \n` +
        `interface ResponseType {\n` +
        prompt.map(t => `${t.dataKeyName}: ${t.type}; // ${t.requiredData}\n`) +
        `};\n` +
        aiSourcesStatement(`data:ResponseType;`),
    /** ensure baseURL ends with a single `/` (no trailing `//`) */
    normalizeBaseURL = (baseURL: string): string =>
        baseURL?.replace(/\/+$/, ``) + `/`,
    /** fetch available model ids from the endpoint's `GET /models` */
    fetchModels = async ({
        apiKey,
        baseURL,
    }: {
        apiKey: string;
        baseURL: string;
    }): Promise<string[]> => {
        try {
            const
                response = await fetch(`${normalizeBaseURL(baseURL)}models`, {
                    method: `GET`,
                    headers: {
                        'Content-Type': `application/json`,
                        Authorization: `Bearer ${apiKey}`,
                    },
                }),
                data = await response?.json() as AiModelsResponse | undefined;
            return data?.data?.map(model => model.id) || [];
        } catch (e) {
            console.log(`fetchModels failed`, e);
        };
        return [];
    },
    calculateCost = ({
        usage,
        pricing
    }: {
        usage: AiResponseUsage;
        pricing?: AiPricing
    }): number | undefined => {
        try {
            if (!pricing)
                return undefined;
            const
                {
                    prompt_tokens: prompt,
                    prompt_tokens_details: { cached_tokens: cached } = { cached_tokens: 0 },
                    total_tokens: total,
                } = usage || {},
                completion = (total || 0) - (prompt || 0),
                promptCost = (prompt || 0) * pricing.prompt,
                cachedCost = (cached || 0) * pricing.cached,
                completionCost = (completion || 0) * pricing.completion;
            return (
                promptCost +
                cachedCost +
                completionCost
            ) / AI_PRICING_UNIT
        } catch (e) {
            console.log(`calculateCost failed`, e);
        };
    },
    failResponse = (error: string): AiFailedResponse => ({
        success: false,
        error,
    }),
    /** AI Text / Image */
    dsAI = async <T>({
        apiKey,
        baseURL,
        responseType,
        prompt,
        model = AI_DEFAULT_MODEL,
        format,
        pricing,
    }: AiInputParams): Promise<
        AiSuccessResponseText<T>
        | AiSuccessResponseImage
        | AiFailedResponse
    > => {
        try {
            const
                isImage = responseType == `image` && typeof prompt == `string`,
                isJSON = responseType == `json` && typeof prompt != `string`,
                endpoint = isImage ? `images/generations` : `chat/completions`,
                reqURI = `${normalizeBaseURL(baseURL)}${endpoint}`,
                start = performance.now(),
                reqData: AiReqObj | undefined = isImage ? {
                    model,
                    prompt: prompt as string,
                    response_format: format || `url`,
                    n: 1,
                } : isJSON ? {
                    messages: [{
                        role: `system`,
                        content: AI_SETUP
                    }, {
                        role: `user`,
                        content: aiRequest(prompt as AiPromptObj[])
                    }],
                    model,
                    stream: false,
                    temperature: responseType == `json` ? 0.3 : 0.7,
                } : undefined,
                response = !apiKey || !reqData ? undefined
                    : await fetch(reqURI, {
                        method: `POST`,
                        headers: {
                            'Content-Type': `application/json`,
                            Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify(reqData),
                    }),
                data = await response?.json(),
                res: AiResults<AiTextResponse | AiImageResponse> = data?.error ? {
                    code: data?.code,
                    error: data?.error
                } : {
                    data,
                    error: undefined,
                };
            let
                costUSD = `0`,
                resultTextJSON: AiFullResponse<T> = undefined as any,
                resultImage: string = ``;
            if (res?.error != undefined) {
                console.log(`aiData error`, res?.error);
                return failResponse(res?.error);
            } else {
                if (!res?.data)
                    return failResponse(``);

                if (`choices` in res?.data) {
                    costUSD = calculateCost({ usage: res?.data?.usage, pricing })?.toFixed(4) || `0`;
                    const responseStr = res?.data?.choices?.[0]?.message?.content;
                    resultTextJSON = JSON.parse(responseStr);
                } else if (isImage) {
                    const imageData = res?.data?.data?.[0];
                    resultImage = imageData?.url
                        || imageData?.b64_json
                        || ``;
                } else console.log(`aiData issue`, res);
            };
            return {
                success: true,
                costUSD,
                seconds: ((performance.now() - start) / 1_000, 2).toFixed(2),
                ...isImage ? {
                    type: `image`,
                    response: resultImage,
                } : {
                    type: `json`,
                    response: resultTextJSON,
                },
            };
        } catch (e) {
            console.log(`aiData failed`, e);
        };
        return failResponse(``);
    };

export {
    AiInputParams,
    dsAI,
    fetchModels,
};