import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Role } from "../entity/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleRepository extends Repository<Role>{

  constructor( 
    @InjectRepository(Role) 
    private roleRepository: Repository<Role>
  ){
    super(
      roleRepository.target,
      roleRepository.manager,
      roleRepository.queryRunner,
    );
  }

}