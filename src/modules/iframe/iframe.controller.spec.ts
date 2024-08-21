import { Test, TestingModule } from '@nestjs/testing';
import { IframeController } from './iframe.controller';
import { IframeService } from '../iframe.service';
import { CreateIframeDto } from '../dto/create-iframe.dto';
import { ApiKeyGuard } from '../../../common/auth/auth/auth.guard';
import { HttpService } from '@nestjs/axios'; // Importa HttpService

describe('IframeController', () => {
  let controller: IframeController;
  let mockIframeService: any;
  let mockHttpService: any;
  let mockApiKeyGuard: any;

  beforeEach(async () => {
    mockIframeService = {
      createCodeIframe: jest.fn(),
      iframeforTheFront: jest.fn(),
    };

    mockHttpService = {
      // Aquí puedes agregar métodos mockeados si tu guardia los usa
    };

    mockApiKeyGuard = {
      canActivate: jest.fn().mockResolvedValue(true), // Mockea el método canActivate
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IframeController],
      providers: [
        {
          provide: IframeService,
          useValue: mockIframeService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ApiKeyGuard,
          useValue: mockApiKeyGuard,
        },
      ],
    }).compile();

    controller = module.get<IframeController>(IframeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call createCodeIframe and return the result', async () => {
      const createIframeDto: CreateIframeDto = {
        apikey: 'testApiKey',
        technology: 'testTech',
        seniority: 'senior',
        lang: 'en',
        domain: '',
      };
      const result = { iframe: '<iframe></iframe>' };

      mockIframeService.createCodeIframe.mockResolvedValue(result);

      const response = await controller.create(createIframeDto);

      expect(mockIframeService.createCodeIframe).toHaveBeenCalledWith(
        createIframeDto,
      );
      expect(response).toEqual(result);
    });
  });

  describe('iframeForTheFront', () => {
    it('should call iframeforTheFront and return the result', async () => {
      const apiKeyUser = 'testApiKey';
      const result = { tips: ['tip1', 'tip2'] };

      mockIframeService.iframeforTheFront.mockResolvedValue(result);

      const response = await controller.iframeForTheFront(apiKeyUser);

      expect(mockIframeService.iframeforTheFront).toHaveBeenCalledWith(
        apiKeyUser,
      );
      expect(response).toEqual(result);
    });
  });
});
