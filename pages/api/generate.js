import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "Chave da API invalida",
      },
    });
    return;
  }

  const palavra = req.body.palavra || "";
  if (palavra.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor digite algo",
      },
    });
    return;
  }

  try {
    /*
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateDescription(animal),
      temperature: 0.6,
    });
    */
    const completion = await generateDescription(palavra)

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

async function generateDescription(parameter) {
  const capitalizedParameter = parameter[0].toUpperCase() + parameter.slice(1).toLowerCase();
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-001",
      prompt: `Em uma frase, descreva uma pequena descrição para:  ${capitalizedParameter}`,
      temperature: 0.4,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(response)
    return response
  } catch (error) {
    alert(error.message);
  }
}
