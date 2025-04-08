import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Social media platforms
const PLATFORMS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube Shorts',
  'LinkedIn',
  'Pinterest',
  'Snapchat',
  'Discord',
  'Reddit',
  'X (Twitter)',
];

// Content categories
const CATEGORIES = [
  'Written Content',
  'Merch Concepts',
  'Image/Video Prompts',
  'Innovation-Specific Instructions',
];

/**
 * Generate daily content for social media
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function generateDailyContent(req: Request, res: Response) {
  try {
    const { platforms = PLATFORMS, categories = CATEGORIES } = req.body;

    // Get current date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // Check if content already exists for today
    const { data: existingContent, error: existingError } = await supabase
      .from('daily_content')
      .select('*')
      .eq('date', dateString)
      .limit(1);

    if (!existingError && existingContent && existingContent.length > 0) {
      return res.status(200).json({ content: existingContent[0].content });
    }

    // Get tarot card of the day
    const { data: dailyCard, error: cardError } = await supabase
      .from('daily_cards')
      .select('*')
      .eq('date', dateString)
      .limit(1);

    if (cardError) {
      console.error('Error fetching daily card:', cardError);
      return res.status(500).json({ error: 'Failed to fetch daily card' });
    }

    // If no daily card exists, select a random one
    let cardOfTheDay = '';
    if (!dailyCard || dailyCard.length === 0) {
      const tarotCards = [
        'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
        'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
        'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
        'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
        'Judgement', 'The World'
      ];
      cardOfTheDay = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    } else {
      cardOfTheDay = dailyCard[0].card_name;
    }

    // Generate content for each platform and category
    const content = {};

    for (const platform of platforms) {
      content[platform] = {};

      for (const category of categories) {
        // Generate content using OpenAI
        const prompt = `
You are a social media content creator for Mystic Arcana, a spiritual web application focused on tarot, astrology, and personal growth.
Today's tarot card is: ${cardOfTheDay}
Current date: ${dateString}

Create content for ${platform} in the category: ${category}

For Written Content, provide engaging text that would resonate with spiritual seekers.
For Merch Concepts, suggest product ideas related to the daily card or astrology.
For Image/Video Prompts, provide detailed instructions for creating visual assets using Canva.
For Innovation-Specific Instructions, suggest unique ways to engage users on this specific platform.

Make the content platform-appropriate in terms of length, style, and format.
Include relevant hashtags where appropriate.
Tie the content to features in our app like daily readings, journaling, or personalized insights.
Include a call to action that encourages users to engage with our app.

Provide only the content itself, no explanations or additional notes.
`;

        const completion = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt,
          max_tokens: 300,
          temperature: 0.7,
        });

        content[platform][category] = completion.data.choices[0].text?.trim() || '';
      }
    }

    // Store the generated content
    const { error: insertError } = await supabase
      .from('daily_content')
      .insert({
        date: dateString,
        card_of_the_day: cardOfTheDay,
        content,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error storing daily content:', insertError);
      return res.status(500).json({ error: 'Failed to store daily content' });
    }

    // Return the generated content
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error generating daily content:', error);
    return res.status(500).json({ error: 'Failed to generate daily content' });
  }
}

/**
 * Schedule daily content posts
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function scheduleDailyPosts(req: Request, res: Response) {
  try {
    const { date, platforms = [] } = req.body;

    // Get the content for the specified date
    const { data: dailyContent, error: contentError } = await supabase
      .from('daily_content')
      .select('*')
      .eq('date', date)
      .limit(1);

    if (contentError || !dailyContent || dailyContent.length === 0) {
      console.error('Error fetching daily content:', contentError);
      return res.status(500).json({ error: 'Failed to fetch daily content' });
    }

    const content = dailyContent[0].content;

    // Schedule posts for each platform
    const scheduledPosts = [];

    for (const platform of platforms) {
      if (!content[platform]) {
        continue;
      }

      // Determine posting time based on platform
      const postTime = getOptimalPostingTime(platform);

      // Create scheduled post
      const { data: post, error: postError } = await supabase
        .from('scheduled_posts')
        .insert({
          platform,
          content: content[platform],
          scheduled_time: postTime.toISOString(),
          status: 'scheduled',
          created_at: new Date().toISOString(),
        })
        .select();

      if (postError) {
        console.error(`Error scheduling post for ${platform}:`, postError);
      } else {
        scheduledPosts.push(post[0]);
      }
    }

    // Return the scheduled posts
    return res.status(200).json({ scheduledPosts });
  } catch (error) {
    console.error('Error scheduling daily posts:', error);
    return res.status(500).json({ error: 'Failed to schedule daily posts' });
  }
}

/**
 * Get optimal posting time for a platform
 * 
 * @param platform Social media platform
 * @returns Optimal posting time
 */
