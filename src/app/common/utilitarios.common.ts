import { DecimalPipe, DatePipe } from '@angular/common';

export class Utilitarios {
  static ConvertJsonToParameters(parameters: any) {
      let param: string = null;
      Object.keys(parameters).forEach(prop => {
          if (parameters[prop] != null){
            if (param == null)
              param = prop + '=' + parameters[prop].toString();
            else
              param +='&' + prop + '=' + parameters[prop].toString();
          }
        });

      return param == null ? '' : param;
  }

  static MonthDiff(d1: Date, d2:Date) : number {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  static OrdernarLista(lista: Array<any>, campoOrdenacao: any) {
    
        lista.sort((a: any, b: any) => {
            if (String(a[campoOrdenacao]).toLowerCase() < String(b[campoOrdenacao]).toLowerCase()) {
                return -1;
            } else if (String(a[campoOrdenacao]).toLowerCase() > String(b[campoOrdenacao]).toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });
    
  }

  static OrdernarLista2Argumentos(lista: Array<any>, campoOrdenacao: any, campoOrdenacao2: any) {
    
        lista.sort((a: any, b: any) => {
            if ((String(a[campoOrdenacao]).toLowerCase() < String(b[campoOrdenacao]).toLowerCase()) && (String(a[campoOrdenacao2]).toLowerCase() < String(b[campoOrdenacao2]).toLowerCase())) {
                return -1;
            } else if ((String(a[campoOrdenacao]).toLowerCase() > String(b[campoOrdenacao]).toLowerCase()) && (String(a[campoOrdenacao2]).toLowerCase() > String(b[campoOrdenacao2]).toLowerCase())) {
                return 1;
            } else {
                return 0;
            }
        });
    
  }

    static ContainsString(obj: string, busca: string) {

        if (obj == null || obj == undefined || busca == undefined || busca == null)
            return false;

        var i = obj.toLowerCase().indexOf(busca.toLowerCase());
        if (i > -1)
            return true;
        else
            return false;

    }

    static RemoverDecimal(valor: number) {
        return Number(String(valor).split('.')[0]);
    }

    static addDays(date, days) {
        var result;
        if (typeof date == 'object')
            result = date;
        else
            result = new Date(date);
        result.setDate(result.getDate() + days + 1);
        return result;
    }

    static FormatarValorMilhar(valor: number, simbolo: boolean = false, formatarMilhar: boolean) {
        var decimalPipe = new DecimalPipe('pt');
        var val;
        if (formatarMilhar) {
            var div = (valor / 1000000);
            val = decimalPipe.transform(Number(div), '0.0-1') + (simbolo ? ' M' : '');
        }
        else {
            var div = (valor / 1000);
            val = decimalPipe.transform(Number(div), '0.0-1') + (simbolo ? ' K' : '');
        }

        return val;
    }
    
}