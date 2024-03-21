const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: 'OPENAI_API_KEY',
});
  
const systemMessage = {
    role: "system",
    content:
        "You are a Askbot. You are supposed to answer the questions asked by the users. Validate the prompts to be a question and it should not in approprite. Give funky responses",
};

const getStreamingCompletion = async ({ userPrompt }) => {
    return client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, { role: "user", content: userPrompt }],
        stream: true,
    });
};

module.exports = getStreamingCompletion;