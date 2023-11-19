import { ApiProperty } from '@nestjs/swagger';
import { User } from './../entities/user.entity';

export class CreateUserDto implements Partial<User> {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  officeId: number;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  password: string;
}
