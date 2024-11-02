import { Body, Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res({passthrough: true}) response: Response) {
        const data: AuthDto = {
            email: req.user
        }
        const login = await this.authService.login(data, 'google');

        response.cookie('access_token', login.access_token, {
            httpOnly: true,
        });

        return login;
    }

    @Post('login')
    async login(
        @Body() dto: AuthDto,
        @Res({passthrough: true}) response: Response
    ) {
        const login = await this.authService.login(dto, 'general');

        response.cookie('access_token', login.access_token, {
            httpOnly: true,
        });

        return login;
    }
}
