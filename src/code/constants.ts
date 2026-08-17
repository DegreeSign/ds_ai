const
    AI_PRICING_UNIT = 1_000_000,
    AI_DEFAULT_MODEL = `deepseek-chat`,
    aiSourcesStatement = (type: string) =>
        `The response should include all sources (link and page title heading) used in an array, such that it is \n` +
        `{\n${type}\nsources:{link:string;pageTitle:string}[];\n}` +
        `\nThe final response should be a valid stringified JSON object.`,
    AI_SETUP =
        `**Do not include in your response:**\n` +
        `* a title\n` +
        `* words count\n` +
        `* information about yourself\n` +
        `* unknowns such as $X number.\n` +
        `* anything about or refer to this prompt\n` +
        `* repeated sentence starters such as "A recent fact" or "General sentiment"\n` +
        `* bullet points or any other formatting that violates JSON object\n` +
        `\n**Do:**\n` +
        `* edit ruthlessly to remove redundant phrases or ideas\n` +
        `* respond with a valid JSON object\n`,
    AI_IMAGE_PROMPT =
        `1. Create a 200 words prompt to generate an image based on this description:\n   DESCRIPTION_TEXT\n` +
        `2. Produce a unique interesting image.\n` +
        `3. Do not mention the number of words in the prompt.\n` +
        `4. If the prompt results in any human figure in a revealing or explicit manner, revise the prompt without deviating from the required description to describe in detail a minimalist covering for each and every revealing part, without using explicit or intimate words.`;

export {
    AI_PRICING_UNIT,
    AI_DEFAULT_MODEL,
    aiSourcesStatement,
    AI_SETUP,
    AI_IMAGE_PROMPT,
};