import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('users')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const { name, address, state, phone } = body;
    return this.usersService.updateProfile(req.user.id, { name, address, state, phone });
  }
}
