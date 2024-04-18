import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import {User} from "../../users/entities/user.entity";
import {Equipment} from "../../equipment/entities/equipment.entity";


@Entity()
export class GameCharacter {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.gameCharacters, { onDelete: 'CASCADE' })
    user: User;

    @Column({ nullable: false })
    health: number;

    @Column({ nullable: false })
    hunger: number;

    @Column({ nullable: false, default: 0 })
    experience: number;

    @Column({ nullable: false, default: 1 })
    characterLevel: number;

    @Column({ nullable: false })
    strength: number;

    @Column({ nullable: false })
    agility: number;

    @Column({ nullable: false })
    dexterity: number;

    @Column({ nullable: false })
    defense: number;

    @Column({ nullable: false, default: 0 })
    positionX: number;

    @Column({ nullable: false, default: 0 })
    positionY: number;

    @Column({ nullable: false, default: 0 })
    currentFloor: number;

    @OneToMany(() => Equipment, equipment => equipment.gameCharacter, { cascade: true })
    equipments: Equipment[];
}
