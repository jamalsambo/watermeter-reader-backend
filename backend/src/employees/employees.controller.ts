/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { CreateEmployeeHasZoneDto } from './dto/create-employee-has-zone.dto';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Post('add-zones')
  async addZones(@Body() dto: CreateEmployeeHasZoneDto) {
    return this.employeesService.addZonesToEmployee(dto);
  }

  @Get('positions')
  async findPositions() {
    return this.employeesService.findPositions();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.employeesService.findOneOrFail({ id });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.employeesService.remove(id);
  }
  @Delete('remove-zones/:employeeId/:zoneId')
  async removeZones(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Param('zoneId', new ParseUUIDPipe()) zoneId: string,
  ) {
    return this.employeesService.removeZonesFromEmployee(employeeId, zoneId);
  }
}
