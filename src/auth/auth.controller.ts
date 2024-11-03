import { Body, Controller, Post, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

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
        });

        return login;
    }

    @Post('login')
    async login(
        @Body() dto: AuthDto,
        @Res({passthrough: true}) response: Response
    ) {
        const login = await this.authService.login(dto);

        response.cookie('access_token', login.access_token, {
            httpOnly: true,
        });

        return login;
    }
}
