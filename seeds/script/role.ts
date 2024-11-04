import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../seed.module';
import { RoleSeedService } from '../service/role.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seedService = app.get(RoleSeedService);
    await seedService.seedRoles();
    await app.close();
}

bootstrap()
    .then(() => {
        console.log('Seeding completed.');
    })
    .catch((error) => {
        console.error('Seeding error:', error);
    });
