import { configDotenv } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

configDotenv();

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(messages) {
  try {
    if (!messages || messages.length === 0) {
      throw new Error("No messages provided to AI");
    }

    const formattedMessages = [
      new SystemMessage(
        "You are a helpful AI research assistant. Give clear, accurate and useful answers."
      ),
    ];

    for (const message of messages) {
      if (!message.content || !message.content.trim()) {
        continue;
      }

      if (message.role === "user") {
        formattedMessages.push(
          new HumanMessage(message.content)
        );
      } else if (message.role === "ai") {
        formattedMessages.push(
          new AIMessage(message.content)
        );
      }
    }

    if (formattedMessages.length === 1) {
      throw new Error("No valid message content provided to AI");
    }

    console.log(
      "Sending messages to Gemini:",
      formattedMessages.length
    );

    const response = await geminiModel.invoke(formattedMessages);

    return response.content;
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
}

export async function generateChatTitle(message) {
  try {
    if (!message || !message.trim()) {
      return "New Conversation";
    }

    const response = await geminiModel.invoke([
      new SystemMessage(
        "Generate a short 3-5 word title for the user's message. Return only the title."
      ),
      new HumanMessage(message),
    ]);

    return response.content || "New Conversation";
  } catch (error) {
    console.error("Title generation error:", error);

    return "New Conversation";
  }
}