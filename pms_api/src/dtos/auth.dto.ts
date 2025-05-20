import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsNumber, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class LoginDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDTO {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message: 'Password must have at least 6 characters, one symbol, one number, and one uppercase letter.',
    })
    password: string;
}

export class InitiateResetPasswordDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

}

//Used to reset a password after verifying an OTP/code.
export class InitiateVerifyEmailDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

}

export class ResetPasswordDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message: 'Password must have at least 6 characters, one symbol, one number, and one uppercase letter.',
    })
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    code: string;

}