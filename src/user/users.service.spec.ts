import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserRepository } from "./repository/user.repository";
import { RoleRepository } from "./repository/role.repository";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { User } from "./entity/user.entity";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { validRoleId } from "./entity/role.entity";
import * as bcrypt from "bcrypt";
import { UpdateResult } from "typeorm";
import { UserError } from "../utils/constants/errors.constant";

// testing
describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;

  // defining the mock repository
  const mockUserRepository = {
    getAllSubAdmins: jest.fn(),
    findUser: jest.fn(),
    addUser: jest.fn(),
    updateUser: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockRoleRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        // providing mock Repository
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
  });

  // testing that the service itself is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // testing getAllSubAdmins service method
  describe('getAllSubAdmins', () => {

    // test case
    it('should return an array of subAdmins', async () => {
      const users: User[] = [
        {
          id: "245",
          isActive: true,
          firstName: 'nitish',
          lastName: 'rawat',
          username: 'nitish',
          email: 'nitish@example.com',
          contact: '1234567890',
          password: 'abc',
          createdAt: new Date(),
          deletedAt: null,
          roleId: validRoleId.subAdmin,
        },
      ];

      mockUserRepository.getAllSubAdmins.mockResolvedValue(users);

      const result = await service.getAllSubAdmins();
      expect(result).toBe(users);
      expect(mockUserRepository.getAllSubAdmins).toHaveBeenCalled();
    });

    // test case
    it('should throw an error when database operation fails', async () => {
      mockUserRepository.getAllSubAdmins.mockRejectedValue(new Error());

      await expect(service.getAllSubAdmins()).rejects.toThrow();
    });
  });

  // testing getUser service
  describe('getUser', () => {

    // test case
    it('should return a user when found', async () => {
      const user: User = {
        id: "123",
        isActive: true,
        firstName: 'abhishek',
        lastName: 'singh',
        username: 'abhishek',
        email: 'abhishek@example.com',
        contact: '1234567890',
        password: 'xyz',
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.admin,
      };

      mockUserRepository.findUser.mockResolvedValue(user);

      const result = await service.getUser('abhishek');
      expect(result).toBe(user);
    });

    // test case
    it('should throw an error when user is not found', async () => {
      mockUserRepository.findUser.mockRejectedValue(new Error());

      await expect(service.getUser('nonexistent')).rejects.toThrow();
    });
  });

  // testing getUserIfSubAdmin service
  describe('getUserIfSubAdmin', () => {

    // test case
    it('should return a user if they are a subAdmin', async () => {
      const user: User = {
        id: "123",
        isActive: true,
        firstName: 'subadmin',
        lastName: 'user',
        username: 'subadmin',
        email: 'subadmin@example.com',
        contact: '1234567890',
        password: 'xyz',
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.subAdmin,
      };

      mockUserRepository.findUser.mockResolvedValue(user);

      const result = await service.getUserIfSubAdmin('subadmin');
      expect(result).toBe(user);
    });

    // test case
    it('should throw UnauthorizedException if user is an admin', async () => {
      const adminUser: User = {
        id: "123",
        isActive: true,
        firstName: 'admin',
        lastName: 'user',
        username: 'admin',
        email: 'admin@example.com',
        contact: '1234567890',
        password: 'xyz',
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.admin,
      };

      mockUserRepository.findUser.mockResolvedValue(adminUser);

      await expect(service.getUserIfSubAdmin('admin')).rejects.toThrow(UnauthorizedException);
    });
  });

  // testing addNewUser service
  describe('addNewUser', () => {

    // test case
    it('should add a new user successfully', async () => {
      const newUserDto: CreateUserDto = {
        roleId: 2,
        isActive: true,
        firstName: 'New',
        lastName: 'User',
        username: 'newuser',
        email: 'newuser@example.com',
        contact: '1234567890',
        password: 'password123',
      };

      const savedUser: User = {
        ...newUserDto,
        id: '789',
        isActive: true,
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.subAdmin,
        password: 'hashedPassword',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserRepository.addUser.mockResolvedValue(savedUser);

      const result = await service.addNewUser(newUserDto);
      expect(result).toEqual(savedUser);
      expect(mockUserRepository.addUser).toHaveBeenCalledWith({
        ...newUserDto,
        roleId: validRoleId.subAdmin,
        pass: 'hashedPassword',
      });
    });
  });


  // testing the updateUser service
  describe('updateUser', () => {

    // test case
    it('should update a user successfully', async () => {

      // mocking
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
      };

      const updatedUser: User = {
        id: '123',
        isActive: true,
        firstName: 'Updated',
        lastName: 'User',
        username: 'existinguser',
        email: 'existinguser@example.com',
        contact: '1234567890',
        password: 'hashedPassword',
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.subAdmin,
      };

      // mock response from the repository function
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await service.updateUser('existinguser', updateUserDto);
      expect(result).toBe(updatedUser);
    });

    // test case
    it('should throw an error when update fails', async () => {
      mockUserRepository.updateUser.mockRejectedValue(new Error());

      await expect(service.updateUser('existinguser', {})).rejects.toThrow();
    });
  });


  // testing the deleteUser service
  describe('deleteUser', () => {

    // test case
    it('should soft delete a user successfully', async () => {

      // mocking
      const user: User = {
        id: '123',
        isActive: true,
        firstName: 'To',
        lastName: 'Delete',
        username: 'todelete',
        email: 'todelete@example.com',
        contact: '1234567890',
        password: 'hashedPassword',
        createdAt: new Date(),
        deletedAt: null,
        roleId: validRoleId.subAdmin,
      };
      // mock UpdateResult response Object
      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };

      mockUserRepository.findUser.mockResolvedValue(user);
      mockUserRepository.softDelete.mockResolvedValue(updateResult);

      const result = await service.deleteUser('todelete');
      expect(result).toEqual(updateResult);
    });

    // test case
    it('should throw an error when user is not found', async () => {

      // mocking
      mockUserRepository.findUser.mockRejectedValue(new BadRequestException(UserError.USER_NOT_FOUND));

      await expect(service.deleteUser('nonexistent')).rejects.toThrow(new BadRequestException(UserError.USER_NOT_FOUND));
    });
  });
});