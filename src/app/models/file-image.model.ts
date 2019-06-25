export class FileImageModel {
    file: File = null;
    dataUrl: string = null;

    constructor(file: File, dataUrl: string) {
        this.file = file;
        this.dataUrl = dataUrl;
    }
}