import { HttpException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/User.schema';

const fakeUser = [
  {
    id: 1,
    username: 'admin',
    password: '111',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // validateUser({ username, password }: AuthPayloadDto) {

  //   console.log({ username, password })
  //   const findUser = fakeUser.find((user) => user.username === username);
  //   console.log("findUser", findUser)
  //   if (!findUser) return null;
  //   if (password === findUser.password) {
  //     const { password, ...user } = findUser;
  //     return this.jwtService.sign(user);
  //   }
  // }

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser: User = await this.usersService.findByUsername(username);
    console.log("findUser", findUser)
    if (!findUser) return null;
    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }
    return null;
  }

}
