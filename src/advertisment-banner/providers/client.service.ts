

import { Client } from "#entity/advertisement_banner/client.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}
}