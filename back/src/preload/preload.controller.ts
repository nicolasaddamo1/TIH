import { Controller, Post } from '@nestjs/common';
import { PreloadService } from './preload.service';

@Controller('preload')
export class PreloadController {
  constructor(private readonly preloadService: PreloadService) {}

  @Post()
  async preloadData() {
    await this.preloadService.preloadAll();
    return { message: 'Datos precargados correctamente' };
  }
}
