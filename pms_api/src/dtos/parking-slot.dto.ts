import { IsNotEmpty, IsString, IsNumber, Min, IsPositive } from 'class-validator';

export class CreateParkingSlotDTO {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    totalSpaces: number;

    @IsNumber()
    @IsPositive()
    chargingFee: number;
}

export class UpdateParkingSlotDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsPositive()
    chargingFee: number;
}

export class ParkingEntryDTO {
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @IsString()
    @IsNotEmpty()
    parkingCode: string;
}

export class ParkingExitDTO {
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @IsString()
    @IsNotEmpty()
    parkingCode: string;
}

export class ParkingReportDTO {
    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsNotEmpty()
    endDate: string;
} 