import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhoneNumberDto } from './dto/create-phone-number.dto';
import { PhoneNumber } from './entities/phone-number.entity';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

@Injectable()
export class PhoneNumbersService {
  constructor(
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
  ) {}

  async create(createPhoneNumberDto: CreatePhoneNumberDto) {
    const newNumber = this.phoneNumberRepository.create(createPhoneNumberDto);
    return await this.phoneNumberRepository.save(newNumber);
  }

  async findById(id: string) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id },
    });
    if (!phoneNumber) {
      throw new NotFoundException(`Phone number with id ${id} not found`);
    }
    return phoneNumber;
  }

  // Belki ilerde bir şirketin tüm numaralarını çekmek istersin
  async findByCompanyId(companyId: string) {
    return await this.phoneNumberRepository.find({ where: { companyId } });
  }

  async update(id: string, updatePhoneNumberDto: UpdatePhoneNumberDto) {
    await this.phoneNumberRepository.update(id, updatePhoneNumberDto);
    return await this.phoneNumberRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const numberToRemove = await this.phoneNumberRepository.findOne({
      where: { id },
    });
    if (!numberToRemove) {
      throw new NotFoundException(`Phone number with id ${id} not found`);
    }

    await this.phoneNumberRepository.softRemove(numberToRemove);

    return { message: `Phone number removed successfully` };
  }

  async setWorkingStatus(id: string, isWorking: boolean) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { id },
    });

    if (phoneNumber) {
      if (isWorking) {
        phoneNumber.workedCount += 1;
      } else {
        phoneNumber.notWorkedCount += 1;
      }

      phoneNumber.lastUsedAt = new Date();

      await this.phoneNumberRepository.save(phoneNumber);
    }

    return { message: `Phone number status updated successfully` };
  }
}
