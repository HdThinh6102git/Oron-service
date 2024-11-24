import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ClientService } from "../providers";
import { JwtAdminAuthGuard } from "src/auth/guards";
import { BaseApiResponse, BasePaginationResponse } from "src/shared/dtos";
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

  @Get(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async getClientById(
    @Param('id') clientId: string,
  ): Promise<BaseApiResponse<ClientOutput>> {
    return await this.clientService.getClientById(clientId);
  }
}