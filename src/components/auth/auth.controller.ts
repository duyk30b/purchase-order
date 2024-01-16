import { AuthServiceInterface } from './interface/auth.service.interface';
import { Controller, Inject } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}
}
