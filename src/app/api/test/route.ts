import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'OpenAI API key not found in environment variables',
        status: 'error'
      });
    }

    // Try to initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Try a simple OpenAI API call
    try {
      const models = await openai.models.list();
      return NextResponse.json({
        status: 'success',
        message: 'Successfully connected to OpenAI API',
        modelCount: models.data.length,
        firstFewModels: models.data.slice(0, 3).map(m => m.id)
      });
    } catch (apiError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to OpenAI API',
        error: apiError.message,
        hint: 'Check if your API key is valid and has sufficient permissions'
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
} 