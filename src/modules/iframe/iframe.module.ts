import { Module } from '@nestjs/common';
import { IframeService } from './iframe.service';
import { IframeController } from './controller/iframe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Iframe, IframeSchema } from './entities/iframe.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Iframe.name, schema: IframeSchema }]),
    HttpModule,
  ],
  controllers: [IframeController],
  providers: [IframeService],
})
export class IframeModule {}
