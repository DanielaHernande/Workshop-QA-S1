import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIframeDto } from './dto/create-iframe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Iframe } from './entities/iframe.entity';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IframeService {
  constructor(
    @InjectModel(Iframe.name) private iframeModel: Model<Iframe>,
    private readonly httpService: HttpService,
  ) {}
  async createCodeIframe(createIframeDto: CreateIframeDto) {
    const { apikey, technology, seniority, lang } = createIframeDto;
    const urlFront = process.env.URL_IFRAME_FRONT;

    try {
      let srcUrl = `${urlFront}/${apikey}`;

      if (technology) {
        srcUrl += `/${technology}`;
      }
      if (seniority) {
        srcUrl += `/${seniority}`;
      }
      if (lang) {
        srcUrl += `/${lang}`;
      }

      const htmlIframe = `<iframe id="inlineFrameExample" title="Inline Frame Example" width="300" height="200" src="${srcUrl}"></iframe>`;

      const iframe = {
        apikey: apikey,
        iframe: htmlIframe,
      };

      const createdIframe = new this.iframeModel(iframe);

      await createdIframe.save();

      return createdIframe;
    } catch (error) {
      throw new HttpException(
        `Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async iframeforTheFront(apiKey: string) {
    try {
      const dataForResponse = [];

      const urlUser = `${process.env.API_USER}/${apiKey}`;

      const response = await firstValueFrom(
        this.httpService.get(urlUser, {
          headers: {
            'x-api-key': process.env.API_KEY_IFRAME,
          },
        }),
      );

      const data = response.data;
      const dataForTip = {
        level: data.level,
        lang: data.lang,
        technology: data.technology,
      };

      if (!response) throw new HttpException('Invalid API key provided', 400);

      const urlTips = `${process.env.API_TIPS}all?page=1&limit=1&level=${dataForTip.level}&technology=${dataForTip.technology}`;

      const responseTips = await firstValueFrom(
        this.httpService.get(urlTips, {
          headers: {
            'x-api-key': process.env.API_KEY_IFRAME,
          },
        }),
      );
      dataForResponse.push(responseTips.data);

      if (!responseTips) throw new HttpException('Data of tips invalid', 400);

      return responseTips.data;
    } catch (err) {
      throw new HttpException(
        `Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
