import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmoService } from 'src/amo/amo.service';
import { DealStatus } from 'src/common/enum/dealStatus.enum';
import { ContactsService } from 'src/contacts/contacts.service';
import { Repository } from 'typeorm';
import { DealsEntity } from './entity/deals.entity';
import { CreateDealDto } from './dto/createDeal.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealsEntity)
    private readonly dealsRepo: Repository<DealsEntity>,
    private readonly contactsService: ContactsService,
    private readonly amoService: AmoService,
    private readonly http: HttpService,
  ) {}

  async findOrCreateDeal({
    dealName,
    contactName,
    contactPhone,
  }: CreateDealDto) {
    const existing = await this.dealsRepo.findOne({
      where: { name: dealName },
      relations: ['contacts'],
    });
    if (existing) return { status: 'exists', existing };

    const contact = await this.contactsService.findOrCreate({
      name: contactName,
      phone: contactPhone,
    });

    if (!contact.amoId) throw new Error('Contact has no amoId after create');

    const token = await this.amoService.getValidToken();
    const headers = {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const payload = [
      {
        name: dealName,
        _embedded: { contacts: [{ id: contact.amoId }] },
      },
    ];

    const created = await this.http.axiosRef.post(
      `https://${token.baseDomain}/api/v4/leads`,
      payload,
      { headers },
    );

    const amoLead = created.data?._embedded?.leads?.[0];
    if (!amoLead?.id) throw new Error('Failed to create deal in amoCRM');

    const deal = this.dealsRepo.create({
      amoId: amoLead.id,
      name: dealName,
      status: DealStatus.NEW,
      pipelineStageId: amoLead.status_id ?? null,
      contacts: [contact],
    });
    const saved = await this.dealsRepo.save(deal);

    return { status: 'created', deal: saved };
  }
}
