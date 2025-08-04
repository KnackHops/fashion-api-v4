import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { userExistsErr } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.databaseService.user.findFirst({
      where: { email: createUserDto.email },
      select: {
        id: true,
      },
    });

    if (user) {
      throw new ConflictException(userExistsErr);
    }

    return this.databaseService.user.create({ data: createUserDto });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  changePassword(id: number, changePasswordDto: ChangePasswordDto) {}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
