import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GENAI_API_KEY } from 'src/common/constants/envNames';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenAI({
      apiKey: this.configService.get(GENAI_API_KEY) || '',
    });
  }

  async generateContent(contents: string) {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        text: contents,
      },
    });

    return response.text;
  }
}
