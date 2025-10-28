/**
 * AWS Polly Podcast Service
 * Generates NotebookLM-style conversational podcasts using AWS Polly
 */

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

// Get AWS credentials from Firebase config
async function getAWSCredentials() {
  const docRef = doc(db, 'admin_config', 'ai_api_keys');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || !docSnap.data().aws?.enabled) {
    throw new Error('AWS Polly is not configured. Please configure in Admin → AI API Configuration');
  }

  const awsConfig = docSnap.data().aws;

  return {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region || 'us-east-1'
  };
}

// Create AWS Polly client
async function createPollyClient() {
  const credentials = await getAWSCredentials();

  return new PollyClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    }
  });
}

// NotebookLM-style voices (conversational pair)
const CONVERSATION_VOICES = {
  host: {
    voice: 'Joanna',    // Female, professional, warm
    engine: 'neural'
  },
  guest: {
    voice: 'Matthew',   // Male, professional, friendly
    engine: 'neural'
  }
};

// Alternative voice pairs
const VOICE_PAIRS = {
  professional: {
    host: { voice: 'Joanna', engine: 'neural' },
    guest: { voice: 'Matthew', engine: 'neural' }
  },
  friendly: {
    host: { voice: 'Kendra', engine: 'neural' },
    guest: { voice: 'Joey', engine: 'neural' }
  },
  british: {
    host: { voice: 'Amy', engine: 'neural' },
    guest: { voice: 'Brian', engine: 'neural' }
  },
  australian: {
    host: { voice: 'Olivia', engine: 'neural' },
    guest: { voice: 'Russell', engine: 'standard' }
  }
};

/**
 * Convert plain text script to conversational SSML
 * This makes it sound more natural like NotebookLM
 */
function scriptToConversationalSSML(script, speaker = 'host') {
  const voice = CONVERSATION_VOICES[speaker];

  // Add natural pauses and emphasis
  let ssml = `<speak>
    <amazon:domain name="conversational">
      ${script}
    </amazon:domain>
  </speak>`;

  // Add pauses after punctuation for natural flow
  ssml = ssml.replace(/\. /g, '.<break time="500ms"/> ');
  ssml = ssml.replace(/\? /g, '?<break time="700ms"/> ');
  ssml = ssml.replace(/! /g, '!<break time="600ms"/> ');
  ssml = ssml.replace(/: /g, ':<break time="300ms"/> ');

  return ssml;
}

/**
 * Parse script into conversation segments
 * Format: "Host: [text]" or "Guest: [text]"
 */
function parseConversationalScript(script) {
  const lines = script.split('\n').filter(line => line.trim());
  const segments = [];

  for (const line of lines) {
    // Match "Speaker: Text" format
    const match = line.match(/^(Host|Guest|Speaker \d+):\s*(.+)$/i);

    if (match) {
      const speaker = match[1].toLowerCase().includes('host') ? 'host' : 'guest';
      const text = match[2].trim();

      if (text) {
        segments.push({
          speaker,
          text,
          ssml: scriptToConversationalSSML(text, speaker)
        });
      }
    } else {
      // If no speaker prefix, treat as host
      if (line.trim()) {
        segments.push({
          speaker: 'host',
          text: line.trim(),
          ssml: scriptToConversationalSSML(line.trim(), 'host')
        });
      }
    }
  }

  return segments;
}

/**
 * Generate audio for a single segment using AWS Polly
 */
