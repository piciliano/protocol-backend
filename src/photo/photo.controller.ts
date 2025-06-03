import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Param,
  UseGuards
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';

@ApiTags('📸 Photo')
@Controller('photo')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UseInterceptors(FilesInterceptor('files', 5))
  @Post(':id')
  @ApiOperation({
    summary: 'Upload de fotos',
    description: 'Realiza o upload de até 5 fotos para um protocolo'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'ID do protocolo',
    example: '1'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Arquivos de imagem (máximo 5)'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Fotos enviadas com sucesso'
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhum arquivo enviado ou limite de fotos excedido'
  })
  @ApiResponse({
    status: 404,
    description: 'Protocolo não encontrado'
  })
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
