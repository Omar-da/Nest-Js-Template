import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../utils/enums";
import { Exclude } from "class-transformer";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    email!: string;
    
    @Exclude()
    @Column()
    password!: string;

    @Column({ type: "enum", enum: UserType, default: UserType.NORMAL_USER})
    role!: UserType
}