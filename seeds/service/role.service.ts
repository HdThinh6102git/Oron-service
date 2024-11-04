import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../src/entity/user/role.entity';

@Injectable()
export class RoleSeedService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async seedRoles() {
        const roles = [
            { role_name: 'USER', status: 'ACTIVE' },
            { role_name: 'ADMIN', status: 'ACTIVE' },
        ];

        await this.roleRepository.save(roles);
        console.log('Roles have been seeded successfully.');
    }
}