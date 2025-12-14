import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'John Smith', description: 'Name of the client' })
  clientName: string;

  @Column()
  @ApiProperty({ example: 'United States', description: 'Country of the client' })
  clientCountry: string;

  @Column('float')
  @ApiProperty({ example: 4.9, description: 'Client rating (0-5)' })
  clientRating: number;

  @Column('text')
  @ApiProperty({ description: 'Full job description' })
  jobDescription: string;

  @Column()
  @ApiProperty({ enum: ['verified', 'pending', 'not-verified'], example: 'verified' })
  paymentVerificationStatus: string; 

  @Column('text')
  @ApiProperty({ description: 'The proposal written for the job' })
  proposalWriting: string;

  // Changed to 'json' type which uses MySQL's native JSON type (large storage)
  // This solves the "Data too long" issue and is cleaner than simple-json + longtext
  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    description: 'List of file attachments',
    required: false,
    example: [{ id: '1', name: 'resume.pdf', size: 1024, type: 'application/pdf', data: 'base64...' }]
  })
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
  }>;

  @Column({ nullable: true })
  @ApiProperty({ required: false, description: 'Whether the client has replied' })
  hasReply: boolean;

  @Column({ nullable: true })
  @ApiProperty({ required: false, description: 'Date of the reply' })
  replyDate: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, description: 'Content of the reply' })
  replyMessage: string;

  @ManyToOne(() => Account, (account) => account.jobs, { onDelete: 'CASCADE' })
  account: Account;
}
