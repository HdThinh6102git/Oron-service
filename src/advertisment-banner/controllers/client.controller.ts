import { Controller } from "@nestjs/common";
import { ClientService } from "../providers";

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}
}