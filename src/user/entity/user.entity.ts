import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role, validRoleId } from "./role.entity";

// default is
// varchar(255) for strings
// and integer for number
@Entity('user')
export class User{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Role, role => role.id)
  @JoinColumn({ name: 'roleId', })
  @Column({
    nullable: false,
  })
  roleId: number;

  @Column({
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 20,
    nullable: false,
  })
  lastName: string;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
  })  
  username: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    length: 13,
    nullable: true,
  })
  contact: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}