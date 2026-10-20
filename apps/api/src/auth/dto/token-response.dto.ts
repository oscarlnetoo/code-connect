import { ApiProperty } from '@nestjs/swagger';
import { JWT_EXPIRES_IN_SECONDS } from '../auth.constants.js';

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ enum: ['Bearer'], example: 'Bearer' })
  tokenType: 'Bearer';

  @ApiProperty({
    example: JWT_EXPIRES_IN_SECONDS,
    description: 'Seconds until the token expires',
  })
  expiresIn: number;
}
