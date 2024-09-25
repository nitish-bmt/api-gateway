import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import * as bcrypt from "bcrypt";
import { CreateUserDto, SafeTransferUserDto, UpdateUserDto } from "./dto/user.dto";
import { validRoleId } from "./entity/role.entity";
import { User } from "./entity/user.entity";
import { plainToClass, plainToInstance } from "class-transformer";
import { RoleRepository } from "./repository/role.repository";
import { UpdateResult } from "typeorm";
import { AuthError, ErrorMessages, UserError, ValidationErrorMessages } from "../utils/constants/errors.constant";

// User service to handle user-related operations.
@Injectable()
export class UserService {

  // injecting the repositories
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ){}

  // Convert a user entity to a shareable DTO.
  userEntityToShareableDto(user: User): SafeTransferUserDto{
    return plainToClass(SafeTransferUserDto, {...user, role: validRoleId[user.roleId]});
  }

  // Get all sub-admin users.
  async getAllSubAdmins(): Promise<User[]>{
    try {
      // Attempt to retrieve all sub-admin users from the repository.
      return await this.userRepository.getAllSubAdmins();
    } catch (error) {
      // If an error occurs, rethrow it to be handled by the caller.
      throw error;
    }
  }

  // Get a user by username.
  async getUser(username: string): Promise<User>{
    try {
      // Attempt to find a user by username in the repository.
      return (await this.userRepository.findUser(username));    
    } catch (error) {
      // If an error occurs, rethrow it to be handled by the caller.
      throw error;
    }
  }

  // Get a user by username if they are a sub-admin.
  async getUserIfSubAdmin(username: string): Promise<User|null>{
    let user: User;
    try {
      // Attempt to find a user by username in the repository.
      user = await this.userRepository.findUser(username);
    } catch (error) {
      // If an error occurs, rethrow it to be handled by the caller.
      throw error;
    }

    // Check if the user is an admin and throw an unauthorized exception if so.
    if(user.roleId == validRoleId.admin){
      throw new UnauthorizedException(UserError.ADMIN_PRIVACY)
    }

    // Return the user if they are a sub-admin.
    return user;
  }

  // Add a new user.
  async addNewUser(newUserData: CreateUserDto): Promise<User>{
    // Set the default role to sub-admin if not provided.
    newUserData.roleId = newUserData.roleId ? ( newUserData.roleId) : (validRoleId.subAdmin);

    try {
      // Attempt to hash the user's password.
      newUserData.password = await bcrypt.hash(newUserData.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      // If an error occurs during hashing, throw an internal server error.
      throw new InternalServerErrorException(ErrorMessages.ENCRYPTION_ERROR);
    }

    let newUser: User;
    try {
      // Attempt to add the new user to the repository.
      newUser = await this.userRepository.addUser(newUserData);
    } catch (error) {
      // If an error occurs during addition, throw a database write failure error.
      throw new BadRequestException(error.message);
    }

    // Return the newly added user.
    return newUser;
  }
  
  // Update a user.
  async updateUser(username: string, dataToUpdate: UpdateUserDto) {
    
    let updatedUser: User;
    try {
      // Attempt to update the user in the repository.
      updatedUser = await this.userRepository.updateUser(username, dataToUpdate);
    } 
    catch (error) {
      // If an error occurs, rethrow it to be handled by the caller.
      throw error;
    }

    // Return the updated user.
    return updatedUser;
  }

  // Delete a user.
  async deleteUser(username: string): Promise<UpdateResult>{

    let user: User;
    try {
      // Attempt to find the user to delete in the repository.
      user = await this.userRepository.findUser(username);
    } catch (error) {
      // If an error occurs, rethrow it to be handled by the caller.
      throw error;
    }

    let deletionResult: UpdateResult;
    try {
      // Attempt to soft delete the user in the repository.
      deletionResult = (await this.userRepository.softDelete(user.id));

    } catch (error) {
      // Log any errors that occur during deletion.
      console.log(error)
    }

    // Return the result of the deletion operation.
    return deletionResult;
  }

  // FOR AUTH SERVICE
  // Authenticate a user using their username and password.
  async authenticateUser(username: string, password: string): Promise<User> {
    let user: User;

    // Attempt to find the user by their username.
    try {
      user = await this.userRepository.findUser(username);
    } catch (error) {
      // If the user is not found, re-throw the error.
      throw error;
    }

    // Attempt to compare the provided password with the stored password.
    try {
      const isMatching: boolean = await bcrypt.compare(password, user.password);

      // If the passwords do not match, throw an unauthorized exception.
      if (!isMatching) {
        throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS);
      }
    } 
    catch (error) {
      // If an error occurs during password comparison, check if it's an unauthorized exception.
      if (error instanceof UnauthorizedException) {
        // If it's an unauthorized exception, re-throw it.
        throw error;
      } else {
        // If it's not an unauthorized exception, throw an internal server error.
        throw new InternalServerErrorException(ErrorMessages.ENCRYPTION_ERROR);
      }
    }

    // If authentication is successful, return the user instance.
    return user;
  }
}