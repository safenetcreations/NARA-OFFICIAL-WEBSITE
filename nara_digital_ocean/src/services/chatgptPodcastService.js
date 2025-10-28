import OpenAI from 'openai';

/**
 * ChatGPT-Powered Podcast Script Generator
 * Creates natural, engaging conversations using GPT-4
 */

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please configure it in Admin → AI API Configuration.');
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // For client-side use (consider moving to backend for production)
  });
}

/**
 * Generate intelligent podcast script using ChatGPT
 * @param {string} title - Podcast title
 * @param {string} content - Source content to convert to conversation
 * @param {object} options - Generation options
 * @returns {Promise<string>} - Generated script
 */
export async function generateIntelligentScript(title, content, options = {}) {
  const {
    apiKey,
    style = 'conversational', // conversational, interview, storytelling, debate
    length = 'medium', // short (5min), medium (7-10min), long (15min+)
    casualness = 'high', // low (formal), medium (professional-friendly), high (casual)
    technicalDepth = 'medium', // low (simple), medium (accessible), high (detailed)
    hostName = 'Alex',
    guestName = 'Sam'
  } = options;

  console.log('🤖 Generating intelligent script with ChatGPT...');
  
  try {
    const client = getOpenAIClient(apiKey);

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(style, casualness, technicalDepth, hostName, guestName);
    
    // Build user prompt with content
    const userPrompt = buildUserPrompt(title, content, length);

    console.log('📝 Sending to ChatGPT...');
    
    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: getTemperatureForStyle(style, casualness),
      max_tokens: getMaxTokensForLength(length),
      presence_penalty: 0.6, // Encourage variety
      frequency_penalty: 0.3 // Reduce repetition
    });

    const script = response.choices[0].message.content;
    
    console.log('✅ ChatGPT script generated!');
    console.log(`📊 Tokens used: ${response.usage.total_tokens}`);
    console.log(`💰 Estimated cost: $${(response.usage.total_tokens / 1000 * 0.03).toFixed(4)}`);

    return script;

  } catch (error) {
    console.error('❌ ChatGPT error:', error);
    
    if (error.message?.includes('API key')) {
      throw new Error('Invalid OpenAI API key. Please check your configuration in Admin Panel.');
    } else if (error.message?.includes('rate_limit')) {
      throw new Error('OpenAI rate limit exceeded. Please wait a moment and try again.');
    } else if (error.message?.includes('quota')) {
      throw new Error('OpenAI quota exceeded. Please check your OpenAI account.');
    } else {
      throw new Error(`ChatGPT error: ${error.message}`);
    }
  }
}

/**
 * Build system prompt based on style and parameters
 */
