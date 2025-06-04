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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiConsumes
} from '@nestjs/swagger';

@ApiTags('📝 Request')
@ApiBearerAuth()
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly photoService: PhotoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiOperation({ summary: 'Criar uma nova solicitação' })
  @ApiResponse({ status: 201, description: 'Solicitação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBody({ type: CreateRequestDto })
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
  @ApiOperation({ summary: 'Criar uma nova solicitação com fotos' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Solicitação com fotos criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou nenhuma foto enviada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBody({
    schema: {
      type: 'object',

    },
  })
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
  @ApiOperation({ summary: 'Obter todas as solicitações do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de solicitações retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getRequestsForUser(@LoggedUser() user: JwtPayload) {
    return this.requestService.getRequestsForUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as solicitações' })
  @ApiResponse({ status: 200, description: 'Lista de solicitações retornada com sucesso' })
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma solicitação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  @ApiResponse({ status: 200, description: 'Solicitação encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada' })
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma solicitação' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  @ApiBody({ type: UpdateRequestDto })
  @ApiResponse({ status: 200, description: 'Solicitação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma solicitação' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  @ApiResponse({ status: 200, description: 'Solicitação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada' })
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
