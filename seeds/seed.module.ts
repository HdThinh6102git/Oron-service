import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../src/entity/user/role.entity';
import { RoleSeedService } from './service/role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RoleSeedService],
})
export class SeedModule {}