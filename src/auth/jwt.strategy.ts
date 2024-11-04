import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                  const token = req.cookies['access_token']; 
                  return token || null; 
                },
              ]),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {

        const {email} = payload;

        const user = await this.userService.findEmail(email);

        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint.');
        }

        const {password, ...dataUser} = user;

        return dataUser;
    }
}