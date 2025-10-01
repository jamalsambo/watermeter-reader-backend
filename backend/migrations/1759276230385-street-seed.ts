/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class StreetSeed1759276230385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO zones (id, name, district_id)
        VALUES
        ('1b737cb6-8c40-489a-a994-884d4119b440', 'Sinacura', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b441', 'Brandão', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b442', 'Chuabo Dembe', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b443', 'Aeroporto', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b444', 'Bairro Popular', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),

        ('1b737cb6-8c40-489a-a994-884d4119b445', '1 de Maio', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b446', '3 de Fevereiro', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b447', 'Bairro Cansa', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b448', 'Floresta A', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b449', 'Floresta B', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),

        ('1b737cb6-8c40-489a-a994-884d4119b450', 'Mapiazua', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b451', 'Torone Novo', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b452', 'Torone Velho', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b453', 'Cherangano', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b454', 'Avenida Maputo', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),

        ('1b737cb6-8c40-489a-a994-884d4119b455', 'Vila Pita', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b456', 'Saguar', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b457', 'Samugue', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b458', 'Sampene', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b459', 'Coloco', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42'),
        ('1b737cb6-8c40-489a-a994-884d4119b459', 'Sicoco', 'd8b974a3-3cab-4475-a78c-f7a576bf2a42')
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
