import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    hasApiKey: !!process.env.CLAUDE_API_KEY,
    keyLength: process.env.CLAUDE_API_KEY?.length || 0,
    keyPrefix: process.env.CLAUDE_API_KEY?.substring(0, 10) || 'none'
  });
} 