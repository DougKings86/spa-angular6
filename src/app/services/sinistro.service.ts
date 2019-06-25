import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CarrosModeloModel, SinistroModel, FileImageModel, BucketListModel, BucketListItemModel, BucketModel, BucketImageModel, TextValueModel, BucketAnaliseModel, SinistroItemImageLinkModel } from '../models/index';
import { environment } from '../../environments/environment';

@Injectable()
export class SinistroService {

  constructor(private _httpClient: HttpClient) { }

  ObterBucketList() {
    // console.warn('Implementar a chamada do servidor -> ObterBucketList() ' + "URL" + environment.urlApi + '/getBucketsList');
    return this._httpClient.get<BucketListModel>(environment.urlApi + '/getBucketsList');
    //return this._httpClient.get<BucketListModel>('../../assets/dados/modelo-bucket-list.json');
  }

  ObterBucket(bucket: BucketListItemModel) {
    // console.warn('Implementar a chamada do servidor -> ObterBucket() ' + 'URL' + environment.urlApi + '/getfiles?bucket=' + bucket.bucketName);    
    return this._httpClient.get<BucketModel>(environment.urlApi + '/getfiles?bucket=' + bucket.bucketName);
    // return this._httpClient.get<BucketModel>('../../assets/dados/modelo-bucket-' + bucket.bucketName + '.json');
  }

  ObterModeloCarros() {
    // console.warn('Implementar a chamada do servidor -> ObterModeloCarros() ' + environment.urlApi + '/getModelos');
    return this._httpClient.get<Array<TextValueModel>>(environment.urlApi + '/getModelos');
    // return this._httpClient.get<TextValueModel[]>('../../assets/dados/modelo-carros.json');
  }

  ObterSinistros(analise: BucketAnaliseModel) {
    // console.warn('Implementar a chamada do servidor -> ObterSinistros() ');
    // return this._httpClient.get<SinistroModel[]>('../../assets/dados/modelo-sinistro-lista.json');


    // console.log(analise);
    
    let body = `images=${JSON.stringify(analise.images)}&modelo=${analise.modelo}`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // let options = new HttpRequest();
    return this._httpClient.post<SinistroModel>(environment.urlApi + '/vr-analize', body, { headers: headers });

    // return this.http.post(AppSettings.UrlApiResource + '/Token', body, {headers: headers});

  }

  ObterImagensSinistro(sinistro: number, posicoes: string[]) {
    return this._httpClient.get<SinistroItemImageLinkModel[]>(`${environment.urlApi}/getLinksImgs/${sinistro}/${posicoes.toString()}`);
    // return this._httpClient.get<SinistroItemImageLinkModel[]>('https://mvpsulamerica-dev.mybluemix.net/getLinksImgs/960616782/frente_direita,traseira');
  }

}
