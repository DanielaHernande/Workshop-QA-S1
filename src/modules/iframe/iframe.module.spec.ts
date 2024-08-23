import { Test, TestingModule } from '@nestjs/testing';
import { IframeModule } from '../iframe/iframe.module';
import { IframeService } from './iframe.service';
import { IframeController } from '../iframe/iframe.controller';
import { Iframe, IframeSchema } from './entities/iframe.entity';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';

describe('IframeModule', () => {
  let service: IframeModule;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [IframeController],
      providers: [
        IframeService,
        {
          provide: getModelToken(Iframe.name),
          useValue: {},
        },
      ],
    }).compile();
  });

  it('should have IframeService as a provider', () => {
    const iframeService = module.get<IframeService>(IframeService);
    expect(iframeService).toBeDefined();
  });

  it('should have IframeController as a controller', () => {
    const iframeController = module.get<IframeController>(IframeController);
    expect(iframeController).toBeDefined();
  });
});