async function generateSegmentAudio(client, segment) {
  const voice = CONVERSATION_VOICES[segment.speaker];

  const command = new SynthesizeSpeechCommand({
    Text: segment.ssml,
    TextType: 'ssml',
    OutputFormat: 'mp3',
    VoiceId: voice.voice,
    Engine: voice.engine
  });

  const response = await client.send(command);

  // Convert audio stream to buffer
  const chunks = [];
  for await (const chunk of response.AudioStream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * Combine multiple audio segments into one podcast
 */
function combineAudioSegments(segments) {
  // In production, use a library like fluent-ffmpeg or audio-concat
  // For now, just concatenate the buffers (works for MP3)
  return Buffer.concat(segments);
}

/**
 * Auto-generate NotebookLM-style conversation from content
 * Creates a natural dialogue between host and guest
 */
export function generateConversationalScript(title, content) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  let script = `Host: Welcome to NARA Podcasts! Today we're diving into an exciting topic: ${title}.\n\n`;

  script += `Guest: Thanks for having me! I'm excited to discuss this.\n\n`;

  // Convert content into back-and-forth conversation
  paragraphs.forEach((paragraph, index) => {
    if (index % 2 === 0) {
      script += `Host: ${paragraph}\n\n`;
    } else {
      script += `Guest: That's fascinating. ${paragraph}\n\n`;
    }

    // Add natural reactions
    if (index < paragraphs.length - 1) {
      if (index % 3 === 0) {
        script += `Guest: Interesting point!\n\n`;
      } else if (index % 3 === 1) {
        script += `Host: Exactly! Let me add to that.\n\n`;
      }
    }
  });

  script += `Host: What a great discussion! Thanks for joining us today.\n\n`;
  script += `Guest: Thank you! This was really insightful.\n\n`;
  script += `Host: Don't forget to subscribe for more ocean research insights. Until next time!\n\n`;

  return script;
}

/**
 * Main function: Generate NotebookLM-style podcast
 */
export async function generateNotebookLMPodcast(podcastData, onProgress) {
  try {
    // 1. Create Polly client
    if (onProgress) onProgress({ stage: 'initializing', progress: 5, message: 'Connecting to AWS Polly...' });

    const client = await createPollyClient();

    // 2. Generate conversational script if needed
    if (onProgress) onProgress({ stage: 'script', progress: 15, message: 'Generating conversational script...' });

    let script = podcastData.script;
    if (!script.includes('Host:') && !script.includes('Guest:')) {
      // Auto-convert to conversation format
      script = generateConversationalScript(podcastData.title, script);
    }

    // 3. Parse script into conversation segments
    if (onProgress) onProgress({ stage: 'parsing', progress: 20, message: 'Parsing conversation...' });

    const segments = parseConversationalScript(script);

    if (segments.length === 0) {
      throw new Error('No valid conversation segments found in script');
    }

    // 4. Generate audio for each segment
    if (onProgress) onProgress({ stage: 'voice', progress: 30, message: 'Generating voice audio...' });

    const audioSegments = [];
    const totalSegments = segments.length;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const progress = 30 + (i / totalSegments) * 40; // 30% to 70%

      if (onProgress) {
        onProgress({
          stage: 'voice',
          progress,
          message: `Generating ${segment.speaker} voice (${i + 1}/${totalSegments})...`
        });
      }

      const audioBuffer = await generateSegmentAudio(client, segment);
      audioSegments.push(audioBuffer);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 5. Combine all audio segments
    if (onProgress) onProgress({ stage: 'combining', progress: 75, message: 'Combining audio segments...' });

    const finalAudio = combineAudioSegments(audioSegments);
    const audioBlob = new Blob([finalAudio], { type: 'audio/mpeg' });

    // 6. Upload to Firebase Storage
    if (onProgress) onProgress({ stage: 'uploading', progress: 85, message: 'Uploading to cloud storage...' });

    const filename = `podcasts/ai-generated/${Date.now()}_${podcastData.title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, audioBlob, {
      contentType: 'audio/mpeg',
      customMetadata: {
        generatedBy: 'aws-polly',
        style: 'notebooklm-conversational',
        segments: segments.length.toString()
      }
    });

    const audioUrl = await getDownloadURL(storageRef);

    // 7. Save to Firestore
    if (onProgress) onProgress({ stage: 'saving', progress: 95, message: 'Saving podcast metadata...' });

    const podcastRef = await addDoc(collection(db, 'podcasts'), {
      title: podcastData.title || { en: 'Untitled Podcast', si: 'නම් නැති පෝඩ්කාස්ට්', ta: 'தலைப்பு இல்லை பாட்காஸ்ட்' },
      description: podcastData.description || { en: '', si: '', ta: '' },
      category: podcastData.category || 'marine-research',
      audioUrl: audioUrl,
      duration: Math.ceil(finalAudio.length / 4000), // Rough estimate: ~4KB per second
      thumbnail: podcastData.thumbnail || '',
      tags: podcastData.tags || [],
      featured: false,
      status: 'published',
      views: 0,
      likes: 0,
      languages: ['en'], // Can be extended for multilingual
      generatedBy: 'ai',
      aiEngine: 'aws-polly',
      aiStyle: 'notebooklm-conversational',
      script: script,
      segments: segments.length,
      createdAt: serverTimestamp(),
      publishedAt: serverTimestamp()
    });

    if (onProgress) onProgress({ stage: 'complete', progress: 100, message: 'Podcast created successfully!' });

    return {
      success: true,
      podcastId: podcastRef.id,
      audioUrl: audioUrl,
      duration: Math.ceil(finalAudio.length / 4000),
      segments: segments.length
    };

  } catch (error) {
    console.error('Podcast generation failed:', error);

    if (onProgress) {
      onProgress({
        stage: 'error',
        progress: 0,
        message: error.message
      });
    }

    throw new Error(`Failed to generate podcast: ${error.message}`);
  }
}

/**
 * Test AWS Polly connection
 */
export async function testAWSPollyConnection() {
  try {
    const client = await createPollyClient();

    // Try generating a simple test phrase
    const command = new SynthesizeSpeechCommand({
      Text: 'Hello, this is a test of AWS Polly.',
      TextType: 'text',
      OutputFormat: 'mp3',
      VoiceId: 'Joanna',
      Engine: 'neural'
    });

    await client.send(command);

    return {
      success: true,
      message: 'AWS Polly connection successful!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Get available AWS Polly voices
 */
export function getAvailableVoices() {
  return {
    professional: VOICE_PAIRS.professional,
    friendly: VOICE_PAIRS.friendly,
    british: VOICE_PAIRS.british,
    australian: VOICE_PAIRS.australian
  };
}
