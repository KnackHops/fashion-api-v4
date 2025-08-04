import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { $Enums, EGender, Prisma } from 'generated/prisma';
import {
  passwordContainSpacesErr,
  passwordLengthErr,
} from 'src/common/constants';

export class CreateUserDto
  implements
    Pick<
      Prisma.UserCreateInput,
      | 'name'
      | 'email'
      | 'password'
      | 'age'
      | 'gender'
      | 'height'
      | 'chest'
      | 'shoulder'
      | 'torsoLength'
      | 'waist'
    >
{
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.trim();
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase().trim();
  })
  email: string;

  @IsString()
  @MinLength(10, { message: passwordLengthErr })
  @Matches(/^\S*$/, { message: passwordContainSpacesErr })
  @IsOptional()
  password: string;

  @IsInt()
  @IsOptional()
  age: number;

  @IsEnum(EGender)
  @IsOptional()
  gender: $Enums.EGender;

  @IsInt()
  @IsOptional()
  height?: number | null | undefined;

  @IsInt()
  @IsOptional()
  chest?: number | null | undefined;

  @IsInt()
  @IsOptional()
  shoulder?: number | null | undefined;

  @IsInt()
  @IsOptional()
  torsoLength?: number | null | undefined;

  @IsInt()
  @IsOptional()
  waist?: number | null | undefined;
}
