/**
 * AWS Polly Podcast Generation Service
 * Real AI-powered NotebookLM-style podcast generation using AWS Polly
 */

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { db, storage } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Voice pairs for NotebookLM-style conversations
const CONVERSATION_VOICES = {
  host: {
    voice: 'Joanna',      // Female, professional, warm
    engine: 'neural',
    language: 'en-US'
  },
  guest: {
    voice: 'Matthew',     // Male, friendly, engaging
    engine: 'neural',
    language: 'en-US'
  }
};

// Voice options for different styles
const VOICE_LIBRARY = {
  professional: { voice: 'Joanna', engine: 'neural', gender: 'Female' },
  friendly: { voice: 'Kendra', engine: 'neural', gender: 'Female' },
  energetic: { voice: 'Joey', engine: 'neural', gender: 'Male' },
  authoritative: { voice: 'Matthew', engine: 'neural', gender: 'Male' },
  soothing: { voice: 'Ruth', engine: 'neural', gender: 'Female' },
  // More voice options
  british: { voice: 'Amy', engine: 'neural', gender: 'Female' },
  australian: { voice: 'Nicole', engine: 'neural', gender: 'Female' },
  indian: { voice: 'Aditi', engine: 'neural', gender: 'Female' }
};

/**
 * Create AWS Polly client with credentials from Firebase
 */
async function createPollyClient() {
  try {
    // Get AWS credentials from Firebase
    const configRef = doc(db, 'admin_config', 'ai_api_keys');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      throw new Error('AWS API configuration not found. Please configure AWS credentials in Admin Panel.');
    }

    const config = configSnap.data();
    const awsConfig = config.aws;

    if (!awsConfig || !awsConfig.enabled) {
      throw new Error('AWS Polly is not enabled. Please enable it in Admin Panel.');
    }

    if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
      throw new Error('AWS credentials are missing. Please add them in Admin Panel.');
    }

    // Create Polly client
    const client = new PollyClient({
      region: awsConfig.region || 'us-east-1',
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
      }
    });

    return client;
  } catch (error) {
    console.error('Error creating Polly client:', error);
    throw error;
  }
}

/**
 * Convert text to conversational SSML with natural pauses
 * Note: Neural voices have VERY limited SSML support - only <speak> and <break> are safe
 * NO <amazon:domain>, NO <emphasis>, NO <prosody> - Neural voices sound natural without them
 */
function textToConversationalSSML(text, speaker = 'host') {
  // Clean the text and escape XML special characters
  let cleanText = text.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Start with just the speak tag - Neural voices need minimal SSML
  let ssml = `<speak>${cleanText}</speak>`;

  // Only add pauses - this is the safest SSML for Neural voices
  ssml = ssml.replace(/\. /g, '. <break time="500ms"/> ');
  ssml = ssml.replace(/\? /g, '? <break time="600ms"/> ');
  ssml = ssml.replace(/! /g, '! <break time="600ms"/> ');
  ssml = ssml.replace(/\n\n/g, ' <break time="1s"/> ');
  ssml = ssml.replace(/\n/g, ' <break time="400ms"/> ');

  // NO emphasis, NO prosody - Neural voices don't support them well
  // They sound natural by default!

  console.log('✅ Generated Neural-safe SSML (first 150 chars):', ssml.substring(0, 150));
  return ssml;
}

/**
 * Auto-generate NotebookLM-style conversation from content
 */
export function generateConversationalScript(title, content) {
  let script = `Host: Welcome to NARA Podcasts! I'm excited to dive into today's topic: ${title}.\n\n`;
  script += `Guest: Thanks for having me! This is such an interesting subject.\n\n`;

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

  // Create conversation from paragraphs
  paragraphs.forEach((paragraph, index) => {
    if (paragraph.length < 20) return; // Skip very short paragraphs

    if (index % 2 === 0) {
      script += `Host: ${paragraph}\n\n`;
    } else {
      // Add conversational reactions
      const reactions = [
        "That's fascinating. ",
        "Interesting point. ",
        "Absolutely. ",
        "I completely agree. ",
        "Right. "
      ];
      const reaction = reactions[index % reactions.length];
      script += `Guest: ${reaction}${paragraph}\n\n`;
    }
  });

  script += `Host: This has been incredibly insightful. Thanks for joining us today!\n\n`;
  script += `Guest: My pleasure! Don't forget to subscribe for more insights from NARA!\n\n`;

  return script;
}

/**
 * Parse script into segments with speaker identification
 */
