/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserTypesEntity } from './entities/type.entity';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { RoleEntity } from './entities/roles.entity';
import { UserPermissionEntity } from './entities/has-permission.entity';
import { addUserPermissionsDto } from './dto/add-permission.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserTypesEntity)
    private readonly userTypeRepository: Repository<UserTypesEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepo: Repository<UserPermissionEntity>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } })
    this.userRepository.merge(user, updateUserDto)
    return await this.userRepository.save(user)
  }


  createUserType(createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeRepository.save(createUserTypeDto);
  }

  async findUserTypes() {
    return await this.userTypeRepository.find();
  }

  async findAll() {
    return this.userRepository.find()
  }

  async findOneOrFail(
    conditions: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ) {
    try {
      const user = await this.userRepository.findOneOrFail({
        relations: ['userType', 'employee', 'employee.position', 'permissions'],
        where: conditions,
        ...options,
      });

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('Usuario nao encontrado'); // Mensagem de erro mais clara
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async addPermissions(dto: addUserPermissionsDto) {
    const { userId, permissionIds } = dto
    const newPermissions = permissionIds.map((id) =>
      this.userPermissionRepo.create({ userId, permissionId: id }),
    );

    await this.userPermissionRepo.save(newPermissions);
  }

  async removePermissions(userId: string, permissionIds: []) {
    const newPermissions = permissionIds.map((permissionId) => ({
      userId,
      permissionId,
    }));

    await this.userPermissionRepo.delete(newPermissions);
  }

  async findPermissions(userId: string) {
    return this.userPermissionRepo.find({
      relations: ['permission'],
      where: { userId: userId },
    });
  }

  async findRoles() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }
}
