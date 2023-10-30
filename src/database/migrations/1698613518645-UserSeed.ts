import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Role } from '@users/entities/role.entity';
import { User } from '@users/entities/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class UserSeed1698613518645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userData = readFileSync(join(__dirname, '../files/UserData.csv'));

    /**
     * [RoleName, email, password, firstName, lastName, title, birthday, active]
     */
    const userFileData = parse(userData) as string[][];
    const roles = [...new Set(userFileData.map((userData) => userData[0]))];

    const rolesRepository = queryRunner.connection.manager.getRepository(Role);
    const rolesId = await rolesRepository.manager.find(Role, {
      where: {
        title: In(roles),
      },
    });
    const roleTitleToEntityMap = rolesId.reduce(
      (acc, role) => {
        acc[role.title] = role;
        return acc;
      },
      {} as Record<string, Role>,
    );

    const userRepository = queryRunner.connection.manager.getRepository(User);

    const userEntities: QueryDeepPartialEntity<User>[] = [];

    for (const [
      role,
      email,
      password,
      firstName,
      lastName,
      _, // title
      birthdate,
      active,
    ] of userFileData) {
      const user = new User();
      user.role = roleTitleToEntityMap[role];
      user.email = email;
      user.password = password;
      user.firstName = firstName;
      user.lastName = lastName;
      user.birthdate = new Date(birthdate);
      user.active = Number(active);

      userEntities.push(user);
    }

    userRepository.insert(userEntities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
