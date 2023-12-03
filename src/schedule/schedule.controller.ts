import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Public } from '../auth/auth.decorators';
import { ScheduleService } from './schedule.service';
import { Roles } from '../auth/role/roles.decorators';
import { RoleName } from '../auth/role/role.enum';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { FilterSchedules } from './dto/filter-schedules.dto';

// @ApiBearerAuth()
@Controller('schedules')
@ApiTags('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Get()
  get(@Query() params: FilterSchedules) {
    return this.scheduleService.findAll(params);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  uploadByCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: {
      buffer: Buffer;
    },
  ) {
    return this.scheduleService.handleCsv(file.buffer);
  }

  @Roles(RoleName.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }
}
