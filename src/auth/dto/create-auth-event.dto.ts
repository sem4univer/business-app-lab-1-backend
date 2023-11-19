import { ApiProperty } from '@nestjs/swagger';
import {
  AuthEvent,
  AuthEventType,
} from '../auth-event/entities/auth-event.entity';

export class CreateAuthEventDto implements Partial<AuthEvent> {
  @ApiProperty()
  eventType: AuthEventType;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  isError?: boolean;

  @ApiProperty()
  errorMessage?: string;
}
