import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll() {
    return await this.contactRepository.find();
  }

  async findOne(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    await this.contactRepository.update(id, updateContactDto);
    return await this.contactRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    await this.contactRepository.softRemove(contact);
    return { message: `Contact removed successfully` };
  }
}
