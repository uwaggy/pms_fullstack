import { IsString, IsNumber, IsNotEmpty, Min, MinLength, MaxLength } from "class-validator";

export class CreateParkingSlotDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  code: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  totalSpaces: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  chargingFee: number;
}

export class UpdateParkingSlotDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  totalSpaces: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  chargingFee: number;
}
