// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import { IS_NOT_EMPTY, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches, MaxLength, MinLength, Validate} from "class-validator";
import { OmitType, PartialType } from "@nestjs/swagger"
import { validRoleId, validRoleType } from "../entity/role.entity";
import { Exclude } from "class-transformer";
import { User } from "../entity/user.entity";
import { ValidationErrorMessages } from "../../utils/constants/errors.constant";
import { Unique } from "typeorm";


// data transfer object
export class CreateUserDto{

  @IsOptional()
  roleId: validRoleId;

  @IsOptional()
  isActive: boolean;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: ValidationErrorMessages.STRONG_PASSWORD})
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(Unique, [{table: 'user', column: 'email'}])
  email: string;

  // TODO: mandate formatting(country code is mandatory)
  @IsOptional()
  @IsNumberString()
  @Length(13, 13, {message: ValidationErrorMessages.VALID_PHONE_NUMBER})
  @Matches(/(^[+91])/, {message: ValidationErrorMessages.COUNTRY_CODE_REQUIRED})
  contact: string;
}

// to show data
export class SafeTransferUserDto extends User{
  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date;
}

// data transfer object
export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: ValidationErrorMessages.STRONG_PASSWORD})
  password?: string;

  @IsOptional()
  @Exclude()
  deletedAt?: Date;

  @IsOptional()
  @Exclude()
  roleId?: validRoleId;
}

export class LoginUserDto{
  
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}