import { NextRequest, NextResponse } from 'next/server';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured');
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
        const content: Array<{ type: string; text?: string; source?: any }> = [
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

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // Fallback to simulated response if API fails
    return NextResponse.json({ 
      response: "I'm having trouble connecting right now. Can you tell me more about what you're working on? I'd love to help you think through it!"
    });
  }
} 