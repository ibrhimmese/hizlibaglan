import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config'; // Ekle

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.generateInitialUser();
  }

  private async generateInitialUser() {
    const users = await this.usersRepository.find();

    if (users.length === 0) {
      const defaultUser = this.usersRepository.create({
        email:
          this.configService.get<string>('DEFAULT_ADMIN_EMAIL') ||
          'default@mail.com',
        password: bcrypt.hashSync(
          this.configService.get<string>('DEFAULT_ADMIN_PASS') ||
            'defaultpassword',
          10,
        ),
      });
      await this.usersRepository.save(defaultUser);
    }
  }

  // Login olurken kullanacağız
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async updateUserByEmail(updateUserDto: UpdateUserDto) {
    const users = await this.usersRepository.find();

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0]; // İlk kullanıcıyı alıyoruz

    if (user) {
      user.email = updateUserDto.email || user.email;
      user.password = updateUserDto.password
        ? bcrypt.hashSync(updateUserDto.password, 10)
        : user.password;
    }

    return await this.usersRepository.save(user);
  }
}
