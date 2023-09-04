import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bycrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const userExist = await this.userService.findByMail(createUserDto.email);
    if (userExist) throw new BadRequestException('Email already used');

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user: User = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    };

    const createdUser = await this.userService.create(user);
    return createdUser;
  }

  async login(loginUserDto: LoginUserDto) {
    // find user by email
    const user = await this.userService.findByMail(loginUserDto.email, true);

    if (!user) throw new BadRequestException('Email not found');

    // compare password
    const psMatch = await this.comparePassword(
      loginUserDto.password,
      user.password,
    );
    if (!psMatch) throw new BadRequestException('Wrong password');

    // generate access_token
    const access_token = this.generateJWT(user);
    return {
      access_token,
    };
  }

  // utils ----------------------------------------------------
  private hashPassword(password: string): Promise<string> {
    const salt = bycrypt.genSaltSync();
    return bycrypt.hash(password, salt);
  }

  private comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bycrypt.compare(password, hashedPassword);
  }

  generateJWT(user: User): string {
    return this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });
  }
}

//? qst : how salt used in hashing , can be get to do the password compare
//? brief : it's stored with the hashed password  ex :
// salt $2b$10$XccETUVeWpZcYho7gH7kLO
// hashed $2b$10$XccETUVeWpZcYho7gH7kLOSy6cHxyKizKwZrDJ8FXgNftUIe/SCJG

// In general, you should not need to manually extract the salt from a hashed password when using a
//  well-implemented password hashing library like `bcrypt`. The salt is stored as part of the hashed
//  password, and the library handles the process of extracting it and using it for password comparison.
// However, if you ever find yourself in a situation where you absolutely need to extract the salt
// from a hashed password (not recommended for normal authentication processes), you would typically
// do so by parsing the hashed password string. The salt is usually stored as part of the hashed ///
// password, separated by a delimiter (commonly "$" in bcrypt).
// Here's an example of how you might manually extract the salt from a bcrypt hashed password:

// const bcrypt = require('bcrypt');
// const hashedPassword = '$2b$12$2ZDFG0MVL1kMN8hW1XdezeR78aEEevkWtPl5T9iYUzTc5I5et.XD6';
// Split the hashed password string by the delimiter ('$' in bcrypt)
// const parts = hashedPassword.split('$');
// The salt is typically the third part of the split string
// const salt = parts[2];
// console.log('Extracted salt:', salt);

// In this example, we're splitting the hashed password string by the "$" delimiter,
// and the salt is typically found as the third part of the resulting array
// However, this method is not recommended for regular use and should only be used for specific
// scenarios where direct access to the salt is required, such as migrating hashed passwords between systems.

// For standard password verification and storage, it's best to rely on the password hashing //
// library's built-in functions for comparing passwords, as they handle salt extraction and comparison securely and efficiently.
