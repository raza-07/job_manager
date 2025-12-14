import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires: Date | null;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
