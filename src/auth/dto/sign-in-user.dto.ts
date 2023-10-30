import { ApiProperty } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { RoleName } from '../role/role.enum';

export class SignInUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export const signInResponseSchema: SchemaObject = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      description: 'Bearer token for access to private api routes',
    },
    role: {
      type: 'string',
      enum: [RoleName.Admin, RoleName.User],
    },
  },
};
