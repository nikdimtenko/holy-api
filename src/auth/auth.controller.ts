import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { UserEmail } from '../decorators/user-email.decorator';
import { JwtAuthGuard } from './guards/jst.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this.authService.validateUser(login, password);
    return this.authService.login(email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteUser')
  async deleteUser(@UserEmail() email: string) {
    return this.authService.deleteUser(email);
  }
}
