import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {GameCharacter} from "../../game-characters/entities/game-characters.entity";
import {UpdateUserDto} from "../dto/update-user.dto";
import {UserStatus} from "../../enums/user-status.enum";
import {UserRole} from "../../enums/user-role.enum";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    nickname: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, default: UserRole.ROLE_USER })
    role: UserRole;

    @Column({ nullable: false, default: UserStatus.INACTIVE })
    status: UserStatus;

    @OneToMany(() => GameCharacter, gameCharacter => gameCharacter.user, { cascade: true, onDelete: 'CASCADE' })
    gameCharacters: GameCharacter[];

    constructor(username: string, password: string, nickname: string, email: string) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
    }

    update(requestDTO: UpdateUserDto) {
        this.nickname = requestDTO.nickname;
        this.password = requestDTO.newPassword;
        this.email = requestDTO.email;
    }
}
