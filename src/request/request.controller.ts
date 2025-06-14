import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { LoggedUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/jwt-guard.role';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotoService } from 'src/photo/photo.service';

import {
  SwaggerTagsRequest,
  SwaggerCreateRequest,
  SwaggerCreateRequestWithPhoto,
  SwaggerGetRequestsForUser,
  SwaggerFindAllRequests,
  SwaggerFindOneRequest,
  SwaggerUpdateRequest,
  SwaggerDeleteRequest,
} from './docs/request.controller.docs';

@SwaggerTagsRequest()
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly photoService: PhotoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerCreateRequest()
  create(
    @Body() createRequestDto: CreateRequestDto,
    @LoggedUser() user: JwtPayload,
  ) {
    return this.requestService.create(createRequestDto, user);
  }

  @Post('with-photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'MODERATOR')
  @UseInterceptors(FilesInterceptor('files', 5))
  @SwaggerCreateRequestWithPhoto()
  async createWithPhoto(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateRequestDto,
    @LoggedUser() user: JwtPayload,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Envie ao menos uma imagem.');
    }

    const request = await this.requestService.create(body, user);
    const photos = await this.photoService.create(files, request.id);

    return {
      ...request,
      photos,
    };
  }

  @Get('requests-for-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'MODERATOR', 'ADMIN')
  @SwaggerGetRequestsForUser()
  getRequestsForUser(@LoggedUser() user: JwtPayload) {
    return this.requestService.getRequestsForUser(user);
  }

  @Get()
  @SwaggerFindAllRequests()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  @SwaggerFindOneRequest()
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  @SwaggerUpdateRequest()
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  @SwaggerDeleteRequest()
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
