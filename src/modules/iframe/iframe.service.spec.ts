import { Test, TestingModule } from '@nestjs/testing';
import { IframeService } from './iframe.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { CreateIframeDto } from './dto/create-iframe.dto';
import { Iframe } from './entities/iframe.entity';
import { of } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('IframeService', () => {
  let service: IframeService;
  let mockModel: any;
  let mockHttpService: any;

  beforeEach(async () => {
    mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    mockHttpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IframeService,
        {
          provide: getModelToken(Iframe.name),
          useValue: mockModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<IframeService>(IframeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCodeIframe', () => {
    it('should create and save an iframe', async () => {
      const createIframeDto: CreateIframeDto = {
        apikey: 'test-api-key',
        technology: 'test-tech',
        seniority: 'senior',
        lang: 'en',
        domain: '',
      };

      // Ensures that the Iframe is created and saved.
      const createdIframe = new mockModel(createIframeDto);
      createdIframe.save.mockResolvedValue(createIframeDto);

      const response = await service.createCodeIframe(createIframeDto);

      // Verify the calls to the constructor and the call to the save method
      expect(mockModel).toHaveBeenCalledWith({
        apikey: 'test-api-key',
        iframe: expect.any(String),
      });

      //expect(response.apikey).toEqual(createIframeDto.apikey);
      //expect(response.iframe).toEqual(expect.any(String));
    });

    it('should throw an internal server error if the model save fails', async () => {
      mockModel.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Save Failed')),
      }));

      const createIframeDto: CreateIframeDto = {
        apikey: 'test-api-key',
        technology: 'test-tech',
        seniority: 'senior',
        lang: 'en',
        domain: '',
      };

      await expect(service.createCodeIframe(createIframeDto)).rejects.toThrow(HttpException);
    });
  });

  describe('iframeforTheFront', () => {
    
    it('should return data from the external API', async () => {
      const apiKey = 'test-api-key';
      const userData = { level: 'senior', lang: 'en', technology: 'test-tech' };
      const tipsData = [{ tip: 'use Jest for testing' }];

      mockHttpService.get.mockImplementation((url: string) => {
        if (url.includes(process.env.API_USER)) {
          return of({ data: userData });
        } else if (url.includes(process.env.API_TIPS)) {
          return of({ data: tipsData });
        }
        return of(null);
      });

      const response = await service.iframeforTheFront(apiKey);

      expect(mockHttpService.get).toHaveBeenCalledTimes(2);

      //expect(response).toEqual(expect.arrayContaining(tipsData));
      //expect(response).toEqual(tipsData);
    });

  });
});
