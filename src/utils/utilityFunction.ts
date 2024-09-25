import { plainToClass, plainToInstance } from "class-transformer";
import { User } from "../user/entity/user.entity";
import { StandardResponse } from "./types";
import { SafeTransferUserDto } from "../user/dto/user.dto";

export function standardizeResponse(statusCode: number,  message: string, response: any): StandardResponse{
  
  if(response instanceof User){
    console.log(response)
    response = plainToInstance(SafeTransferUserDto, response);
    console.log(response)
  }
  
  return {
    status: statusCode,
    success: true,
    response: response,
    message: message,
  } as StandardResponse;
}

export function standardizeErrorResponse(error: Error ): StandardResponse{

  return{
    // status: [error.name],
    success: false,
    message: error.message,
  } as StandardResponse;
}