import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private accountsService: AccountsService,
  ) {}

  async create(accountId: number, createJobDto: CreateJobDto, userId: number): Promise<Job> {
    const account = await this.accountsService.findOne(accountId, userId);
    const job = this.jobsRepository.create({
      ...createJobDto,
      account: account,
    });
    return this.jobsRepository.save(job);
  }

  async findAllByAccount(accountId: number, userId: number): Promise<Job[]> {
    // Verify account access
    await this.accountsService.findOne(accountId, userId);
    
    return this.jobsRepository.find({
      where: { account: { id: accountId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['account', 'account.user'],
    });

    if (!job || job.account.user.id !== userId) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto, userId: number): Promise<Job> {
    const job = await this.findOne(id, userId);
    this.jobsRepository.merge(job, updateJobDto);
    return this.jobsRepository.save(job);
  }

  async remove(id: number, userId: number): Promise<void> {
    const job = await this.findOne(id, userId);
    await this.jobsRepository.remove(job);
  }
}
