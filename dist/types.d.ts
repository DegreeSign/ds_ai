interface AiResponseMessageObj {
    /** Role of the message, e.g., "assistant" */
    role: string;
    /** Content of the message, e.g., "..." */
    content: string;
    /** Refusal reason, if any, e.g., null */
    refusal?: string;
}
interface AiResponseChoices {
    /** Index of the choice, e.g., 0 */
    index: number;
    /** Message details for the choice */
    message: AiResponseMessageObj;
    /** Reason the response finished, e.g., "stop" */
    finish_reason: string;
}
interface AiPromptTokensDetails {
    /** Text tokens used, e.g., 702 */
    text_tokens: number;
    /** Audio tokens used, e.g., 0 */
    audio_tokens: number;
    /** Image tokens used, e.g., 0 */
    image_tokens: number;
    /** Cached tokens used, e.g., 679 */
    cached_tokens: number;
}
interface AiCompletionTokensDetails {
    /** Reasoning tokens used, e.g., 136 */
    reasoning_tokens: number;
    /** Audio tokens used, e.g., 0 */
    audio_tokens: number;
    /** Accepted prediction tokens, e.g., 0 */
    accepted_prediction_tokens: number;
    /** Rejected prediction tokens, e.g., 0 */
    rejected_prediction_tokens: number;
}
interface AiResponseUsage {
    /** Number of tokens in the prompt, e.g., 702 */
    prompt_tokens: number;
    /** Number of tokens in the completion, e.g., 47 */
    completion_tokens: number;
    /** Total number of tokens used, e.g., 885 */
    total_tokens: number;
    /** Detailed breakdown of prompt tokens */
    prompt_tokens_details: AiPromptTokensDetails;
    /** Detailed breakdown of completion tokens */
    completion_tokens_details: AiCompletionTokensDetails;
}
interface AiTextResponse {
    /** Unique identifier for the response, e.g., "4da0b8-2f-007" */
    id: string;
    /** Type of the response object, e.g., "chat.completion" */
    object: string;
    /** Unix timestamp of when the response was created, e.g., 1757857163 */
    created: number;
    /** Model used for the response, e.g., "grok-4-fast" */
    model: string;
    /** Array of response choices */
    choices: AiResponseChoices[];
    /** Token usage details */
    usage: AiResponseUsage;
    /** System fingerprint, e.g., "fp_19ea" */
    system_fingerprint: string;
}
type AiResults<T> = {
    error: undefined;
    data: T;
} | {
    error: string;
    code: string;
};
interface AiSuccessResponse {
    success: true;
    costUSD: string;
    seconds: string;
}
interface AiSuccessResponseText<T> extends AiSuccessResponse {
    type: `json`;
    response: AiFullResponse<T>;
}
interface AiSuccessResponseImage extends AiSuccessResponse {
    type: `image`;
    response: string;
}
interface AiFailedResponse {
    success: false;
    error: string;
}
interface AiSource {
    link: string;
    pageTitle: string;
}
interface AiFullResponse<T> {
    data: T;
    sources: AiSource[];
}
type AiResponseTypes = `json` | `image`;
interface AiPromptObj {
    dataKeyName: string;
    type: `number` | `boolean` | `string`;
    requiredData: string;
}
type AiImageRequest = {
    type: `image_url`;
    image_url: {
        url: string;
        detail: string;
    };
} | {
    type: `text`;
    text: string;
};
type AiImageResponse = {
    data: {
        url?: string;
        b64_json?: string;
        revised_prompt: string;
    }[];
};
interface AiPricing {
    prompt: number;
    cached: number;
    completion: number;
}
interface AiReqMessage {
    role: `system` | `user`;
    content: string;
}
type AiImageTypes = `url` | `b64_json`;
interface AiModelListing {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}
type AiModelsResponse = {
    object: `list`;
    data: AiModelListing[];
};
type AiReqObj = {
    model: string;
    prompt: string;
    response_format?: AiImageTypes;
    n: number;
} | {
    model: string;
    messages: AiReqMessage[];
    stream: boolean;
    temperature: number;
};
type AiInputParams = {
    apiKey: string;
    baseURL: string;
    model?: string;
    pricing?: AiPricing;
} & ({
    responseType: `json`;
    prompt: AiPromptObj[];
    format?: undefined;
} | {
    responseType: `image`;
    prompt: string;
    format?: AiImageTypes;
});
export { AiFullResponse, AiTextResponse, AiResponseUsage, AiResults, AiSuccessResponseText, AiSuccessResponseImage, AiFailedResponse, AiSource, AiResponseTypes, AiPromptObj, AiImageRequest, AiImageResponse, AiPricing, AiReqMessage, AiImageTypes, AiReqObj, AiModelListing, AiModelsResponse, AiInputParams, };
