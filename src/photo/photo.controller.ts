import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  SwaggerTagsPhoto,
  SwaggerCreatePhoto,
} from './docs/photo.controller.docs';

@SwaggerTagsPhoto()
@Controller('photo')
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UseInterceptors(FilesInterceptor('files', 5))
  @Post(':id')
  @SwaggerCreatePhoto()
  create(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    if (files.length > 5) {
      throw new BadRequestException('Você pode enviar no máximo 5 imagens.');
    }
    return this.photoService.create(files, id);
  }
}
