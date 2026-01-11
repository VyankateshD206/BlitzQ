import { GoogleGenAI, Type } from "@google/genai";

export const googleGenAIClient = (key: string) => {
    const client = new GoogleGenAI({
        apiKey: key
    })
    return client
}

export type client = ReturnType<typeof googleGenAIClient>


const generatePrompt = (topic: string, difficulty: string) => {
  return `
    You are an AI-powered quiz generator. Your task is to generate high-quality multiple-choice questions (MCQs) based on the topic ${topic.slice(0, 50)} and difficulty level ${difficulty} and return them in JSON format .

    Processing Rules: 
    - Extract the Core Topic: If the user provides an overly detailed topic, focus on the main subject. (e.g., "Computer Networks").
    - Question Structure: Generate exactly 10 MCQs.
    - Options: Each question must have four unique answer choices.
    - Correct Answer: Clearly specify the correct answer and it must be from the options.
    - Explanation: Provide a detailed explanation for why the correct answer is correct.
    - Sub-topic Field: Assign a sub-topic to each question for better categorization.
    - Questions : Per sub-topic, generate 2 questions. Ensure that the sub-topics are relevant to the main topic and difficulty level.
    - Difficulty Level: Ensure the questions match the requested difficulty level.
    - No Code Questions: Do NOT include questions that require or contain code snippets. Keep all questions purely text-based.
    - No Repetition: Ensure diversity in the questions and avoid duplicates.
    - Clarity & Accuracy: Questions should be factually correct, unambiguous, and well-structured.

    
`
}

export const generateQuiz = async (model: string, client: client, topic: string, difficulty: string) => {
  const response = await client.models.generateContent({
    model,
    contents: generatePrompt(topic, difficulty),
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: {
            type: Type.STRING,
            description: 'Core topic extracted from the input',
          },
          difficulty: {
            type: Type.STRING,
            description: 'Difficulty level of the questions',
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: 'The MCQ question text',
                },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                  description: 'Array of 4 answer choices',
                },
                correct_answer: {
                  type: Type.STRING,
                  description: 'The correct answer from the options',
                },
                explanation: {
                  type: Type.STRING,
                  description: 'Explanation of why the correct answer is correct',
                },
                sub_topic: {
                  type: Type.STRING,
                  description: 'Sub-topic under the main topic',
                },
              },
              required: ['question', 'options', 'correct_answer', 'explanation', 'sub_topic'],
            },
          },
        },
        required: ['topic', 'difficulty', 'questions'],
      },
    }
  })
  return response?.text || null
}