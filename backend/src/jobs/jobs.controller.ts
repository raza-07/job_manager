import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('accounts/:accountId/jobs')
  @ApiOperation({ summary: 'Create a new job for an account' })
  @ApiResponse({ status: 201, description: 'The job has been successfully created.', type: Job })
  create(@Param('accountId', ParseIntPipe) accountId: number, @Body() createJobDto: CreateJobDto, @Request() req) {
    return this.jobsService.create(accountId, createJobDto, req.user.userId);
  }

  @Get('accounts/:accountId/jobs')
  @ApiOperation({ summary: 'Get all jobs for an account' })
  @ApiResponse({ status: 200, description: 'List of jobs.', type: [Job] })
  findAll(@Param('accountId', ParseIntPipe) accountId: number, @Request() req) {
    return this.jobsService.findAllByAccount(accountId, req.user.userId);
  }

  @Get('accounts/:accountId/jobs/:jobId')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, description: 'The job.', type: Job })
  findOne(@Param('jobId', ParseIntPipe) jobId: number, @Request() req) {
    return this.jobsService.findOne(jobId, req.user.userId);
  }

  @Patch('accounts/:accountId/jobs/:jobId')
  @ApiOperation({ summary: 'Update job' })
  @ApiResponse({ status: 200, description: 'The updated job.', type: Job })
  update(@Param('jobId', ParseIntPipe) jobId: number, @Body() updateJobDto: UpdateJobDto, @Request() req) {
    return this.jobsService.update(jobId, updateJobDto, req.user.userId);
  }

  @Delete('accounts/:accountId/jobs/:jobId')
  @ApiOperation({ summary: 'Delete job' })
  @ApiResponse({ status: 200, description: 'Job deleted.' })
  remove(@Param('jobId', ParseIntPipe) jobId: number, @Request() req) {
    return this.jobsService.remove(jobId, req.user.userId);
  }
}
