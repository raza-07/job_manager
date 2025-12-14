import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { JobsModule } from './jobs/jobs.module';
import { User } from './users/entities/user.entity';
import { Account } from './accounts/entities/account.entity';
import { Job } from './jobs/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'americA123$',
      database: 'job_manager',
      entities: [User, Account, Job],
      synchronize: false, // Disabled for migrations
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true, // Run migrations automatically on startup
    }),
    UsersModule,
    AuthModule,
    AccountsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
