import { IsNotEmpty } from "class-validator";
import { CreateAdvertisementBannerInput } from "./create-advertisement-banner-input.dto";
import { CreateClientInput } from "./create-client-input.dto";
import { CreateRentalContractInput } from "./create-rental-contract.dto";

export class CreateAdvertisementBannerRequestInput {

    @IsNotEmpty()
    bannerInfo: CreateAdvertisementBannerInput;

    @IsNotEmpty()
    clientInfo: CreateClientInput;

    @IsNotEmpty()
    rentalContactInfo: CreateRentalContractInput;
}