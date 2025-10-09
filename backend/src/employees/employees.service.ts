/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateEmployeeHasZoneDto } from './dto/create-employee-has-zone.dto';
import { EmployeeHasZoneEntity } from './entities/has-zones.entity';
import { PositionEntity } from './entities/position.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(EmployeeHasZoneEntity)
    private readonly employeeHasZoneRepo: Repository<EmployeeHasZoneEntity>,

    @InjectRepository(PositionEntity)
    private readonly positionRepo: Repository<PositionEntity>,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeRepository.save(createEmployeeDto);
  }

  async findAll() {
    return await this.employeeRepository.find({
      relations: ['zones'],
    });
  }

  async findOneOrFail(
    conditions: FindOptionsWhere<EmployeeEntity>,
    options?: FindOneOptions<EmployeeEntity>,
  ) {
    try {
      const user = await this.employeeRepository.findOneOrFail({
        where: conditions,
        relations: ['zones', 'hasInspections'],
        ...options,
      });

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('Funcionjario nao encontrado'); // Mensagem de erro mais clara
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id: id },
    });
    this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    await this.employeeRepository.delete({ id });
  }

  async addZonesToEmployee(dto: CreateEmployeeHasZoneDto) {
    const { employeeId, zoneIds, createdBy } = dto;

    const existingRelations = await this.employeeHasZoneRepo.find({
      where: { employeeId },
    });

    const existingZoneIds = new Set(existingRelations.map((r) => r.zoneId));

    const newRelations = zoneIds
      .filter((zoneId) => !existingZoneIds.has(zoneId)) // evita duplicações
      .map((zoneId) => ({
        employeeId,
        zoneId,
        createdBy,
        createdAt: new Date(),
      }));

    if (newRelations.length === 0) {
      return { message: 'Nenhuma nova zona a adicionar.' };
    }

    await this.employeeHasZoneRepo.save(newRelations);

    return {
      message: `Zonas adicionadas com sucesso.`,
      total: newRelations.length,
    };
  }

async removeZonesFromEmployee(employeeId: string, zoneId: string) {
  await this.employeeHasZoneRepo.delete({ employeeId, zoneId });
}

  async findPositions() {
    return this.positionRepo.find();
  }
}
