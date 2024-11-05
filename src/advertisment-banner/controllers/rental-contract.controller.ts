import { Controller } from "@nestjs/common";
import { RentalContractService } from "../providers";


@Controller('rental-contract')
export class RentalContractController {
  constructor(private rentalContractService: RentalContractService) {}
}