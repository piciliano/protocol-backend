import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UseInterceptors(FilesInterceptor('files', 5))
  @Post(':id')
  create(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    if (files.length > 5) {
      throw new BadRequestException('Você pode enviar no máximo 5 imagens.');
    }
    return this.photoService.create(files, id);
  }
}
