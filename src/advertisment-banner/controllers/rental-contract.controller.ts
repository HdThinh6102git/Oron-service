import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { RentalContractService } from "@modules/advertisment-banner/providers";
import { JwtAdminAuthGuard } from "@modules/auth/guards";
import { ReqContext, RequestContext } from "@modules/shared/request-context";
import { UpdateRentalContractInput } from "@modules/advertisment-banner/dtos";
import { BaseApiResponseWithoutData } from "@modules/shared/dtos";


@Controller('rental-contract')
export class RentalContractController {
  constructor(private rentalContractService: RentalContractService) {}
  
  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async updateRentalContract(
    @ReqContext() ctx: RequestContext,
    @Param('id') contractId: string,
    @Body() body: UpdateRentalContractInput,
  ): Promise<BaseApiResponseWithoutData> {
    return await this.rentalContractService.updateRentalContract(ctx.user.id, body, contractId);
  }
}