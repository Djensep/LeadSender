import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmoService } from 'src/amo/amo.service';
import { Repository } from 'typeorm';
import { ContactsEntity } from './entity/contacts.entity';
import { CreateContactDto } from './dto/createContact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactsEntity)
    private readonly contactsRepo: Repository<ContactsEntity>,
    private readonly amoService: AmoService,
  ) {}

  async findOrCreate({ name, phone }: CreateContactDto) {
    let contact = await this.contactsRepo.findOne({ where: { phone } });
    if (contact) return contact;

    const token = await this.amoService.getValidToken();
    const http = this.amoService['http'].axiosRef;

    const searchResp = await http.get(
      `https://${token.baseDomain}/api/v4/contacts`,
      {
        params: { query: phone },
        headers: { Authorization: `Bearer ${token.accessToken}` },
      },
    );

    if (searchResp.data._embedded?.contacts?.length) {
      const amoContact = searchResp.data._embedded.contacts[0];

      const newContact = this.contactsRepo.create({
        amoId: amoContact.id,
        name: amoContact.name,
        phone,
      });

      return await this.contactsRepo.save(newContact);
    }

    const createResp = await http.post(
      `https://${token.baseDomain}/api/v4/contacts`,
      [
        {
          name,
          custom_fields_values: [
            { field_code: 'PHONE', values: [{ value: phone }] },
          ],
        },
      ],
      { headers: { Authorization: `Bearer ${token.accessToken}` } },
    );

    const newAmoId = createResp.data._embedded.contacts[0].id;

    contact = this.contactsRepo.create({ amoId: newAmoId, name, phone });

    return await this.contactsRepo.save(contact);
  }
}
