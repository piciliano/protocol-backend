import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Photo } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}
  async create(files: Express.Multer.File[], requestId: string) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string,
        { auth: { persistSession: false } },
      );

      const request = await this.prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });

      if (!request) {
        throw new NotFoundException('Requisição não encontrada');
      }

      const savedPictures: Photo[] = [];

      for (const file of files) {
        const upload = await supabase.storage
          .from('protocol')
          .upload(file.originalname, file.buffer, { upsert: true });

        if (upload.error) {
          throw new Error(upload.error.message);
        }

        const publicUrl = supabase.storage
          .from('protocol')
          .getPublicUrl(file.originalname).data.publicUrl;

        const saved = await this.prisma.photo.create({
          data: {
            url: publicUrl,
            requestId,
          },
        });

        savedPictures.push(saved);
      }

      return savedPictures;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro ao fazer upload de imagens',
          error: error.message || 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
