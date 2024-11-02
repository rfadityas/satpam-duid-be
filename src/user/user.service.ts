import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async register(dto: CreateUserDto) {
    // Check if email is already in use
    const emailIsExist = await this.findEmail(dto.email);

    if (emailIsExist) {
      throw new ConflictException('Email already in use');
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10)
      }
    })

    const { password, ...dataUser } = newUser;
    return dataUser;
  }

  async findEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
