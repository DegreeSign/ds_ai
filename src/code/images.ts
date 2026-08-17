// import ffmpegStatic from 'ffmpeg-static';
// import ffmpegObj from 'fluent-ffmpeg';
import { dsAI } from './grok';
import { AiSuccessResponseText, AiPricing } from '../types';
import { AI_DEFAULT_MODEL, AI_IMAGE_PROMPT } from './constants';

const
    // getFFMPEG = () => {
    //     if (ffmpegStatic)
    //         ffmpegObj.setFfmpegPath(ffmpegStatic);
    //     return ffmpegObj
    // },
    // ffmpeg = getFFMPEG(),
    // getImageData = async ({
    //     path,
    // }: {
    //     path: string;
    // }): Promise<string> => {
    //     try {
    //         let buffer: Buffer;

    //         // online images
    //         if (path?.includes('http')) {
    //             const response = await fetch(path);
    //             buffer = Buffer.from(await response.arrayBuffer());


    //             // local images
    //         } else {
    //             buffer = await new Promise<Buffer>((resolve, reject) => {
    //                 ffmpeg(path)
    //                     .outputFormat('jpg')
    //                     .toFormat('jpg')
    //                     .pipe()
    //                     .on('data', (chunk: Buffer) => resolve(chunk))
    //                     .on('error', reject);
    //             });
    //         };

    //         // Convert buffer to base64
    //         const base64_image = buffer.toString('base64');
    //         return `data:image/jpeg;base64,${base64_image}`;
    //     } catch (e) {
    //         console.log(`imageData failed`, e);
    //         return ``
    //     };
    // },
    // grokImageProcessing = async ({
    //     description,
    //     imagesPath,
    // }: {
    //     description: string,
    //     imagesPath: string[]
    // }): Promise<AiImageRequest[]> => {
    //     try {
    //         const imagesData: AiImageRequest[] = [];
    //         for (let i = 0; i < imagesPath.length; i++)
    //             imagesData.push({
    //                 type: `image_url`,
    //                 image_url: {
    //                     url: await getImageData({ path: imagesPath[i] }),
    //                     detail: "high",
    //                 }
    //             });
    //         return [
    //             ...imagesData,
    //             {
    //                 type: `text`,
    //                 text: description,
    //             }
    //         ];
    //     } catch (e) {
    //         console.log(`grokImages failed`, e);
    //         return []
    //     };
    // },
    dsGenImage = async ({
        apiKey,
        baseURL,
        description,
        model = AI_DEFAULT_MODEL,
        imageModel,
        pricing,
    }: {
        apiKey: string;
        baseURL: string;
        description: string;
        model?: string;
        imageModel: string;
        pricing?: AiPricing;
    }): Promise<{
        prompt?: string;
        url?: string;
        costUSD?: string;
    }> => {
        try {
            const
                text = await dsAI<{
                    imagePrompt: string;
                }>({
                    apiKey,
                    baseURL,
                    model,
                    pricing,
                    responseType: `json`,
                    prompt: [{
                        dataKeyName: `imagePrompt`,
                        type: `string`,
                        requiredData: AI_IMAGE_PROMPT
                            .replace(`DESCRIPTION_TEXT`, description),
                    }],
                }) as AiSuccessResponseText<{
                    imagePrompt: string;
                }>,
                prompt = text?.success ? text.response?.data?.imagePrompt : ``,
                imageResults = !prompt ? undefined : await dsAI<string>({
                    apiKey,
                    baseURL,
                    model: imageModel,
                    pricing,
                    responseType: `image`,
                    prompt: prompt
                }),
                costUSD = (
                    (text?.success ? +text.costUSD : 0)
                    + (imageResults?.success ? +imageResults.costUSD : 0)
                ).toFixed(4);
            return {
                prompt,
                url: imageResults?.success && imageResults?.type == `image` ?
                    imageResults?.response
                    : undefined,
                costUSD,
            };
        } catch (e) {
            console.log(`dsGenImage failed`, e);
        };
        return {}
    };

export {
    dsGenImage,
};