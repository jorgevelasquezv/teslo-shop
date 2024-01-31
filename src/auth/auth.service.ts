import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.repository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.repository.save(user);

      delete user.password;

      return { ...user, token: this.generateJWT({ id: user.id }) };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.repository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    return { ...user, token: this.generateJWT({ id: user.id }) };
  }

  private generateJWT(jwtPayload: JwtPayload): string {
    const token = this.jwtService.sign(jwtPayload);
    return token;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
