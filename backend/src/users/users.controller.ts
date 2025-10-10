/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { addUserPermissionsDto } from './dto/add-permission.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('type')
  createUseType(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.usersService.createUserType(createUserTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('types')
  findUserTypes() {
    return this.usersService.findUserTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Get('roles')
  findRoles() {
    return this.usersService.findRoles();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOneOrFail({ id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add-permissions')
  addPermissions(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() dto: addUserPermissionsDto,
  ) {
    return this.usersService.addPermissions(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove-permissions')
  removePermissions(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() permissionIds: any,
  ) {
    return this.usersService.removePermissions(userId, permissionIds);
  }
}
