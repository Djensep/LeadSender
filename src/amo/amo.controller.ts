import { Controller, Get, Query } from '@nestjs/common';
import { AmoService } from './amo.service';
import { HttpService } from '@nestjs/axios';

@Controller('amo')
export class AmoController {
  constructor(
    private readonly amoService: AmoService,
    private readonly httpService: HttpService,
  ) {}

  @Get('oauth')
  async oauth(@Query('code') code: string, @Query('referer') referer: string) {
    const resp = await this.httpService.axiosRef.post(
      `https://${referer}/oauth2/access_token`,
      {
        client_id: process.env.AMO_CLIENT_ID,
        client_secret: process.env.AMO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.AMO_REDIRECT_URI,
      },
    );

    return this.amoService.saveTokens({
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
      baseDomain: referer,
      expiresAt: Math.floor(Date.now() / 1000) + resp.data.expires_in,
    });
  }
}
