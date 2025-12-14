import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'My Upwork Account', description: 'Account name' })
  name: string;

  @Column()
  @ApiProperty({ example: 'john.work@example.com', description: 'Account email' })
  email: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Job, (job) => job.account, { cascade: true })
  jobs: Job[];
}
