import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {GameCharacter} from "../../game-characters/entities/game-characters.entity";
import {EquipmentType} from "../../enums/equipment-type.enum";


@Entity()
export class Equipment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => GameCharacter, gameCharacter => gameCharacter.equipments, { onDelete: 'CASCADE' })
    gameCharacter: GameCharacter;

    @Column({ nullable: false })
    type: EquipmentType;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    strengthRequirement: number;

    @Column({ nullable: false })
    attackValue: number;

    @Column({ nullable: false })
    defenseValue: number;

    @Column({ nullable: false })
    agilityBoost: number;
}
