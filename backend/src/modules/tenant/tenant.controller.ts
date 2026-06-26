import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './entities/tenant.entity';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tenant> {
    return this.tenantService.findById(id);
  }

  @Post()
  create(@Body() body: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.tenantService.remove(id);
  }
}
