import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";

import { PrismaService } from "~/modules/prisma/services/prisma.service";

import { HashingService } from "../../auth/hashing/hashing.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateHandlesDto } from "../dto/update-handles.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly usersRepository: UsersRepository
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // convert plain password into hash
    const hashedPassword = await this.hashingService.hash(
      createUserDto.password
    );
    // create user
    return this.usersRepository.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        username: createUserDto.username.toLowerCase()
      }
    });
  }

  async getUsers() {
    return this.usersRepository.getAll();
  }

  async getUser(username: string) {
    // convert username into lowercase
    username = username.toLowerCase();
    const user = await this.usersRepository.getByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }

  async updateUser(username: string, updateUserDto: UpdateUserDto) {
    username = username.toLowerCase();
    const user = await this.usersRepository.getByUsername(username);

    if (!user) {
      throw new NotFoundException();
    }

    // for password reset
    let hashedPassword = user.password;
    const { currentPassword, newPassword, ...rest } = updateUserDto;
    if (currentPassword && newPassword) {
      const isEqual = await this.hashingService.compare(
        currentPassword,
        user.password
      );
      if (!isEqual) {
        throw new UnauthorizedException("Invalid current password!");
      }
      hashedPassword = await this.hashingService.hash(newPassword);
    }

    const updatedUser = await this.usersRepository.update({
      where: { username },
      data: {
        ...rest,
        password: hashedPassword
      }
    });
    delete updatedUser.password;
    return updatedUser;
  }

  async getUserHandles(username: string) {
    username = username.toLowerCase();
    const user = await this.usersRepository.getByUsername(username);
    return this.prisma.userHandle.findMany({
      where: { userId: user.id },
      select: { handle: true, type: true }
    });
  }

  async updateUserHandles(
    username: string,
    updateHandlesDto: UpdateHandlesDto
  ) {
    username = username.toLowerCase();
    const user = await this.usersRepository.getByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    await this.prisma.userHandle.deleteMany({ where: { userId: user.id } });
    const result = await this.prisma.userHandle.createMany({
      data: updateHandlesDto.handles
        .filter((el) => el.handle.length > 0)
        .map((el) => ({
          ...el,
          userId: user.id
        }))
    });
    return result;
  }
}