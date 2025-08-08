import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmoService } from 'src/amo/amo.service';
import { DealStatus } from 'src/common/enum/dealStatus.enum';
import { ContactsService } from 'src/contacts/contacts.service';
import { Repository } from 'typeorm';
import { DealsEntity } from './entity/deals.entity';
import { CreateDealDto } from './dto/createDeal.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealsEntity)
    private readonly dealsRepo: Repository<DealsEntity>,
    private readonly contactsService: ContactsService,
    private readonly amoService: AmoService,
  ) {}

  async findOrCreateDeal({
    dealName,
    contactName,
    contactPhone,
  }: CreateDealDto) {
    let deal = await this.dealsRepo.findOne({ where: { name: dealName } });
    if (deal) return { status: 'exists', deal };

    const contact = await this.contactsService.findOrCreate({
      name: contactName,
      phone: contactPhone,
    });
    const token = await this.amoService.getValidToken();
    const http = this.amoService['http'].axiosRef;

    const createResp = await http.post(
      `https://${token.baseDomain}/api/v4/leads`,
      [
        {
          name: contactName,
          status_id: null,
          _embedded: { contacts: [{ id: contact.amoId }] },
        },
      ],
      { headers: { Authorization: `Bearer ${token.accessToken}` } },
    );

    const newAmoId = createResp.data._embedded.leads[0].id;
    deal = this.dealsRepo.create({
      amoId: newAmoId,
      name: contactName,
      status: DealStatus.NEW,
      contacts: [contact],
    });
    return { status: 'created', deal: await this.dealsRepo.save(deal) };
  }
}
