import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

const args = process.argv.slice(2);

const configuration = new Configuration({
  apiKey: args[0]
});

const openai = new OpenAIApi(configuration);
// =============
main();
// =============
async function main() {
  for (let i = 0; i < 10; i++) {
    const resp = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You are a program that generates code snippets.
          You generate snippets for the vim code refactoring game.
          Each snippet should have a start and target code as array of strings, where each element of array represents one line of code.
          So, format of each snippet should be: { start: string[], target: string[] }.
          The difference between start and target should be refactorable by using vim hotkeys.
          Output should be an array of snippets and valid JSON format. 
          No other text should be present in output.
          You generate 5 code snippets per request.
          Each snippet should have proper indentation.
          Complexity of each snippet should increase with it's index.
          `
        },
        {
          role: 'user',
          content: `Generate me snippets in Python`
        }
      ]
    });

    const snippets = JSON.parse(resp.data['choices'][0]['message']['content']);
    console.log({ i });
    fs.writeFileSync(
      `./racesData/aisnippets/python/${i}.json`,
      JSON.stringify(snippets, null, 2)
    );
  }
}
