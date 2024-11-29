import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/components/admin/admin.service';
import { UserService } from 'src/components/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService,
    private readonly adminService: AdminService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload) {
    const user = await this.userService.getUserById(payload.userId);
    if (!user || payload.refresh) {
      throw new UnauthorizedException();
    }
    return user;
  }
  async validateAdmin(payload) {
    const admin = await this.adminService.getAdminById(payload.adminId);
    if (!admin || payload.refresh) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
