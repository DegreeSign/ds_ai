# DegreeSign AI SDK

> **Provider-agnostic TypeScript SDK for any OpenAI-compatible AI endpoint (Grok, DeepSeek and more) — typed JSON extraction with sources, token cost calculation, model discovery and image generation with zero runtime dependencies.**

[![npm version](https://img.shields.io/npm/v/@degreesign/ai.svg)](https://www.npmjs.com/package/@degreesign/ai)
[![npm downloads](https://img.shields.io/npm/dm/@degreesign/ai.svg)](https://www.npmjs.com/package/@degreesign/ai)
[![license](https://img.shields.io/npm/l/@degreesign/ai.svg)](https://github.com/DegreeSign/ds_ai/blob/main/LICENSE)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@degreesign/ai)](https://bundlephobia.com/package/@degreesign/ai)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-types%20included-blue)](https://www.typescriptlang.org/)

> **Beta** — This package is in beta and replaces the deprecated [`@degreesign/grok`](https://www.npmjs.com/package/@degreesign/grok) package. Please migrate to `@degreesign/ai`.

- [Why DegreeSign AI SDK](#why-degreesign-ai-sdk)
- [Install](#install)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [`dsAI`](#dsai)
  - [`dsGenImage`](#dsgenimage)
  - [`fetchModels`](#fetchmodels)
  - [Types](#types)
- [FAQ](#faq)
- [Keywords](#keywords)
- [Contributing](#contributing)
- [License](#license)

## Why DegreeSign AI SDK

- **Any OpenAI-compatible endpoint** — point it at DeepSeek, xAI Grok or any compatible gateway with a `baseURL` and `apiKey`; no vendor lock-in.
- **Typed JSON on demand** — describe the fields you want with `AiPromptObj` and get back a parsed, fully typed object, not a string you have to clean up.
- **Answers with sources** — every JSON response includes a `sources` array of `{ link, pageTitle }` so you can cite where the data came from.
- **Built-in cost tracking** — pass your `pricing` and get a `costUSD` for each call (prompt, cached and completion tokens).
- **Model discovery** — `fetchModels` lists the model ids your endpoint exposes so you always pass a valid `model`.
- **Image generation** — `dsGenImage` turns a plain description into an optimized prompt, then generates the image.
- **Zero dependencies, fully typed** — no runtime dependencies, ships its own TypeScript declarations, and works in Node.js and the browser.
- **Tiny and tree-shakeable** — published browser and Node bundles via webpack with `sideEffects: false`.

The SDK handles request construction, response parsing, typed JSON extraction with sources, token-based cost calculation and image generation. You supply the `apiKey` and `baseURL`; `model` defaults to `deepseek-chat` (override it, or use `fetchModels` to discover what your endpoint offers).

## Install

### npm
```bash
npm install @degreesign/ai
```

### yarn
```bash
yarn add @degreesign/ai
```

### pnpm
```bash
pnpm add @degreesign/ai
```

### CDN (direct web implementation)
Use in browsers through the jsDelivr CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@degreesign/ai@0.0.2/dist/browser/degreesign.min.js"></script>
```
The UMD bundle exposes the library on the `dsAI` global, so call `dsAI.dsAI(...)`, `dsAI.fetchModels(...)` and `dsAI.dsGenImage(...)`.

## Quick Start

### 1. Typed JSON extraction with sources (Node.js)
```ts
import { dsAI } from '@degreesign/ai';

const result = await dsAI<{ randomNumber: number; coinFlip: boolean }>({
    apiKey: `123456789`,
    baseURL: `https://api.deepseek.com`, // or https://api.x.ai/v1/ for Grok
    model: `deepseek-chat`, // optional — defaults to deepseek-chat
    pricing: { prompt: 0.14, cached: 0.014, completion: 0.28 }, // optional — enables costUSD
    responseType: `json`,
    prompt: [
        { dataKeyName: `randomNumber`, type: `number`, requiredData: `a random number value` },
        { dataKeyName: `coinFlip`, type: `boolean`, requiredData: `true or false value` },
    ],
});

if (result.success) {
    console.log(result.response.data);      // { randomNumber, coinFlip }
    console.log(result.response.sources);   // [{ link, pageTitle }]
    console.log(result.costUSD, result.seconds);
}
```

### 2. Image generation
```ts
import { dsGenImage } from '@degreesign/ai';

const image = await dsGenImage({
    apiKey: `123456789`,
    baseURL: `https://api.x.ai/v1/`,
    model: `grok-4-fast`,              // optional — text model, defaults to deepseek-chat
    imageModel: `grok-imagine-image`,  // required — image model
    description: `a red fox in the snow`,
});

console.log(image.prompt);  // the optimized image prompt
console.log(image.url);     // generated image URL (or b64_json)
console.log(image.costUSD);
```

### 3. Discover available models
```ts
import { fetchModels } from '@degreesign/ai';

const models = await fetchModels({
    apiKey: `123456789`,
    baseURL: `https://api.deepseek.com`,
});
// e.g. ["deepseek-chat", "deepseek-reasoner"]
```

## API Reference

The `baseURL` is normalized automatically (a trailing `/` is added if missing, never `//`). Endpoints default to the OpenAI-compatible `chat/completions` (json) and `images/generations` (image).

### `dsAI`

Send a prompt to the endpoint and get back typed JSON or an image.

```ts
dsAI<T>(params: AiInputParams): Promise<AiSuccessResponseText<T> | AiSuccessResponseImage | AiFailedResponse>
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | Bearer token for the endpoint. |
| `baseURL` | `string` | Yes | Base URL of the OpenAI-compatible API; a single trailing `/` is enforced. |
| `model` | `string` | No | Model id. Defaults to `deepseek-chat`. |
| `pricing` | `AiPricing` | No | `{ prompt, cached, completion }` rates per 1,000,000 tokens; when set, `costUSD` is calculated. |
| `responseType` | `"json"` \| `"image"` | Yes | `json` for structured text, `image` for image generation. |
| `prompt` | `AiPromptObj[]` for `json`, `string` for `image` | Yes | Field descriptions for JSON, or the image description string. |
| `format` | `"url"` \| `"b64_json"` | No | Image response format; defaults to `url`. Only for `responseType: "image"`. |

Returns `AiSuccessResponseText<T>`, `AiSuccessResponseImage`, or `AiFailedResponse`. JSON responses are parsed and returned under `response.data` with a `response.sources` array. A JSON call uses `temperature: 0.3`.

### `dsGenImage`

Turn a plain description into an optimized image prompt (using the text `model`), then generate the image (using `imageModel`).

```ts
dsGenImage(params: {
    apiKey: string;
    baseURL: string;
    description: string;
    model?: string;
    imageModel: string;
    pricing?: AiPricing;
}): Promise<{ prompt?: string; url?: string; costUSD?: string }>
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | Bearer token for the endpoint. |
| `baseURL` | `string` | Yes | Base URL of the OpenAI-compatible API. |
| `description` | `string` | Yes | Plain description of the image to generate. |
| `model` | `string` | No | Text model used to build the image prompt. Defaults to `deepseek-chat`. |
| `imageModel` | `string` | Yes | Image model used for generation. |
| `pricing` | `AiPricing` | No | Rates used to calculate the combined `costUSD` of both calls. |

Returns `{ prompt, url, costUSD }`. The `costUSD` is the sum of the text and image calls, and `url` is either the image URL or a base64 payload depending on the response.

### `fetchModels`

List the model ids the endpoint exposes.

```ts
fetchModels(params: { apiKey: string; baseURL: string }): Promise<string[]>
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | Bearer token for the endpoint. |
| `baseURL` | `string` | Yes | Base URL of the OpenAI-compatible API. |

Returns an array of model ids from `GET /models`, or `[]` if the request fails.

### Types

| Type | Description |
| --- | --- |
| `AiPromptObj` | `{ dataKeyName: string; type: "number" \| "boolean" \| "string"; requiredData: string }` — describes one JSON field to extract. |
| `AiInputParams` | Union of the text and image parameter objects accepted by `dsAI`. |
| `AiSuccessResponseText<T>` | `{ success: true; type: "json"; response: { data: T; sources: { link: string; pageTitle: string }[] }; costUSD: string; seconds: string }`. |
| `AiSuccessResponseImage` | `{ success: true; type: "image"; response: string; costUSD: string; seconds: string }`. |
| `AiFailedResponse` | `{ success: false; error: string }`. |
| `AiModelListing` | `{ id: string; object: string; created: number; owned_by: string }`. |
| `AiModelsResponse` | `{ object: "list"; data: AiModelListing[] }`. |

## FAQ

**What is DegreeSign AI SDK?**
A lightweight TypeScript SDK that talks to any OpenAI-compatible AI endpoint. It builds requests, returns typed JSON with sources, calculates token costs and generates images.

**Is it free?**
The SDK is free and open source under the MIT License (`0.0.2` is a beta). You only pay your AI provider for the API calls you make.

**Does it work in Node.js and the browser?**
Yes. It ships a Node bundle (`dist/node/degreesign.node.min.js`) and a UMD browser bundle (`dist/browser/degreesign.min.js`) exposed on the `dsAI` global.

**Does it have any dependencies?**
No runtime dependencies. It uses the platform `fetch` and `performance` APIs, so use a runtime that provides them (Node 18+ or a modern browser).

**Is it written in TypeScript?**
Yes, and TypeScript declarations are included (`dist/index.d.ts`), so all params and responses are fully typed — including the generic `dsAI<T>` result.

**Which providers and frameworks does it support?**
Any provider that speaks the OpenAI-compatible `chat/completions` and `images/generations` APIs, such as DeepSeek and xAI Grok. Because it is framework-agnostic, it works in plain Node, React, Next.js, Vue, Svelte, serverless functions and more.

**How do I know which `model` to use?**
Call `fetchModels` with your `apiKey` and `baseURL` to list the available model ids, then pass one as `model`.

**How is `costUSD` calculated?**
When you pass `pricing` (rates per 1,000,000 tokens for `prompt`, `cached` and `completion`), the SDK applies them to the endpoint's token usage and returns the total cost as a string.

## Keywords

AI SDK, OpenAI-compatible, Grok API, xAI, DeepSeek API, deepseek-chat, LLM, chat completions, structured output, typed JSON extraction, sources, cost calculation, model discovery, image generation, TypeScript, Node.js, browser, zero dependencies.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request at [https://github.com/DegreeSign/ds_ai](https://github.com/DegreeSign/ds_ai).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DegreeSign/ds_ai/blob/main/LICENSE) file for details.
