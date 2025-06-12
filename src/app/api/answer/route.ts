import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Add debugging to check if API key is being loaded
console.log("API Route loaded. API Key exists:", !!process.env.OPENAI_API_KEY);
console.log("API Key length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    console.log("Received question:", question);

    if (!question || question.trim() === '') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // More detailed logging about API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log("No valid API key found, returning simulated response");
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          answer: `This is a simulated response since the OpenAI API key is not configured. In a production environment, this would be an AI-generated answer to: "${question}"`
        },
        { status: 200 }
      );
    }

    console.log("Attempting to call OpenAI API...");
    
    try {
      // Call OpenAI API to get the answer
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides accurate answers to questions. Be concise but thorough."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Extract the answer from the response
      const answer = response.choices[0].message.content;
      console.log("Received answer from OpenAI:", answer.substring(0, 50) + "...");
      
      return NextResponse.json({ answer }, { status: 200 });
    } catch (openaiError: any) {
      console.error("OpenAI API Error:", openaiError.message);
      
      // Check if it's an authentication error
      if (openaiError.message && openaiError.message.includes("auth")) {
        return NextResponse.json({ 
          error: "API key authentication failed", 
          answer: "Unable to generate answer: The OpenAI API key appears to be invalid or has expired. Please check your API key and try again."
        }, { status: 200 });
      }
      
      throw openaiError; // Re-throw for general error handling
    }
  } catch (error: any) {
    console.error('Error processing question:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to process question', 
        details: error.message,
        answer: `There was an error connecting to the AI service: ${error.message}. Please try again later.` 
      },
      { status: 200 } // Return 200 so the error shows in the UI
    );
  }
} 