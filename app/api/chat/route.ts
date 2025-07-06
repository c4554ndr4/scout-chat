import { NextRequest, NextResponse } from 'next/server';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const remote = request.headers.get('x-remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real;
  }
  if (remote) {
    return remote;
  }
  
  // Fallback for development
  return '127.0.0.1';
}

// Helper function to estimate tokens (rough estimation)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Usage tracking data structure (in production, use a database)
const usageData: Record<string, {
  totalTokens: number;
  estimatedCost: number;
  requestCount: number;
  lastUsed: Date;
  blocked: boolean;
}> = {};

// Claude pricing (as of 2024)
const CLAUDE_PRICING = {
  INPUT_TOKENS_PER_DOLLAR: 1000000 / 3,  // $3 per 1M input tokens
  OUTPUT_TOKENS_PER_DOLLAR: 1000000 / 15, // $15 per 1M output tokens
};

const USAGE_LIMIT_DOLLARS = 1.0;

function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = inputTokens / CLAUDE_PRICING.INPUT_TOKENS_PER_DOLLAR;
  const outputCost = outputTokens / CLAUDE_PRICING.OUTPUT_TOKENS_PER_DOLLAR;
  return inputCost + outputCost;
}

function checkUsageLimit(ip: string): { allowed: boolean; usage: { totalTokens: number; estimatedCost: number; requestCount: number; lastUsed: Date; blocked: boolean } | null } {
  const record = usageData[ip];
  
  if (!record) {
    return { allowed: true, usage: null };
  }

  // Reset usage if it's been more than 24 hours
  const now = new Date();
  const lastUsed = new Date(record.lastUsed);
  const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastUse > 24) {
    // Reset usage after 24 hours
    usageData[ip] = {
      ...record,
      totalTokens: 0,
      estimatedCost: 0,
      requestCount: 0,
      lastUsed: now,
      blocked: false
    };
    return { allowed: true, usage: usageData[ip] };
  }

  const isBlocked = record.blocked || record.estimatedCost >= USAGE_LIMIT_DOLLARS;
  
  return { 
    allowed: !isBlocked, 
    usage: record 
  };
}

function recordUsage(ip: string, inputTokens: number, outputTokens: number): void {
  const currentRecord = usageData[ip];
  const additionalCost = calculateCost(inputTokens, outputTokens);
  const totalTokens = (currentRecord?.totalTokens || 0) + inputTokens + outputTokens;
  const totalCost = (currentRecord?.estimatedCost || 0) + additionalCost;
  
  usageData[ip] = {
    totalTokens,
    estimatedCost: totalCost,
    requestCount: (currentRecord?.requestCount || 0) + 1,
    lastUsed: new Date(),
    blocked: totalCost >= USAGE_LIMIT_DOLLARS
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured');
    }

    // Get client IP and check usage limits
    const clientIP = getClientIP(request);
    const { allowed, usage } = checkUsageLimit(clientIP);
    
    if (!allowed) {
      return NextResponse.json({ 
        error: 'Usage limit exceeded',
        blocked: true,
        usage: usage 
      }, { status: 429 });
    }

    const { conversationHistory, childAge, files } = await request.json();

    // Build the educational prompt based on age
    const educationalPrompt = `You are an educational assistant designed to help students develop strong thinking skills and epistemic habits. Your goal is to help students understand concepts deeply and think clearly, not to complete assignments for them.

The student's age is: ${childAge}

Age-Specific Approaches:
${childAge <= 10 ? `Elementary School (Ages 5-10):
* Use concrete, hands-on examples: "If we had 10 cookies and ate 3..."
* Focus on basic cause-and-effect: "What do you think will happen if...?"
* Simple evidence gathering: "How could we find out? Let's make a list!"
* Vocabulary: Use simple words, explain new terms with examples
* Critical thinking: "Is that always true? Can you think of a time when it's not?"
* Avoid abstract concepts like "epistemics" - instead say "good thinking"
* Use stories and characters to illustrate logical thinking` : 
childAge <= 13 ? `Middle School (Ages 11-13):
* Introduce hypothesis testing: "What's your guess? How can we check if it's right?"
* Basic probability: "Would you say that's definitely true, probably true, or maybe true?"
* Compare sources: "This book says X, but that website says Y. How do we decide?"
* Vocabulary: Introduce terms like "evidence," "assumption," "conclusion"
* Critical thinking: "What are we assuming here? What if that assumption is wrong?"
* Begin discussing bias in simple terms: "Could there be another explanation?"` :
`High School (Ages 14-18):
* Full probabilistic thinking: "On a scale of 1-10, how confident are you?"
* Identify cognitive biases by name: "That might be confirmation bias - you're only looking for evidence that supports what you already think"
* Complex source evaluation: "Who wrote this? What's their expertise? What's their motivation?"
* Vocabulary: Use terms like "crux," "steel-man," "epistemic humility"
* Critical thinking: "What would falsify this hypothesis?" "What's the strongest counterargument?"
* Meta-cognition: "Notice how your thinking changed there - what made you update?"`}

Keep responses short (2-3 sentences max) and engaging. Always guide through questions rather than giving direct answers. Never complete assignments directly - Guide through questions appropriate to their level.

If the student uploads an image:
* Look at the image carefully and describe what you see relevant to their question
* Use the image content to guide your Socratic questioning
* Help them think through what they observe in the image
* For homework problems in images, guide them through the problem step by step

Remember:
* Only discuss topics appropriate for a school setting
* Keep focus on academic learning and thinking skills
* If asked about inappropriate topics, redirect: "That's not something we should discuss in our learning sessions"`;

    // Prepare messages for Claude API
    const messages = (conversationHistory || []).map((msg: { role: string; content: string }) => {
      // For the last user message, check if there are files to include
      const isLastUserMessage = msg === conversationHistory[conversationHistory.length - 1] && msg.role === 'user';
      
      if (isLastUserMessage && files && files.length > 0) {
        // Include files in the last user message
        const content: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [
          {
            type: 'text',
            text: msg.content
          }
        ];
        
        // Add images to the message
        files.forEach((file: { type: string; data: string; name: string }) => {
          if (file.type.startsWith('image/')) {
            content.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.type,
                data: file.data
              }
            });
          }
        });
        
        return {
          role: msg.role,
          content: content
        };
      }
      
      return {
        role: msg.role,
        content: msg.content
      };
    });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        system: educationalPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    // Record usage after successful response
    const inputTokens = data.usage?.input_tokens || estimateTokens(
      JSON.stringify(messages) + educationalPrompt
    );
    const outputTokens = data.usage?.output_tokens || estimateTokens(aiResponse);
    
    recordUsage(clientIP, inputTokens, outputTokens);

    return NextResponse.json({ 
      response: aiResponse,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCost: calculateCost(inputTokens, outputTokens)
      }
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // Fallback to simulated response if API fails
    return NextResponse.json({ 
      response: "I'm having trouble connecting right now. Can you tell me more about what you're working on? I'd love to help you think through it!"
    });
  }
} 