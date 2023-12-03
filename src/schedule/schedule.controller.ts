import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Public } from '../auth/auth.decorators';
import { ScheduleService } from './schedule.service';

// @ApiBearerAuth()
@Controller('schedules')
@ApiTags('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Get()
  get() {
    return this.scheduleService.findAll();
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
}
