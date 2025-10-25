/**
 * ChatGPT Image Generation Service
 * Generates photorealistic division imagery using OpenAI's image endpoint.
 */

const OPENAI_IMAGE_URL = 'https://api.openai.com/v1/images/generations';
const DEFAULT_IMAGE_MODEL = 'gpt-image-1';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Set VITE_OPENAI_API_KEY in your env config.');
  }
  return apiKey;
};

const getModel = () => import.meta.env.VITE_OPENAI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;

const buildPrompt = (basePrompt, divisionName = '') => {
  return `Create a photorealistic, 8K-quality documentary photograph for Sri Lanka's National Aquatic Resources Research & Development Agency (NARA).

Division: ${divisionName || 'NARA Division'}
Scene focus: ${basePrompt}

Mandatory requirements:
- Authentic Sri Lankan marine or coastal environment (tropical waters, coconut palms, local infrastructure)
- 3-5 Sri Lankan scientists or fisheries experts (South Asian features, natural skin tones, professional attire with NARA branding)
- At least one female scientist visible collaborating with the team
- Government research aesthetic, National Geographic documentary quality, medium-to-wide shot composition
- Advanced oceanographic equipment with visible NARA insignia, field notebooks, data tablets
- Golden hour or bright tropical daylight, balanced color grading, cinematic depth of field
- No text overlays, no watermarks, no AI distortion artifacts`;
};

export const generateImageWithChatGPT = async (prompt, divisionName) => {
  try {
    const apiKey = getApiKey();
    const response = await fetch(OPENAI_IMAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getModel(),
        prompt: buildPrompt(prompt, divisionName),
        size: '1024x1024',
        response_format: 'b64_json',
        quality: 'high',
        n: 1
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error?.error?.message || `status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const base64 = data?.data?.[0]?.b64_json;

    if (!base64) {
      return { success: false, error: 'ChatGPT returned no image data.' };
    }

    return {
      success: true,
      base64Data: base64,
      mimeType: 'image/png'
    };
  } catch (error) {
    console.error('ChatGPT image generation error:', error);
    return { success: false, error: error.message };
  }
};

export const generateDivisionImagesWithChatGPT = async (prompts = [], divisionName = '') => {
  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (!prompt || prompt.trim() === '') {
      results.push({ success: false, error: 'Empty prompt' });
      continue;
    }

    console.log(`🧠 ChatGPT Image ${i + 1}/${prompts.length}...`);
    const result = await generateImageWithChatGPT(prompt, divisionName);
    results.push(result);

    if (i < prompts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return results;
};

export default {
  generateImageWithChatGPT,
  generateDivisionImagesWithChatGPT
};