function getOptimalPostingTime(platform: string): Date {
  const now = new Date();
  const postTime = new Date(now);

  // Set posting time based on platform
  switch (platform) {
    case 'Instagram':
      // Best times: 11am-1pm, 7-9pm
      postTime.setHours(12, 0, 0, 0);
      break;
    case 'Facebook':
      // Best times: 1-4pm
      postTime.setHours(14, 0, 0, 0);
      break;
    case 'TikTok':
      // Best times: 6-9pm
      postTime.setHours(19, 0, 0, 0);
      break;
    case 'YouTube Shorts':
      // Best times: 4-6pm
      postTime.setHours(17, 0, 0, 0);
      break;
    case 'LinkedIn':
      // Best times: 8-10am, 1-2pm
      postTime.setHours(9, 0, 0, 0);
      break;
    case 'Pinterest':
      // Best times: 8-11pm
      postTime.setHours(20, 0, 0, 0);
      break;
    case 'Snapchat':
      // Best times: 10pm-1am
      postTime.setHours(22, 0, 0, 0);
      break;
    case 'Discord':
      // Best times: 6-10pm
      postTime.setHours(20, 0, 0, 0);
      break;
    case 'Reddit':
      // Best times: 6-8am, 12-1pm
      postTime.setHours(7, 0, 0, 0);
      break;
    case 'X (Twitter)':
      // Best times: 9am-12pm
      postTime.setHours(10, 0, 0, 0);
      break;
    default:
      // Default to 9am
      postTime.setHours(9, 0, 0, 0);
  }

  // If the time has already passed today, schedule for tomorrow
  if (postTime < now) {
    postTime.setDate(postTime.getDate() + 1);
  }

  return postTime;
}

/**
 * Get daily content for a specific date
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getDailyContent(req: Request, res: Response) {
  try {
    const { date } = req.params;

    // Get the content for the specified date
    const { data: dailyContent, error: contentError } = await supabase
      .from('daily_content')
      .select('*')
      .eq('date', date)
      .limit(1);

    if (contentError) {
      console.error('Error fetching daily content:', contentError);
      return res.status(500).json({ error: 'Failed to fetch daily content' });
    }

    if (!dailyContent || dailyContent.length === 0) {
      return res.status(404).json({ error: 'No content found for the specified date' });
    }

    // Return the content
    return res.status(200).json({ content: dailyContent[0] });
  } catch (error) {
    console.error('Error fetching daily content:', error);
    return res.status(500).json({ error: 'Failed to fetch daily content' });
  }
}

/**
 * Generate image for social media post
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function generateSocialImage(req: Request, res: Response) {
  try {
    const { prompt, platform } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Determine image dimensions based on platform
    let width = 1080;
    let height = 1080;

    switch (platform) {
      case 'Instagram':
        // Square post
        width = 1080;
        height = 1080;
        break;
      case 'Facebook':
        // Landscape post
        width = 1200;
        height = 630;
        break;
      case 'TikTok':
        // Vertical video thumbnail
        width = 1080;
        height = 1920;
        break;
      case 'YouTube Shorts':
        // Vertical video thumbnail
        width = 1080;
        height = 1920;
        break;
      case 'LinkedIn':
        // Landscape post
        width = 1200;
        height = 627;
        break;
      case 'Pinterest':
        // Vertical pin
        width = 1000;
        height = 1500;
        break;
      case 'X (Twitter)':
        // Landscape post
        width = 1200;
        height = 675;
        break;
      default:
        // Default to square
        width = 1080;
        height = 1080;
    }

    // Generate image using OpenAI DALL-E
    const response = await openai.createImage({
      prompt: `${prompt} - Mystical, spiritual, tarot-inspired image for ${platform}. High quality, professional social media post.`,
      n: 1,
      size: `${width}x${height}`,
    });

    const imageUrl = response.data.data[0].url;

    // Return the image URL
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating social image:', error);
    return res.status(500).json({ error: 'Failed to generate social image' });
  }
}

/**
 * Get scheduled posts
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getScheduledPosts(req: Request, res: Response) {
  try {
    const { status, platform } = req.query;

    // Build query
    let query = supabase.from('scheduled_posts').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (platform) {
      query = query.eq('platform', platform);
    }

    // Execute query
    const { data: posts, error } = await query.order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled posts:', error);
      return res.status(500).json({ error: 'Failed to fetch scheduled posts' });
    }

    // Return the posts
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return res.status(500).json({ error: 'Failed to fetch scheduled posts' });
  }
}

/**
 * Update post status
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function updatePostStatus(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!postId || !status) {
      return res.status(400).json({ error: 'Missing required parameters: postId or status' });
    }

    // Update post status
    const { error } = await supabase
      .from('scheduled_posts')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) {
      console.error('Error updating post status:', error);
      return res.status(500).json({ error: 'Failed to update post status' });
    }

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating post status:', error);
    return res.status(500).json({ error: 'Failed to update post status' });
  }
}
