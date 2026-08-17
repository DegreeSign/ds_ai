# DegreeSign AI SDK
> **Beta** — This package is in beta and replaces the deprecated [`@degreesign/grok`](https://www.npmjs.com/package/@degreesign/grok) package. Please migrate to `@degreesign/ai`.

A lightweight TypeScript package for accessing any OpenAI-compatible AI endpoint (Grok, DeepSeek, and more). You supply the `apiKey` and `baseURL` — the SDK handles request construction, typed JSON extraction with sources, cost calculation, and image generation. `model` defaults to `deepseek-chat` (override it, or use `fetchModels` to discover what's available on your endpoint).

## Setup

Install the package

### npm
```bash
npm install @degreesign/ai
```

### yarn
```bash
yarn add @degreesign/ai
```

## Usage

### CDN (direct web implementation)
Use in browsers through CDN
```html
<script 
    src="https://cdn.jsdelivr.net/npm/@degreesign/ai@0.0.1/dist/browser/degreesign.min.js"
></script>
```
Note `dsAI` is the browser global object for this library functions.

### Node.js
Import the functions from the `@degreesign/ai` package in your TypeScript or JavaScript project:
```ts
import { dsAI } from '@degreesign/ai';

dsAI({
    apiKey: `123456789`,
    baseURL: `https://api.deepseek.com`, // or https://api.x.ai/v1/ for Grok
    model: `deepseek-chat`, // optional — defaults to deepseek-chat
    pricing: { prompt: 0.14, cached: 0.014, completion: 0.28 }, // optional — enables costUSD
    responseType: `json`,
    prompt: [{
        dataKeyName: `randomNumber`,
        type: `number`,
        requiredData: `a random number value`,
    },{
        dataKeyName: `coinFlip`,
        type: `boolean`,
        requiredData: `true or false value`,
    }],
});
```
The `baseURL` is normalized automatically (a trailing `/` is added if missing, never `//`). Endpoints default to the OpenAI-compatible `chat/completions` (json) and `images/generations` (image).

### Discover available models
Use `fetchModels` to list the model ids your endpoint provides, then pass the one you want to `dsAI`:
```ts
import { fetchModels } from '@degreesign/ai';

const models = await fetchModels({
    apiKey: `123456789`,
    baseURL: `https://api.deepseek.com`,
});
// e.g. ["deepseek-chat", "deepseek-reasoner"]
```

### Image generation
```ts
import { dsGenImage } from '@degreesign/ai';

dsGenImage({
    apiKey: `123456789`,
    baseURL: `https://api.x.ai/v1/`,
    model: `grok-4-fast`,        // optional — text model, defaults to deepseek-chat
    imageModel: `grok-imagine-image`, // required — image model
    description: `a red fox in the snow`,
});
```

Below are the available functions and their usage examples.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request at [https://github.com/DegreeSign/ds_ai](https://github.com/DegreeSign/ds_ai).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DegreeSign/ds_ai/blob/main/LICENSE) file for details.