import { HttpException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/User.schema';
import * as bcrypt from 'bcrypt';

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


  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser: User = await this.usersService.findByUsername(username);
    if (!findUser) return null;

    const passwordValid = await bcrypt.compare(password, findUser.password);
    if (passwordValid) {
      const { password, ...user } = findUser.toObject();
      return this.jwtService.sign(user);
    }
    return null;
  }


}
