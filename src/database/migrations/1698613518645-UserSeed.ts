import { Office } from './../../users/entities/office.entity';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  In,
  MigrationInterface,
  QueryRunner,
  Entity,
  EntityTarget,
  ObjectType,
  FindOptionsWhereProperty,
  FindOptionsWhere,
} from 'typeorm';
import { parse } from 'csv-parse/sync';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Role } from '../../users/entities/role.entity';
import { User } from '../../users/entities/user.entity';

type Options<T extends { title: string }> = {
  index: number;
  entity: ObjectType<T>;
};

const getUniqueByTitle = async <T extends { title: string }>(
  queryRunner: QueryRunner,
  userFileData: string[][],
  options: Options<T>,
) => {
  const uniqueEntity = [
    ...new Set(userFileData.map((userData) => userData[options.index])),
  ];

  const entityRepository = queryRunner.connection.manager.getRepository(
    options.entity,
  );
  const rolesId = await entityRepository.manager.find(options.entity, {
    where: {
      title: In(uniqueEntity),
    } as FindOptionsWhere<T>,
  });
  const titleToEntityMap = rolesId.reduce(
    (acc, role) => {
      acc[role.title] = role;
      return acc;
    },
    {} as Record<string, T>,
  );

  return titleToEntityMap;
};

export class UserSeed1698613518645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userData = readFileSync(join(__dirname, '../files/UserData.csv'));

    /**
     * [RoleName, email, password, firstName, lastName, officeTitle, birthday, active]
     * Administrator,j.doe@amonic.com,123,John,Doe,Abu dhabi,1/13/1983,1
     */
    const userFileData = parse(userData) as string[][];

    // roles
    const roleTitleToEntityMap = await getUniqueByTitle(
      queryRunner,
      userFileData,
      {
        index: 0,
        entity: Role,
      },
    );
    // offices
    const officeTitleToEntityMap = await getUniqueByTitle(
      queryRunner,
      userFileData,
      {
        index: 5,
        entity: Office,
      },
    );

    const userRepository = queryRunner.connection.manager.getRepository(User);

    const userEntities: QueryDeepPartialEntity<User>[] = [];

    for (const [
      role,
      email,
      password,
      firstName,
      lastName,
      officeTitle,
      birthdate,
      active,
    ] of userFileData) {
      const user = new User();
      user.role = roleTitleToEntityMap[role];
      user.office = officeTitleToEntityMap[officeTitle];
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
