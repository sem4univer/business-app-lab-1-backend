import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AuthEventType } from '../auth-event/entities/auth-event.entity';

export class UpdateAuthEventDto {
  @ApiProperty()
  eventType?: AuthEventType;

  @ApiProperty()
  isError?: boolean;

  @ApiProperty()
  errorMessage?: string;
}
