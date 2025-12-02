/* eslint-disable prettier/prettier */
import { WatermeterEntity } from 'src/watermeters/entities/watermeter.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('customers_has_watermeters')
export class CustomerHasWatermeterEntity {
  @PrimaryColumn({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @PrimaryColumn({ name: 'watermeter_id', type: 'uuid' })
  watermeterId: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'createdBy', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => CustomerEntity, (watermeter) => watermeter.hasWatermeters)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @ManyToOne(() => WatermeterEntity, (watermeter) => watermeter.hasCustomers)
  @JoinColumn({ name: 'watermeter_id' })
  watermeter: WatermeterEntity;
}
