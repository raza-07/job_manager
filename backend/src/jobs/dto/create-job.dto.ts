import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Acme Corp', description: 'Client Name' })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @ApiProperty({ example: 'USA', description: 'Client Country' })
  @IsNotEmpty()
  @IsString()
  clientCountry: string;

  @ApiProperty({ example: 5.0, description: 'Client Rating' })
  @IsNotEmpty()
  @IsNumber()
  clientRating: number;

  @ApiProperty({ example: 'Looking for a React developer...', description: 'Job Description' })
  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @ApiProperty({ example: 'verified', description: 'Payment Verification Status' })
  @IsNotEmpty()
  @IsString()
  paymentVerificationStatus: string;

  @ApiProperty({ example: 'I am the best candidate because...', description: 'Proposal text' })
  @IsNotEmpty()
  @IsString()
  proposalWriting: string;

  @ApiProperty({ required: false, description: 'Array of attachments' })
  @IsOptional()
  @IsArray()
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
  }>;

  @ApiProperty({ required: false, description: 'Has the client replied?' })
  @IsOptional()
  @IsBoolean()
  hasReply?: boolean;

  @ApiProperty({ required: false, description: 'Date of reply' })
  @IsOptional()
  @IsString()
  replyDate?: string;

  @ApiProperty({ required: false, description: 'Content of reply' })
  @IsOptional()
  @IsString()
  replyMessage?: string;
}
