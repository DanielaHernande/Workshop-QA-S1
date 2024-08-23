import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  // UseGuards,
} from '@nestjs/common';
import { IframeService } from './iframe.service';
import { CreateIframeDto } from './dto/create-iframe.dto';
// import { ApiKeyGuard } from 'src/common/auth/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Iframe } from './entities/iframe.entity';
@ApiTags('iframe')
@Controller('iframe')
export class IframeController {
  constructor(private readonly iframeService: IframeService) {}

  // @UseGuards(ApiKeyGuard)
  @Post('getIframe')
  @ApiOperation({ summary: 'Create a new Iframe' })
  @ApiResponse({
    status: 201,
    description: 'The Iframe has been successfully created',
    type: Iframe,
  })
  @ApiBody({ type: CreateIframeDto })
  @ApiBadRequestResponse({
    description: 'Invalid data or Iframe already exists with the same api-key',
  })
  create(@Body() createIframeDto: CreateIframeDto) {
    return this.iframeService.createCodeIframe(createIframeDto);
  }
  // @UseGuards(ApiKeyGuard)
  @Get('iframeForFront/:apikeyUser')
  @ApiOperation({ summary: 'Get IFrame for Frontend' })
  @ApiParam({
    name: 'apikeyUser',
    description: 'User API Key',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'IFrame successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'IFrame not found.' })
  @ApiBadRequestResponse({
    description: 'Invalid data or Iframe',
  })
  iframeForTheFront(@Param('apikeyUser') apiKeyUser: string) {
    return this.iframeService.iframeforTheFront(apiKeyUser);
  }
}