function parseConversationalScript(script) {
  const lines = script.split('\n').filter(line => line.trim().length > 0);
  const segments = [];

  lines.forEach(line => {
    // Check if line starts with "Host:" or "Guest:"
    const hostMatch = line.match(/^Host:\s*(.+)/i);
    const guestMatch = line.match(/^Guest:\s*(.+)/i);

    if (hostMatch) {
      segments.push({
        speaker: 'host',
        text: hostMatch[1].trim()
      });
    } else if (guestMatch) {
      segments.push({
        speaker: 'guest',
        text: guestMatch[1].trim()
      });
    } else if (line.trim().length > 0) {
      // If no speaker specified, default to host
      segments.push({
        speaker: 'host',
        text: line.trim()
      });
    }
  });

  return segments;
}

/**
 * Generate audio for a single segment using AWS Polly
 */
async function generateSegmentAudio(client, segment) {
  const voiceConfig = CONVERSATION_VOICES[segment.speaker] || CONVERSATION_VOICES.host;
  const ssml = textToConversationalSSML(segment.text, segment.speaker);

  const command = new SynthesizeSpeechCommand({
    Text: ssml,
    TextType: 'ssml',
    OutputFormat: 'mp3',
    VoiceId: voiceConfig.voice,
    Engine: voiceConfig.engine,
    LanguageCode: voiceConfig.language
  });

  try {
    const response = await client.send(command);

    // Convert audio stream to buffer
    const audioStream = response.AudioStream;
    const chunks = [];

    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    // Browser-compatible: Convert chunks to Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  } catch (error) {
    console.error(`Error generating audio for segment:`, error);
    throw error;
  }
}

/**
 * Combine multiple audio segments into one file
 * Note: This is a simple concatenation. For professional production,
 * you might want to add crossfades and background music using ffmpeg
 */
function combineAudioSegments(audioSegments) {
  // Simple concatenation - Browser-compatible
  const totalLength = audioSegments.reduce((acc, segment) => acc + segment.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const segment of audioSegments) {
    result.set(segment, offset);
    offset += segment.length;
  }
  return result;
}

/**
 * Add intro/outro music (placeholder for future implementation)
 */
function addIntroOutroMusic(audioBuffer, settings) {
  // TODO: Implement music overlay using ffmpeg or similar
  // For now, just return the audio as-is
  return audioBuffer;
}

/**
 * Main function: Generate NotebookLM-style podcast using AWS Polly
 */
