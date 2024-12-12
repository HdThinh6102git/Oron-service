import { IsNotEmpty } from "class-validator";
import { CreateAdvertisementBannerInput } from "@modules/advertisment-banner/dtos/create-advertisement-banner-input.dto"; 
import { CreateClientInput } from "@modules/advertisment-banner/dtos/create-client-input.dto";
import { CreateRentalContractInput } from "@modules/advertisment-banner/dtos/create-rental-contract.dto";

export class CreateAdvertisementBannerRequestInput {

    @IsNotEmpty()
    bannerInfo: CreateAdvertisementBannerInput;

    @IsNotEmpty()
    clientInfo: CreateClientInput;

    @IsNotEmpty()
    rentalContactInfo: CreateRentalContractInput;
}