import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRequestDto: CreateRequestDto, user: JwtPayload) {
    try {
      const protocol = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const request = await this.prisma.request.create({
        data: {
          ...createRequestDto,
          userId: user.id,
          protocol,
        },
      });

      return request;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async getRequestsForUser(user: JwtPayload) {
    try {
      const requests = await this.prisma.request.findMany({
        where: {
          userId: user.id,
        },
        include: {
          photos: true,
        },
      });

      return requests;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async findAll() {
    try {
      const requests = await this.prisma.request.findMany({
        include: { photos: true, user: true },
      });

      return requests;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.prisma.request.findUnique({
        where: {
          id,
        },
        include: { photos: true },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      return request;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    try {
      await this.findOne(id);

      const requestUpdated = await this.prisma.request.update({
        where: { id },
        data: {
          ...updateRequestDto,
        },
      });
      return requestUpdated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async remove(id: string) {
    try {
      const request = await this.findOne(id);

      await this.prisma.request.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }
}
