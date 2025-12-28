// import OpenAI from "openai"
// import { ChatCompletionMessageParam } from "openai/resources.mjs"


// export const openAIClient = (key: string) => {
//     const client = new OpenAI({
//         apiKey: key,
//         baseURL: "https://api.groq.com/openai/v1"
//     })

//     return client
// }

// export type client = ReturnType<typeof openAIClient>

// const systemPrompt = `
//     You are an AI-powered quiz generator. Your task is to generate high-quality multiple-choice questions (MCQs) based on a given topic and difficulty level and return them in JSON format .
    
//     Input Format: 
//     The user will provide a json object with:
//     - topic: string (A subject or concept (may sometimes be overly detailed). Extract the core topic from it if necessary.)
//     - difficulty: string (easy, medium, hard, mix)
//     Input Example: 
//     {
//         "topic": "Fundamentals of Computer Networks, including TCP/IP, OSI Model, and Routing Mechanisms",
//         "difficulty": "medium"
//     }

//     Processing Rules: 
//     - Extract the Core Topic: If the user provides an overly detailed topic, focus on the main subject. (e.g., "Computer Networks").
//     - Question Structure: Generate exactly 10 MCQs.
//     - Options: Each question must have four unique answer choices.
//     - Correct Answer: Clearly specify the correct answer.
//     - Explanation: Provide a detailed explanation for why the correct answer is correct.
//     - Sub-topic Field: Assign a sub-topic to each question for better categorization.
//     - Questions : Per sub-topic, generate 2 questions. Ensure that the sub-topics are relevant to the main topic and difficulty level.
//     - Difficulty Level: Ensure the questions match the requested difficulty level.
//     - No Code Questions: Do NOT include questions that require or contain code snippets. Keep all questions purely text-based.
//     - No Repetition: Ensure diversity in the questions and avoid duplicates.
//     - Clarity & Accuracy: Questions should be factually correct, unambiguous, and well-structured.

//     Output Format:
//     The output should be a raw json object with:
//     - topic: string
//     - difficulty: string
//     - questions: array of objects
//     Output Example:
//     {
//   "topic": "Computer Networks",
//   "difficulty": "medium",
//   "questions": [
//     {
//       "question": "What is the main function of a router in a network?",
//       "options": [
//         "To forward data packets between networks",
//         "To store website data for faster access",
//         "To regulate power supply to network devices",
//         "To encrypt data for secure transmission"
//       ],
//       "correct_answer": "To forward data packets between networks",
//       "explanation": "Routers operate at the network layer and determine the optimal path for forwarding data between different networks.",
//       "sub_topic": "Networking Devices"
//     },
//     {
//       "question": "Which layer of the OSI model is responsible for end-to-end communication?",
//       "options": [
//         "Application Layer",
//         "Transport Layer",
//         "Network Layer",
//         "Data Link Layer"
//       ],
//       "correct_answer": "Transport Layer",
//       "explanation": "The Transport Layer ensures reliable data transfer through protocols like TCP and UDP.",
//       "sub_topic": "OSI Model"
//     }
//   ]
// }

// `

// export const generateQuiz = async (model:string, client: client, topic: string, difficulty: string) => {
//     const userMessage : ChatCompletionMessageParam = {
//         "role": "user",
//         "content": JSON.stringify({ topic, difficulty })
//     }

//     const chatMessages : ChatCompletionMessageParam[] = [
//         {
//             "role": "system",
//             "content": systemPrompt
//         }
//     ]
//     chatMessages.push(userMessage)

//     const completion = await client.chat.completions.create({
//         model,
//         messages: chatMessages,
//         // response_format: {
//         //     type: "json_object"  
//         // },
//     })

//     return completion?.choices[0]?.message.content || null
// }

import { GoogleGenAI, Type } from "@google/genai";

export const googleGenAIClient = (key: string) => {
    const client = new GoogleGenAI({
        apiKey: key
    })
    return client
}

export type client = ReturnType<typeof googleGenAIClient>

// const systemPrompt = 

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