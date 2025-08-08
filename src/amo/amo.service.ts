import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmoEntity } from './amo.entity';

@Injectable()
export class AmoService {
  constructor(
    @InjectRepository(AmoEntity)
    private readonly amoRepo: Repository<AmoEntity>,
    private readonly http: HttpService,
  ) {}

  async saveTokens(data: Partial<AmoEntity>) {
    let exist = await this.amoRepo.findOne({
      where: { baseDomain: data.baseDomain },
    });

    if (!exist) {
      exist = this.amoRepo.create(data);
    } else {
      Object.assign(exist, data);
    }

    return await this.amoRepo.save(exist);
  }

  async getValidToken() {
    const tokenData = await this.amoRepo.findOne({
      where: { baseDomain: process.env.AMO_BASE_DOMAIN },
    });

    if (!tokenData) throw new ConflictException('Token not found');

    if (Math.floor(Date.now() / 1000) > tokenData.expiresAt) {
      return this._refreshToken(tokenData);
    }
    return tokenData;
  }

  private async _refreshToken(tokenData: AmoEntity) {
    const url = `https://${tokenData.baseDomain}/oauth2/access_token`;

    const resp = await this.http.axiosRef.post(url, {
      client_id: process.env.AMO_CLIENT_ID,
      client_secret: process.env.AMO_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokenData.refreshToken,
      redirect_uri: process.env.AMO_REDIRECT_URI,
    });

    return this.saveTokens({
      ...tokenData,
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + resp.data.expires_in,
    });
  }
}
