import { InjectRepository } from "@nestjs/typeorm";
import { AccessTokenType, JwtPayloadType } from "./utils/types";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepoistory: Repository<User>,
        private jwtService: JwtService,

    ) { }
    
    async register(body: RegisterDto): Promise<AccessTokenType> {
        const [email, password] = [body.email, body.password];
        const user = await this.userRepoistory.findOne({ where: { email: email } })
        if (user) throw new BadRequestException("User is already existed");

        let newUser = await this.userRepoistory.create({
            email,
            password
        });

        newUser = await this.userRepoistory.save(newUser)

        const accessToken = await this.generateJwt({ id: newUser.id, role: newUser.role });
        
        return { accessToken }; 
    }

    async login(body: LoginDto): Promise<AccessTokenType> {
        const [email, password] = [body.email, body.password];
        const user = await this.userRepoistory.findOne({ where: { email: email } })
        if (!user) throw new BadRequestException("Invalid Email or password")
        
        if (!bcrypt.compare(password, user.password)) throw new BadRequestException("Invalid Email or password")
        
        const accessToken = await this.generateJwt({ id: user.id, role: user.role })
        
        return { accessToken }
    }

    async getUser(id: number): Promise<User> {
        
        const user = await this.userRepoistory.findOne({ where: { "id": id } })
        if(!user) throw new NotFoundException("User Not Found")
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepoistory.find();
    }

    private async generateJwt(payload: JwtPayloadType): Promise<string> {
        return await this.jwtService.signAsync(payload)
    }
}