import { Injectable, UnauthorizedException, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async login(dto: AuthDto, type: 'google' | 'general'): Promise<any> {
        const user = await this.userService.findEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Handle login by type
        if (type === 'google' || (type === 'general' && await compare(dto.password, user.password))) {
            const { password, ...dataUser } = user;
            const payload = { email: dataUser.email, id: dataUser.id };

            const accessToken = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET, 
                expiresIn: '1d',
            });

            return {
                ...dataUser,
                access_token: accessToken,
            };
        }

        throw new UnauthorizedException('Invalid credentials');
    }

}
