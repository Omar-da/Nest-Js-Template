import { UserType } from "./enums"

export type AccessTokenType = {
    accessToken: string
}

export type JwtPayloadType = {
    id: number,
    role: UserType
}