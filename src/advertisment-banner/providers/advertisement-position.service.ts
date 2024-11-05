
import { AdvertismentPosition } from "#entity/advertisement_banner/advertisement-position.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AdvertisementPositionService {
  constructor(
    @InjectRepository(AdvertismentPosition)
    private advertisementPositionRepo: Repository<AdvertismentPosition>,
  ) {}
}