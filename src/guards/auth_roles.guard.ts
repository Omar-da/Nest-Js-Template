import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayloadType } from "src/user/utils/types";

@Injectable()
export class AuthRolesGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }
    
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
        if (!roles || roles.length == 0) return false;

        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ")?? [];
        if (type === "Bearer" && token)
            try {
                const payload: JwtPayloadType = await this.jwtService.verifyAsync(token, { secret: this.configService.get("JWT_SECRET") })
                if (roles.includes(payload.role))
                {
                    request["CURRENT_USER"] = payload;
                    return true;
                }
                return false;
            }
            catch (error) {
                throw new UnauthorizedException("access denied, invalid token");
            }
        else
            throw new UnauthorizedException("access denied, no token provided");
    }
}