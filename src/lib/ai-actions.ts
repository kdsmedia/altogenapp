'use server';

import OpenAI from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generatePrompts(productName: string, imageBase64?: string) {
  try {
    const content: any[] = [
      {
        type: "text",
        text: `Generate exactly 3 diverse and creative video scene prompts for a product named "${productName}". 
        Each scene should be cinematic and descriptive. Return them as a numbered list.`,
      }
    ];

    if (imageBase64) {
      content.push({
        type: "image_url",
        image_url: {
          url: imageBase64,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    const text = response.choices[0].message.content || "";
    const scenes = text.split(/\d\.\s+/).filter(s => s.trim().length > 0).slice(0, 3);
    return scenes;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to generate prompts');
  }
}

export async function startVideoGeneration(prompt: string, firstFrameImage?: string) {
  try {
    const input: any = {
      prompt: prompt,
    };

    if (firstFrameImage) {
      input.first_frame_image = firstFrameImage;
    }

    const prediction = await replicate.predictions.create({
      version: "minimax/video-01",
      input: input,
    });

    return prediction;
  } catch (error) {
    console.error('Replicate Error:', error);
    throw new Error('Failed to start video generation');
  }
}

export async function getPredictionStatus(predictionId: string) {
  try {
    return await replicate.predictions.get(predictionId);
  } catch (error) {
    console.error('Status Error:', error);
    throw new Error('Failed to fetch prediction status');
  }
}
