import { Body, Controller, Post, Get, UseGuards, Req, Res, Query, UnauthorizedException, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService, private userService: UserService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res({passthrough: true}) response: Response) {
        const login = await this.authService.googleOAuth(req.user);

        response.cookie('access_token', login.access_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // redirect to frontend
        response.redirect('http://localhost:3000');
    }

    @Post('login')
    async login(
        @Body() dto: AuthDto,
        @Res({passthrough: true}) response: Response
    ) {
        const login = await this.authService.login(dto);

        response.cookie('access_token', login.data.access_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return login;
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['access_token'];

            const data = await this.jwtService.verifyAsync(cookie, {
                secret: process.env.JWT_SECRET,
            });

            if(!data) {
                throw new UnauthorizedException();
            }

            const user = await this.userService.findEmail(data['email']);

            const {password, ...dataUser } = user

            return dataUser;
        } catch (e) {
            throw new UnauthorizedException('sadas');
        }
    }


    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          });
        return { message: 'success' };
    }
}
