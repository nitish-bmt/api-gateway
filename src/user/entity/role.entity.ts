import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('role')
export class Role{

  @PrimaryGeneratedColumn()
  @OneToMany(()=>User, user=>user.id)
  @JoinColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  role: validRoleType;
}

export enum validRoleType{
  admin = "ADMIN",
  subAdmin = "SUB ADMIN",
}

export enum validRoleId{
  admin = 1,
  subAdmin,
}
