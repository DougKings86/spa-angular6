import { SinistroItemImageLinkModel } from "./index";

export class SinistroItemModel {
    SINISTRO: number = null;
    DESC_SINISTRO: string = null;
    DESC_IMPACTO: string = null;
    SCORE: string = null;
    PERC_ASSERTIVIDADE: string = null;

    imagesLink: SinistroItemImageLinkModel[] = [];
}