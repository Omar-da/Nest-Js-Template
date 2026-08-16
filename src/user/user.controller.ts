import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessTokenType } from "./utils/types";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "./entities/user.entity";
import { Roles } from "./decorators/user_role.decorator";
import { UserType } from "./utils/enums";
import { AuthRolesGuard } from "src/guards/auth_roles.guard";

@Controller("/users")
export class UserController{
    constructor(public userService: UserService) { }
    
    @Post("register")
    register(@Body() body: RegisterDto): Promise<AccessTokenType> {
        return this.userService.register(body);
    }

    @Post("login")
    login(@Body() body: LoginDto): Promise<AccessTokenType> {
        return this.userService.login(body);
    }

    @Get("get_current_user")
    @UseGuards(AuthGuard)
    getUser(@Req() req: Request): Promise<User> {
        const payload = req["CURRENT_USER"];
        return this.userService.getUser(payload.id);
    }

    @Get("get_all_users")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

}