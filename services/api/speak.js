import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language = 'english' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let textToSpeak = text;

    // If Hindi is requested, translate first
    if (language === 'hindi') {
      const translationResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a translator. Translate the following English text to Hindi. Keep the same warm, empathetic tone. Use simple Hindi that is easy to understand. Translate naturally, not word-by-word. Keep any names as they are.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3
      });
      
      textToSpeak = translationResponse.choices[0].message.content;
    }

    // Use OpenAI TTS with a warm, empathetic voice
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Nova is warm and empathetic, good for supportive content
      input: textToSpeak,
      speed: language === 'hindi' ? 0.9 : 0.95 // Slightly slower for Hindi
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Send audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);

  } catch (error) {
    console.error('TTS Error:', error);
    return res.status(500).json({ error: 'Failed to generate speech' });
  }
}
