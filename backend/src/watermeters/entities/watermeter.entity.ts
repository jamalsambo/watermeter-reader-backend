/* eslint-disable prettier/prettier */
import { CustomerHasWatermeterEntity } from 'src/customers/entities/has-watermeter.entity';
import { InspectionHasWatermeter } from 'src/inspections/entities/has-watermeter.entity';
import { ZoneEntity } from 'src/locations/entities/zone.entity';
import { ReadingEntity } from 'src/readings/entities/reading.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('watermeters')
export class WatermeterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  number: string;

  @Column({ type: 'varchar',  nullable: true })
  lantitude: string;

  @Column({ type: 'varchar' , nullable: true })
  longitude: string;

  @Column({ name: 'delegation_id', type: 'uuid' })
  delegationId: string;

  @Column({ name: 'zone_id', type: 'uuid', nullable: true })
  zoneId?: string;

  @Column({ type: 'varchar', nullable: true, default: 'Inactivo' })
  status?: string;

  @Column({ type: 'integer', nullable: true })
  block?: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'createdBy', type: 'uuid' })
  createdBy: string;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'updatedBy', type: 'uuid', nullable: true })
  updatedBy?: string;

  @ManyToOne(() => ZoneEntity, zone => zone.watermeters)
  @JoinColumn({name: 'zone_id'})
  zone: ZoneEntity

  @OneToMany(() => InspectionHasWatermeter, inspection => inspection.watermeter)
  hasInspections: InspectionHasWatermeter[]

  @OneToMany(() => CustomerHasWatermeterEntity, hasCustomer => hasCustomer.watermeter)
  hasCustomers: CustomerHasWatermeterEntity[]

  @OneToMany(() => ReadingEntity, readings => readings.watermeter)
  readings: ReadingEntity[]
  lastCustomer: CustomerHasWatermeterEntity;
}
