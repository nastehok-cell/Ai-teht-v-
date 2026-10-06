import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import fs from 'fs/promises';
import path from 'path';

type ImageResponse = {
  data?: {
    b64_json?: string;
  }[];
};

const imagePost = async (
  req: Request<{}, {}, {prompt: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {prompt} = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400);
      throw new Error('Request body must include a "prompt" string');
    }

    const url = `${process.env.OPENAI_API_URL}/v1/images/generations`;

    const result = await fetchData<ImageResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1536x1024',
      }),
    });

    const imageData = result.data?.[0]?.b64_json;

    if (!imageData) {
      throw new Error('No image data received from the AI');
    }

    const imageBuffer = Buffer.from(imageData, 'base64');

    const fileName = `thumbnail-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);

    await fs.mkdir(path.dirname(filePath), {recursive: true});
    await fs.writeFile(filePath, imageBuffer);

    res.json({
      message: 'Image generated successfully',
      file: fileName,
    });
  } catch (error) {
    next(error);
  }
};

export {imagePost};