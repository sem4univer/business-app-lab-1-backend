import { BaseUserService } from './../shared/base-user.service';
import { AuthService } from '../auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/role/roles.decorators';
import { RoleName } from '../auth/role/role.enum';
import { UserRelationService } from './user-relation.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: BaseUserService,
    private readonly authService: AuthService,
    private readonly userRelationService: UserRelationService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Get()
  @Roles(RoleName.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('offices')
  @Roles(RoleName.Admin)
  getAllOffices() {
    return this.userRelationService.getAllOffices();
  }

  @Get('roles')
  @Roles(RoleName.Admin)
  getAllRoles() {
    return this.userRelationService.getAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':id/authEvent')
  getUserEvents(@Param('id') id: string) {
    return this.authService.getAuthEvents(+id);
  }

  @Roles(RoleName.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(RoleName.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