export async function generateNotebookLMPodcast(podcastData, onProgress) {
  try {
    const { title, content, script, settings = {} } = podcastData;

    // Progress callback helper
    const updateProgress = (stage, progress, message) => {
      if (onProgress) {
        onProgress({ stage, progress, message });
      }
    };

    updateProgress('init', 5, 'Initializing AWS Polly...');

    // 1. Create AWS Polly client
    const client = await createPollyClient();
    updateProgress('init', 10, 'Connected to AWS Polly');

    // 2. Generate conversational script if not provided
    updateProgress('script', 15, 'Generating conversational script...');
    let finalScript = script;

    if (!finalScript || !finalScript.includes('Host:')) {
      finalScript = generateConversationalScript(title, content || 'Welcome to this NARA podcast.');
    }

    updateProgress('script', 20, 'Script prepared');

    // 3. Parse script into segments
    const segments = parseConversationalScript(finalScript);
    updateProgress('script', 25, `Parsed ${segments.length} conversation segments`);

    // 4. Generate audio for each segment
    updateProgress('voice', 30, 'Generating AI voices...');
    const audioSegments = [];

    for (let i = 0; i < segments.length; i++) {
      const segmentProgress = 30 + (i / segments.length) * 40; // 30-70%
      updateProgress('voice', segmentProgress, `Generating voice ${i + 1}/${segments.length}...`);

      const audioBuffer = await generateSegmentAudio(client, segments[i]);
      audioSegments.push(audioBuffer);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    updateProgress('voice', 70, 'All voices generated');

    // 5. Combine audio segments
    updateProgress('rendering', 75, 'Combining audio segments...');
    let finalAudio = combineAudioSegments(audioSegments);

    // 6. Add intro/outro music if enabled
    if (settings.includeMusic) {
      updateProgress('rendering', 80, 'Adding background music...');
      finalAudio = addIntroOutroMusic(finalAudio, settings);
    }

    updateProgress('rendering', 85, 'Processing final audio...');

    // 7. Upload to Firebase Storage
    updateProgress('upload', 90, 'Uploading to cloud storage...');
    const filename = `${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    const storageRef = ref(storage, `podcasts/ai-generated/${filename}`);
    const audioBlob = new Blob([finalAudio], { type: 'audio/mpeg' });

    await uploadBytes(storageRef, audioBlob);
    const audioUrl = await getDownloadURL(storageRef);

    updateProgress('upload', 95, 'Audio uploaded successfully');

    // 8. Calculate duration (approximate)
    const durationSeconds = Math.ceil(finalAudio.length / 4000); // Rough estimate
    const durationFormatted = formatDuration(durationSeconds);

    // 9. Save podcast metadata to Firestore
    updateProgress('save', 97, 'Saving podcast metadata...');
    
    // Clean settings object - remove any non-serializable data
    const cleanSettings = {
      host: settings?.host || 'Joanna',
      guest: settings?.guest || 'Matthew',
      language: settings?.language || 'en-US',
      conversationStyle: settings?.conversationStyle || 'balanced'
    };
    
    const podcastRef = await addDoc(collection(db, 'podcasts'), {
      title: title || 'AI Generated Podcast',
      description: (content?.substring(0, 300) || 'AI-generated podcast').trim(),
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: durationFormatted,
      script: finalScript || '',
      segments: segments?.length || 0,
      generatedBy: 'ai',
      aiEngine: 'aws-polly',
      aiStyle: 'notebooklm-conversational',
      settings: cleanSettings,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plays: 0,
      likes: 0,
      category: 'ai-generated',
      tags: ['ai', 'polly', 'conversational']
    });

    updateProgress('complete', 100, 'Podcast created successfully!');

    return {
      success: true,
      podcastId: podcastRef.id,
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: durationFormatted,
      segments: segments.length,
      message: 'Podcast generated successfully with AWS Polly!'
    };

  } catch (error) {
    console.error('Error generating podcast:', error);

    // Check for specific errors
    if (error.message.includes('configuration not found')) {
      throw new Error('AWS API not configured. Please go to Admin Panel → AI API Configuration and add your AWS credentials.');
    } else if (error.message.includes('not enabled')) {
      throw new Error('AWS Polly is not enabled. Please enable it in Admin Panel → AI API Configuration.');
    } else if (error.name === 'CredentialsProviderError') {
      throw new Error('Invalid AWS credentials. Please check your Access Key ID and Secret Access Key in Admin Panel.');
    } else if (error.name === 'ThrottlingException') {
      throw new Error('AWS rate limit exceeded. Please wait a moment and try again.');
    } else {
      throw new Error(`Failed to generate podcast: ${error.message}`);
    }
  }
}

/**
 * Generate single-voice podcast (simpler version)
 */
export async function generateSingleVoicePodcast(podcastData, onProgress) {
  try {
    const { title, content, settings = {} } = podcastData;

    const updateProgress = (stage, progress, message) => {
      if (onProgress) {
        onProgress({ stage, progress, message });
      }
    };

    updateProgress('init', 10, 'Initializing AWS Polly...');
    const client = await createPollyClient();

    // Select voice based on settings
    const voiceConfig = VOICE_LIBRARY[settings.voice || 'professional'];

    updateProgress('voice', 30, 'Generating AI voice...');

    // Create SSML
    const ssml = textToConversationalSSML(content);

    const command = new SynthesizeSpeechCommand({
      Text: ssml,
      TextType: 'ssml',
      OutputFormat: 'mp3',
      VoiceId: voiceConfig.voice,
      Engine: voiceConfig.engine,
      LanguageCode: 'en-US'
    });

    const response = await client.send(command);

    // Convert to buffer
    updateProgress('rendering', 60, 'Processing audio...');
    const chunks = [];
    for await (const chunk of response.AudioStream) {
      chunks.push(chunk);
    }
    // Browser-compatible: Combine chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Upload
    updateProgress('upload', 80, 'Uploading to cloud...');
    const filename = `${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    const storageRef = ref(storage, `podcasts/ai-generated/${filename}`);
    await uploadBytes(storageRef, new Blob([audioBuffer], { type: 'audio/mpeg' }));
    const audioUrl = await getDownloadURL(storageRef);

    // Save metadata
    updateProgress('save', 95, 'Saving podcast...');
    const durationSeconds = Math.ceil(audioBuffer.length / 4000);
    
    const podcastRef = await addDoc(collection(db, 'podcasts'), {
      title: title || 'AI Generated Podcast',
      description: (content?.substring(0, 300) || 'AI-generated podcast').trim(),
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      generatedBy: 'ai',
      aiEngine: 'aws-polly',
      aiStyle: 'single-voice',
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plays: 0,
      likes: 0,
      category: 'ai-generated',
      tags: ['ai', 'polly', 'single-voice']
    });

    updateProgress('complete', 100, 'Done!');

    return {
      success: true,
      podcastId: podcastRef.id,
      audioUrl
    };

  } catch (error) {
    console.error('Error generating single-voice podcast:', error);
    throw error;
  }
}

/**
 * Test AWS Polly connection
 */
export async function testAWSPollyConnection() {
  try {
    const client = await createPollyClient();

    // Try a simple synthesis
    const command = new SynthesizeSpeechCommand({
      Text: 'Hello from NARA Podcasts. AWS Polly is working correctly.',
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
 * Helper: Format duration in seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Get available voices list
 */
export function getAvailableVoices() {
  return VOICE_LIBRARY;
}

/**
 * Get conversation voice pairs
 */
export function getConversationVoices() {
  return CONVERSATION_VOICES;
}
