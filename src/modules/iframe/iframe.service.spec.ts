import { Test, TestingModule } from '@nestjs/testing';
import { IframeService } from './iframe.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { CreateIframeDto } from './dto/create-iframe.dto';
import { Iframe } from './entities/iframe.entity';
import { of } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('IframeService', () => {
  // We declare a variable of the service we are going to test
  let service: IframeService;
  // // Mock to simulate the database model
  let mockModel: any;
  // Mock to simulate HTTP service
  let mockHttpService: any;

  beforeEach(async () => {
    mockModel = jest.fn().mockImplementation(() => ({
      // We simulate that the save method works correctly.
      save: jest.fn().mockResolvedValue({}),
    }));

    // We simulate the HTTP service with an empty structure
    mockHttpService = {
      get: jest.fn(),
    };

    // We set up the test module with the required providers
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // We include the service we want to test
        IframeService,
        {
          provide: getModelToken(Iframe.name),
          // We include the service we want to test
          useValue: mockModel,
        },
        {
          provide: HttpService,
          // We use the HTTP service mock
          useValue: mockHttpService,
        },
      ],
    }).compile();

    // We get an instance of the service from the test module
    service = module.get<IframeService>(IframeService);
  });

  it('should be defined', () => {
    // We verify that the service is correctly defined.
    expect(service).toBeDefined();
  });

  describe('createCodeIframe', () => {
    it('should create and save an iframe', async () => {
      // Define the data to be used to create an iframe
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
      // We simulate that saving in the model fails and throws an error.
      mockModel.mockImplementation(() => ({
        // Simulamos un fallo en el guardado
        save: jest.fn().mockRejectedValue(new Error('Save Failed')),
      }));

      // We use the same data as before to create an iframe
      const createIframeDto: CreateIframeDto = {
        apikey: 'test-api-key',
        technology: 'test-tech',
        seniority: 'senior',
        lang: 'en',
        domain: '',
      };

      // We verify that the service throws an HttpException when the save fails.
      await expect(service.createCodeIframe(createIframeDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('iframeforTheFront', () => {
    it('should return data from the external API', async () => {
      // We define an API Key and some simulated data that we would receive from an external API.
      const apiKey = 'test-api-key';
      const userData = { level: 'senior', lang: 'en', technology: 'test-tech' };
      const tipsData = [{ tip: 'use Jest for testing' }];

       // We simulate that the HTTP service returns the correct data depending on the URL
      mockHttpService.get.mockImplementation((url: string) => {
        
        if (url.includes(process.env.API_USER)) {
          // If it is the user API, we return userData
          return of({ data: userData });

        } else if (url.includes(process.env.API_TIPS)) {
          // If it is the tips API, we return tipsData
          return of({ data: tipsData });
        }

        // In any other case, we return null
        return of(null);
      });

      const response = await service.iframeforTheFront(apiKey);

      expect(mockHttpService.get).toHaveBeenCalledTimes(2);

      //expect(response).toEqual(expect.arrayContaining(tipsData));
      //expect(response).toEqual(tipsData);
    });
  });
});
