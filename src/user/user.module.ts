import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    global: true,
                    secret: configService.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN")
                    }
                }
            }
        })
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }