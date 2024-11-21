import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { RentalContractService } from "../providers";
import { JwtAdminAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { UpdateRentalContractInput } from "../dtos";
import { BaseApiResponseWithoutData } from "src/shared/dtos";


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