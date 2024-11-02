import { IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    email: string;

    @IsString()
    password?: string;
}

export class LoginGoogleDto {
    @IsString()
    email: string;
}