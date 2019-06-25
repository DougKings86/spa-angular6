export class BucketAnaliseImageModel {
    src: string = null;
    image_name: string = null; 

    constructor(src: string, name: string) {
        this.src = src;
        this.image_name = name;
    }
}