import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ClientService } from "../providers";
import { JwtAdminAuthGuard } from "src/auth/guards";
import { BasePaginationResponse } from "src/shared/dtos";
import { ClientFilter, ClientOutput } from "../dtos";

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('filter')
  @UseGuards(JwtAdminAuthGuard)
  public async getClients(
    @Query() query: ClientFilter,
  ): Promise<BasePaginationResponse<ClientOutput>> {
    return this.clientService.getClients(query);
  }
}