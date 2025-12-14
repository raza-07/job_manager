import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<any> {
    // We call authService.validateUser which now throws specific exceptions
    // if email is invalid or password is wrong.
    // Passport will catch these and return them.
    return await this.authService.validateUser(email, pass);
  }
}
