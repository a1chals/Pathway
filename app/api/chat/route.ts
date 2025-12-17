import { NextRequest, NextResponse } from 'next/server';
import { parseQuery } from '@/lib/chatbot/queryParser';
import { executeQuery } from '@/lib/chatbot/queryExecutor';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Parse the query
    const parsedQuery = parseQuery(message);
    
    // Execute the query
    const result = await executeQuery(parsedQuery);

    return NextResponse.json({
      parsedQuery,
      result,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process message' },
      { status: 500 }
    );
  }
}

