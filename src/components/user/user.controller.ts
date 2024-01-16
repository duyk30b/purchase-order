import { Controller, Inject } from '@nestjs/common';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';

@Controller('')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}
}
