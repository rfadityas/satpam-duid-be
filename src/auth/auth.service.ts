import { Injectable, UnauthorizedException, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto, GoogleAuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, private prisma: DatabaseService) {}

    async login(dto: AuthDto): Promise<any> {
        const user = await this.userService.findEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (await compare(dto.password, user.password)) {
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

    async googleOAuth(dto: GoogleAuthDto): Promise<any> {
        const user = await this.userService.findEmail(dto.email);

        if (!user) {
            const newUser = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    active: true,
                    provider: 'Google',
                }
            })
            
            const payload = { email: newUser.email, id: newUser.id };

            const accessToken = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET, 
                expiresIn: '1d',
            });

            return {
                ...newUser,
                access_token: accessToken,
            };
        }

        const payload = { email: user.email, id: user.id };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET, 
            expiresIn: '1d',
        });

        return {
            ...user,
            access_token: accessToken,
        };

    }

}
