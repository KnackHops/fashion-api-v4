import {
  // ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DatabaseService } from 'src/core/database/database.service';
import { passwordNotMatchErr } from 'src/common/constants';
import { HashService } from 'src/modules/auth/hash.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashService: HashService,
  ) {}

  findOne(id: number) {
    return this.databaseService.user.findFirstOrThrow({ where: { id } });
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.databaseService.user.findFirstOrThrow({
      where: { id },
      select: {
        password: true,
        id: true,
      },
    });

    const isMatch = await this.hashService.comparePassword(
      changePasswordDto.previousPassword,
      user.password,
    );

    if (!isMatch) throw new UnauthorizedException(passwordNotMatchErr);

    const newPassword = await this.hashService.hashPassword(
      changePasswordDto.password,
    );

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    });

    return;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
