import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Public, Roles } from '../utils/customDecorator/custom.decorator';
import { CreateUserDto, SafeTransferUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { userEmbeddedRequest } from '../utils/types';
import { User } from './entity/user.entity';
import { standardizeErrorResponse, standardizeResponse } from '../utils/utilityFunction';
import { StatusCodes } from '../utils/constants/statusCodes.constant';
import { UpdateResult } from 'typeorm';
import { validRoleId, validRoleType } from './entity/role.entity';
import { UserSuccess } from '../utils/constants/success.constant';

// Controller for handling user-related operations
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("register")
  async addNewUser(@Body() userToBeCreated: CreateUserDto) {
    
    // Attempt to create a new user and handle potential errors
    let response: User;
    try{
      response = await this.userService.addNewUser(userToBeCreated);
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(HttpStatus.CREATED, UserSuccess.USER_CREATED, response);
  }

  // Get all users (Admin only)
  @Roles(validRoleId.admin)
  @Get()
  async getAllUsers() {
    // Retrieve all sub-admin users and convert to safe transfer DTOs
    let users: User[];
    let result: SafeTransferUserDto[];

    try{
      users = await this.userService.getAllSubAdmins();
      result = users.map(user=>this.userService.userEntityToShareableDto(user));
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(HttpStatus.OK, UserSuccess.FETCHED_USER_LIST, result);
  }
  
  // Get details of the authenticated user
  @Roles(validRoleId.admin, validRoleId.subAdmin)
  @Get('details')
  async getOwnDetials(@Req() req: userEmbeddedRequest) {

    // Retrieve and return the authenticated user's details
    let user: User;
    let result: SafeTransferUserDto;
    try{
      user = (await this.userService.getUser( req.user.username ));
      result = this.userService.userEntityToShareableDto(user);
    }
    catch(error){
      standardizeErrorResponse(error);
    }
    return standardizeResponse(HttpStatus.OK, UserSuccess.FETCHED_USER, result);
  }

  // Get details of a specific user by username (Admin only)
  @Roles(validRoleId.admin)
  @Get('details/:username')
  async getUser(@Param('username') username: string) {
    // Retrieve and return details of a specific user
    let user: User;
    try{
      user =  await this.userService.getUserIfSubAdmin(username);
    }
    catch(error){
      standardizeErrorResponse(error);
    }
    const result: SafeTransferUserDto = this.userService.userEntityToShareableDto(user);
    return standardizeResponse(HttpStatus.OK, UserSuccess.FETCHED_USER, result);
  }

  // Deactivate a specific user's account (Admin only)
  @Roles(validRoleId.admin)
  @Patch("deactivate/:username")
  async deactivateUser(@Param('username') username: string){
    // Deactivate a specific user's account
    let deactivatedUser: User;
    try{
      deactivatedUser = await this.userService.updateUser(username, {isActive: false} as UpdateUserDto)
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(StatusCodes.UPDATED, UserSuccess.DEACTIVATED, deactivatedUser)
  }

  // Activate a specific user's account (Admin only)
  @Roles(validRoleId.admin)
  @Patch("activate/:username")
  async activateUser(@Param('username') username: string){
    // Activate a specific user's account
    let activatedUser: User;
    try{
      activatedUser = await this.userService.updateUser(username, {isActive: true} as UpdateUserDto)
    }
    catch(error){
      throw error;
    }

    return standardizeResponse(StatusCodes.UPDATED, UserSuccess.ACTIVATED, activatedUser);
  }

  
  // Delete a specific user's account (Admin only)
  @Roles(validRoleId.admin)
  @Delete('delete/:username')
  async deleteUser(@Param('username') username: string) {
    // Delete a specific user's account
    let isUserDeleted: UpdateResult;
    try{
      isUserDeleted = await this.userService.deleteUser(username);
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(StatusCodes.UPDATED, UserSuccess.USER_DELETED, isUserDeleted);
  }

  // Update a specific user's details (Admin only)
  @Roles(validRoleId.admin, validRoleId.subAdmin)
  @Patch('/update/')
  async updateOwnDetails(@Req() req: userEmbeddedRequest, @Body() dataToUpdate: UpdateUserDto){
    // Update a specific user's details
    let updatedUser: User;
    try{
      updatedUser = await this.userService.updateUser(req.user.username, dataToUpdate);
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(StatusCodes.UPDATED, UserSuccess.USER_UPDATED, updatedUser);
  }

  // Update a specific user's details (Admin only)
  @Roles(validRoleId.admin)
  @Patch('/update/:username')
  async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    // Update a specific user's details
    let updatedUser: User;
    try{
      updatedUser = await this.userService.updateUser(username, updateUserDto);
    }
    catch(error){
      throw error;
    }
    return standardizeResponse(StatusCodes.UPDATED, UserSuccess.USER_UPDATED, updatedUser);
  }
}