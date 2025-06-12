import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Create an object with debug information
  // Be careful not to expose the actual API keys
  const debugInfo = {
    environment: process.env.NODE_ENV || 'unknown',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    openAIKeyStartsWith: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'none',
    hasOCRKey: !!process.env.OCR_API_KEY,
    serverTime: new Date().toISOString(),
    nextJs: process.versions ? process.versions.node : 'unknown',
  };

  // Return the debug information
  return NextResponse.json(debugInfo);
} 