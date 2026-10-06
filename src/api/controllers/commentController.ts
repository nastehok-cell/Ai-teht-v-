import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {ChatCompletionResponse} from '../../types/MessageTypes';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    const {text} = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400);
      throw new Error('Request body must include a "text" string');
    }

    const url = `${process.env.OPENAI_API_URL}/v1/chat/completions`;

    const completion = await fetchData<ChatCompletionResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', 
        messages: [
          {
            role: 'system',
            content:
            "You are a YouTube creator replying to comments on your video. Write a short and friendly reply in 2–3 sentences. Be polite and positive, even when the comment is negative."
          },
          {
            role: 'user',
            content: text,
          },
        ],
        max_tokens: 150,
      }),
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      throw new Error('No response received from the AI');
    }

    res.json({response: reply});
  } catch (error) {
    next(error);
  }
};

export {commentPost};
