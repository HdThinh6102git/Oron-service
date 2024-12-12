import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ClientService } from "@modules/advertisment-banner/providers";
import { JwtAdminAuthGuard } from "@modules/auth/guards";
import { BaseApiResponse, BasePaginationResponse } from "@modules/shared/dtos";
import { ClientFilter, ClientOutput } from "@modules/advertisment-banner/dtos";

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