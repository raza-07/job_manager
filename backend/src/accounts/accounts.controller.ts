import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.', type: Account })
  create(@Body() createAccountDto: CreateAccountDto, @Request() req) {
    return this.accountsService.create(createAccountDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for current user' })
  @ApiResponse({ status: 200, description: 'List of accounts.', type: [Account] })
  findAll(@Request() req) {
    return this.accountsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'The account.', type: Account })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.accountsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'The updated account.', type: Account })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAccountDto: UpdateAccountDto, @Request() req) {
    return this.accountsService.update(id, updateAccountDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.accountsService.remove(id, req.user.userId);
  }
}
