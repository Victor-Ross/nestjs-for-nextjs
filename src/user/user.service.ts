import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { HashingService } from 'src/common/hashing/hasing.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneByOrFail(userData);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({ email });

    if (exists) {
      throw new ConflictException('Email already exists');
    }
  }

  async create(dto: CreateUserDto) {
    await this.failIfEmailExists(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const created = this.userRepository.create(newUser);

    await this.userRepository.save(created);

    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException('Nothing to update');
    }
    const user = await this.findOneByOrFail({ id });

    user.name = dto.name ?? user.name;
    user.email = dto.email ?? user.email;

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is invalid');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });

    return user;
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
