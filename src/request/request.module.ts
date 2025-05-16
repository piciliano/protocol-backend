import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [PhotoModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
