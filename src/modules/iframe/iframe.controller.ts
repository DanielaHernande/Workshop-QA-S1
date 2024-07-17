import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IframeService } from './iframe.service';
import { CreateIframeDto } from './dto/create-iframe.dto';
import { UpdateIframeDto } from './dto/update-iframe.dto';
import { ApiKeyAuthGuard } from 'src/common/auth/auth/auth.guard';

@UseGuards(ApiKeyAuthGuard)
@Controller('iframe')
export class IframeController {
  constructor(private readonly iframeService: IframeService) {}

  @Post('getIframe')
  create(@Body() createIframeDto: CreateIframeDto) {
    return this.iframeService.createCodeIframe(createIframeDto);
  }

  @Get('iframeForFront/:apikeyUser')
  iframeForTheFront(@Param('apikeyUser') apiKeyUser: string) {
    return this.iframeService.iframeforTheFront(apiKeyUser);
  }

  @Get()
  findAll() {
    return this.iframeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iframeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIframeDto: UpdateIframeDto) {
    return this.iframeService.update(+id, updateIframeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iframeService.remove(+id);
  }
}
