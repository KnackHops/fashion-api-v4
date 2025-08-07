import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  generate(@Body() body: { message: string }) {
    return this.geminiService.generateContent(body.message);
  }
}
