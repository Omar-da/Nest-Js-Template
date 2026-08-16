import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ){}
    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ")?? [];
        if (type === "Bearer" && token)
            try {
                const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get("JWT_SECRET") })
                request["CURRENT_USER"] = payload;
                return true;
            }
            catch (error) {
                throw new UnauthorizedException("access denied, invalid token");
            }
        else
            throw new UnauthorizedException("access denied, no token provided");

        }
}