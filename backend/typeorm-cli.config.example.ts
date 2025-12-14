import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Account } from './src/accounts/entities/account.entity';
import { Job } from './src/jobs/entities/job.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'YOUR_PASSWORD_HERE', // Update with your MySQL password
  database: 'job_manager',
  entities: [User, Account, Job],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});


