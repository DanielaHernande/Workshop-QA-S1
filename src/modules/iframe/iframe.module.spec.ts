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

  // Before each test, we set up a test module
  // Antes de cada prueba, configuramos un módulo de prueba
  beforeEach(async () => {
    module = await Test.createTestingModule({
      // Importamos el módulo HTTP para gestionar las peticiones web.
      imports: [HttpModule],
      // Indicamos que vamos a probar el controlador que maneja iframes
      controllers: [IframeController],
      providers: [
        IframeService,
        {
          // We simulate the database using a “dummy model” for the Iframe entity
          // Simulamos la base de datos utilizando un «modelo ficticio» para la entidad Iframe
          provide: getModelToken(Iframe.name),
          useValue: {}, // Aqui decimos que no necesitamos la DB real
        },
      ],
    }).compile();
  });

  // We verify that the IframeService is present in the module
  // Verificamos que el servicio IframeService esté presente en el módulo
  it('should have IframeService as a provider', () => {
    const iframeService = module.get<IframeService>(IframeService);
    // Comprobamos que el servicio esté definido
    expect(iframeService).toBeDefined();
  });

  // We verify that the IframeController is present in the module.
  // Verificamos que el controlador IframeController esté presente en el módulo
  it('should have IframeController as a controller', () => {
    const iframeController = module.get<IframeController>(IframeController);
    // Comprobamos que el controlador esté definido
    expect(iframeController).toBeDefined();
  });
});
