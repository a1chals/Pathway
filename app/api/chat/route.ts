import { NextRequest, NextResponse } from 'next/server';
import { parseQuery } from '@/lib/chatbot/queryParser';
import { executeQuery } from '@/lib/chatbot/supabaseQueries';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Step 1: Parse the natural language query
    const parsedQuery = parseQuery(message);
    console.log('[Chat] Parsed query:', parsedQuery.type, parsedQuery.companies);
    
    // Step 2: Execute against Supabase (NO API CALLS!)
    const result = await executeQuery(parsedQuery);
    console.log('[Chat] Result:', result.success, result.type, result.data.totalCount);

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