function buildSystemPrompt(style, casualness, technicalDepth, hostName, guestName) {
  const basePrompt = `You are a professional podcast script writer specializing in creating engaging, natural conversations.

**Your Task:** Create a conversation between two people about the given topic.

**Characters:**
- Host: ${hostName} (asks questions, keeps conversation flowing, reacts naturally)
- Guest: ${guestName} (expert, explains topics, shares insights)

**Format Requirements:**
- Use format: "Host: [dialogue]" and "Guest: [dialogue]"
- Each line should be one complete thought
- Include natural reactions: "Wow", "Right?", "Hmm", "Yeah", "I know!"
- Add questions throughout for engagement
- Include pauses for thinking: "Um", "Well", "So"
- Make it sound like REAL people talking, not reading a script

`;

  // Style-specific instructions
  const styleInstructions = {
    conversational: `**Style: Conversational**
- Friendly, relaxed tone
- Back-and-forth dialogue
- Natural interruptions and clarifications
- "So what you're saying is..." type clarifications
- Lots of "Yeah", "Right", "Exactly"`,

    interview: `**Style: Interview**
- Host asks thoughtful questions
- Guest provides detailed answers
- Host occasionally summarizes or asks for clarification
- Professional but warm tone
- "That's fascinating, tell me more about..." style`,

    storytelling: `**Style: Storytelling**
- Guest tells a compelling narrative
- Host reacts with interest and occasional questions
- Build suspense and reveal
- Use descriptive language
- "And then what happened?" style`,

    debate: `**Style: Friendly Debate**
- Present different perspectives
- Respectful disagreement
- "But what about..." counter-arguments
- Find common ground
- "I see your point, but..." style`
  };

  // Casualness level
  const casualnessInstructions = {
    low: `**Tone: Professional & Formal**
- Polished language
- Minimal casual words
- Clear, articulate speech`,

    medium: `**Tone: Professional & Friendly**
- Mix of formal and casual
- Some "Yeah", "Right", "Interesting"
- Accessible but professional`,

    high: `**Tone: Casual & Natural**
- Lots of casual words: "Wow", "Yeah", "Right?", "Hmm"
- Natural speech patterns
- Like friends talking over coffee`
  };

  // Technical depth
  const technicalInstructions = {
    low: `**Complexity: Simple & Accessible**
- Explain everything in simple terms
- Use analogies
- Avoid jargon
- "Think of it like..." explanations`,

    medium: `**Complexity: Accessible with Detail**
- Balance technical and simple language
- Explain complex concepts clearly
- Some terminology with explanations`,

    high: `**Complexity: Detailed & Technical**
- Use proper terminology
- Detailed explanations
- Assume some background knowledge`
  };

  return basePrompt +
    styleInstructions[style] + '\n\n' +
    casualnessInstructions[casualness] + '\n\n' +
    technicalInstructions[technicalDepth] + '\n\n' +
    `**Important:**
- Make it sound NATURAL, not scripted
- Include emotional reactions
- Vary sentence length
- Add thinking pauses
- Make them sound excited about the topic
- NO robotic or report-reading style`;
}

/**
 * Build user prompt with content
 */
function buildUserPrompt(title, content, length) {
  const lengthInstructions = {
    short: 'Keep it concise, around 800-1000 words (5-6 minutes speaking time).',
    medium: 'Make it detailed, around 1200-1500 words (7-10 minutes speaking time).',
    long: 'Make it comprehensive, around 2000-2500 words (15-18 minutes speaking time).'
  };

  return `Create a podcast conversation about: "${title}"

**Source Material:**
${content}

**Length:** ${lengthInstructions[length]}

**Instructions:**
1. Create a natural intro with both people greeting and setting up the topic
2. Break down the content into conversational segments
3. Include questions and reactions throughout
4. Make it engaging and easy to follow
5. End with a natural conclusion and sign-off

Start the conversation now:`;
}

/**
 * Get temperature based on style
 */
function getTemperatureForStyle(style, casualness) {
  const baseTemp = {
    conversational: 0.8,
    interview: 0.7,
    storytelling: 0.9,
    debate: 0.75
  }[style] || 0.8;

  // Adjust for casualness
  const casualnessAdjustment = {
    low: -0.1,
    medium: 0,
    high: 0.1
  }[casualness] || 0;

  return Math.min(1, Math.max(0, baseTemp + casualnessAdjustment));
}

/**
 * Get max tokens based on length
 */
function getMaxTokensForLength(length) {
  return {
    short: 1500,
    medium: 2500,
    long: 4000
  }[length] || 2500;
}

/**
 * Estimate cost for generation
 */
export function estimateCost(contentLength) {
  // GPT-4 Turbo pricing (as of 2024):
  // Input: $0.01 per 1K tokens
  // Output: $0.03 per 1K tokens
  
  const estimatedInputTokens = Math.ceil(contentLength / 3); // rough estimate
  const estimatedOutputTokens = 2000; // average podcast script
  
  const inputCost = (estimatedInputTokens / 1000) * 0.01;
  const outputCost = (estimatedOutputTokens / 1000) * 0.03;
  
  return {
    total: inputCost + outputCost,
    input: inputCost,
    output: outputCost,
    tokens: estimatedInputTokens + estimatedOutputTokens
  };
}

export default {
  generateIntelligentScript,
  estimateCost
};
