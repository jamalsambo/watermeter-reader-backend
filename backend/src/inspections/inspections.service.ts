/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InspectionEntity } from './entities/inspection.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InspectionTypesEntity } from './entities/type.entity';
import { InspectionHasWatermeter } from './entities/has-watermeter.entity';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(InspectionEntity)
    private readonly inspectionRepo: Repository<InspectionEntity>,

    @InjectRepository(InspectionTypesEntity)
    private readonly inspectionTypeRepo: Repository<InspectionTypesEntity>,

    @InjectRepository(InspectionHasWatermeter)
    private readonly inspeHasWatermeterRepo: Repository<InspectionHasWatermeter>,
  ) {}

  async findAll(employeeId?: string, limit?: number) {
    const qb = this.inspectionRepo
      .createQueryBuilder('inspection')
      .leftJoin('inspection.hasWatermeters', 'hw')
      .leftJoin('inspection.type', 'type') // 🔹 join na relação type
      .select('inspection.id', 'id')
      .addSelect('inspection.number', 'number')
      .addSelect('inspection.month', 'month')
      .addSelect('type.name', 'type') // 🔹 seleciona o campo desejado da relação
      .addSelect('inspection.createdAt', 'createdAt')
      .addSelect('COUNT(hw.*)', 'totalWatermeters')
      .addSelect(
        `SUM(CASE WHEN hw.inspection = true THEN 1 ELSE 0 END)`,
        'inspected',
      )
      .addSelect(
        `SUM(CASE WHEN hw.inspection = false THEN 1 ELSE 0 END)`,
        'notInspected',
      )
      .groupBy('inspection.id')
      .addGroupBy('inspection.number')
      .addGroupBy('type.name') // 🔹 agrupa também pelo campo da relação
      .orderBy('inspection.createdAt', 'DESC');

    // Filtra por employeeId, se passado
    if (employeeId) {
      qb.andWhere('hw.employeeId = :employeeId', { employeeId });
    }

    // Limita resultados, se passado
    if (limit) {
      qb.limit(limit);
    }

    return await qb.getRawMany();
  }

  async generateInspectionNumber(): Promise<string> {
    const last = await this.inspectionRepo
      .createQueryBuilder('i')
      .orderBy('i.number', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (last?.number) {
      const lastNumber = parseInt(last.number.replace('IN-', ''), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    return `IN-${String(nextNumber).padStart(5, '0')}`;
  }

  async create(createDto: CreateInspectionDto) {
    const number = await this.generateInspectionNumber();
    const month = new Date().toLocaleString('pt-BR', {
      month: 'long',
    });

    const inspection = this.inspectionRepo.create({
      ...createDto,
      number,
      month,
    });

    return this.inspectionRepo.save(inspection);
  }

  async findOneOrFail(
    conditions: FindOptionsWhere<InspectionEntity>,
    employeeId?: string,
    options?: FindOneOptions<InspectionEntity>,
  ) {
    try {
      const qb = this.inspectionRepo
        .createQueryBuilder('inspection')
        .leftJoinAndSelect('inspection.hasWatermeters', 'hasWatermeters')
        .leftJoinAndSelect('hasWatermeters.watermeter', 'watermeter')
        .leftJoinAndSelect('watermeter.hasCustomers', 'hasCustomers')
        .leftJoinAndSelect('hasCustomers.customer', 'customer')
        .leftJoinAndSelect('watermeter.zone', 'zone')
        .leftJoinAndSelect('hasWatermeters.employee', 'employee')
        // 🔹 Adiciona readings filtrando pelo inspection atual
        .leftJoinAndMapOne(
          'watermeter.reading', // aqui será um objeto único
          'watermeter.readings',
          'reading',
          'reading.inspectionId = inspection.id',
        );

      // 🔹 Adiciona condições gerais
      Object.keys(conditions).forEach((key, index) => {
        const paramName = `param${index}`;
        qb.andWhere(`inspection.${key} = :${paramName}`, {
          [paramName]: (conditions as any)[key],
        });
      });

      // 🔹 Filtra por employeeId se fornecido
      if (employeeId) {
        qb.andWhere('hasWatermeters.employeeId = :employeeId', {
          employeeId,
        }).loadRelationCountAndMap(
          'inspection.watermetersCount',
          'inspection.hasWatermeters',
          'wm',
          (qb) => qb.where('wm.employeeId = :employeeId', { employeeId }),
        );
      } else {
        qb.loadRelationCountAndMap(
          'inspection.watermetersCount',
          'inspection.hasWatermeters',
        );
      }

      // 🔹 Aplica opções extras como order
      if (options?.order) {
        Object.entries(options.order).forEach(([field, direction]) => {
          qb.addOrderBy(`inspection.${field}`, direction as 'ASC' | 'DESC');
        });
      }

      const inspection = await qb.getOne();

      if (!inspection) {
        throw new NotFoundException('Inspeção não encontrada');
      }

      return inspection;
    } catch (error) {
      throw new NotFoundException('Inspeção não encontrada');
    }
  }

  async remove(id: string): Promise<void> {
    await this.inspectionRepo.delete(id);
  }

  async findTypes() {
    return await this.inspectionTypeRepo.find();
  }

  async findWatermeter(inspectionId: string) {
    const data = await this.inspeHasWatermeterRepo.find({
      where: { inspectionId },
      relations: [
        'watermeter',
        'watermeter.zone',
        'watermeter.hasCustomers',
        'watermeter.hasCustomers.customer',
        'employee',
      ],
    });

    return data.map((item) => {
      const list = item.watermeter?.hasCustomers;

      if (Array.isArray(list) && list.length > 0) {
        const ultimo = list.sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        )[0];

        // Criar novo campo
        item.watermeter.lastCustomer = ultimo;
      }

      // opcional: remover o array original
      delete item.watermeter.hasCustomers;

      return item;
    });
  }

  async updatedInspWatermeter(
    inspectionId: string,
    watermeterId: string,
    inspection: boolean,
  ) {
    const inspWatermeter = await this.inspeHasWatermeterRepo.findOneBy({
      inspectionId,
      watermeterId,
    });
    this.inspeHasWatermeterRepo.merge(inspWatermeter, {
      inspection: inspection,
    });
    return await this.inspeHasWatermeterRepo.save(inspWatermeter);
  }
}
