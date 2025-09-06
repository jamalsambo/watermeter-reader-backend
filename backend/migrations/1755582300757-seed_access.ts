/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAccess1755582300757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO user_types (id, name) VALUES
                  ('1c8c35ce-a7ed-40fa-a878-f747fe0e663f', 'Funcionario'),
                  ('8fc33c1e-f6ae-440b-8bd4-051e7fb18b42', 'Facturador'),
                  ('6f4ebc9d-b5d5-4d44-aa5d-098fa45932ee', 'Leitor')        
                  `,
    );

    await queryRunner.query(
      `INSERT INTO provinces (id, name) VALUES  ('cc0830fa-31c1-4d50-b2ec-44284b6bac5a', 'Zambezia')`,
    );
    await queryRunner.query(
      `INSERT INTO districts (id, name, province_id) VALUES  ('4ab6283e-9fbc-4497-b6ce-7de6710272fc', 'Quelimane', 'cc0830fa-31c1-4d50-b2ec-44284b6bac5a')`,
    );

    await queryRunner.query(
      `INSERT INTO delegations (id, name, district_id) VALUES  ('6f4ebc9d-b5d5-4d44-aa5d-098fa45932ee', 'Quelimane','4ab6283e-9fbc-4497-b6ce-7de6710272fc')`,
    );
    await queryRunner.query(
      `INSERT INTO users (id,  display_name,  username, password,phone,user_type_id,delegation_id) VALUES  
                        (uuid_generate_v4(), 'Alfeu Junior', 'al@mail.com','$2b$10$JAhhfuBSSOok7rGUFYJmGuLobG/D51228I9TDkJi7lDmA74M3tmwq','845751142','1c8c35ce-a7ed-40fa-a878-f747fe0e663f','6f4ebc9d-b5d5-4d44-aa5d-098fa45932ee')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> { }
}
