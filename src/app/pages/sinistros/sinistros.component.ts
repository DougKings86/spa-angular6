import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';

//plugins
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

//project
import { SinistroService, AppService } from '../../services';
import { CarrosModeloModel, SinistroModel, BucketListModel, BucketListItemModel, BucketModel, BucketImageModel, TextValueModel, BucketAnaliseModel, BucketAnaliseImageModel, SinistroItemModel, SinistroImagemModel, SinistroItemImageLinkModel } from '../../models/index';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from '../../components';
import { FileImageModel } from '../../models/file-image.model';
import { Utilitarios } from '../../common/index';
import { environment } from '../../../environments/environment.prod';

declare var jquery: any;
declare var $: any;
declare var page;

@Component({
	selector: 'app-sinistros',
	templateUrl: './sinistros.component.html',
	styleUrls: ['./sinistros.component.scss']
})
export class SinistrosComponent implements OnInit {

	ModeloSelecionado: number[] = [];
	FiltroStatusSelecionado: number[] = [];
	Modelos: IMultiSelectOption[] = [];
	urlImageCompare1: string = null;
	urlImageCompare2: string = null;
	Sinistros: SinistroModel = null;
	SinistroSelecionado: SinistroItemModel = null;
	NotificarErro: string = null;
	

	BucketImagesPreSelecao: BucketImageModel[] = [];
	BucketImagesSelecionadas: BucketImageModel[] = [];

	Buckets: BucketListModel = new BucketListModel();
	Bucket: BucketModel = null;

	modalImageCompare: BsModalRef;
	modalBucket: BsModalRef;

	Ordenacao: string = null;
	OrdenacaoColuna: string = null;
	termoBusca: string = null;
	popoverOptions: any[] = [];
	popoverContent: string;

	@ViewChild('templateModalBucket') templateModalBucket: TemplateRef<any>;
	@ViewChild('templateImageCompare') templateImageCompare: TemplateRef<any>;
	// myTextsStatus: IMultiSelectTexts = MultiSelectTextsPadrao(null, null, 'Status', 'Status', null, 'Status', 'Todos Status');

	ModeloTexts: IMultiSelectTexts = {
		checkAll: 'Marcar Todos',
		uncheckAll: 'Desmarcar Todos',
		checked: 'Ítem selecionado',
		checkedPlural: 'Ítens selecionados',
		searchPlaceholder: 'Pesquisar',
		defaultTitle: 'Selecione o modelo do veículo',
		allSelected: 'Todos Selecionados',
	};

	ModeloSettings: IMultiSelectSettings = {
		enableSearch: true,
		dynamicTitleMaxItems: 1,
		displayAllSelectedText: false,
		showUncheckAll: false,
		showCheckAll: false,
		selectionLimit: 1,
		autoUnselect: true,
		closeOnSelect: true
	};

	constructor(private _sinistroService: SinistroService,
		private _modalService: BsModalService,
		private _appService: AppService) 
	{
		page = this;
		this._appService.BloquearTela();
	}

	ngOnInit() {
		// this._appService.BloquearTela();
		this.CarregarVeiculos();
		this.openModalBucket();
	}

	ngAfterViewInit() {
	}

	CarregarBuckets() {

		this.BucketImagesPreSelecao = JSON.parse(JSON.stringify(this.BucketImagesSelecionadas));
		this._appService.BloquearTela();
		this._sinistroService.ObterBucketList()
			.subscribe(ret => {
				this.Buckets = ret;
				this.modalBucket = this._modalService.show(this.templateModalBucket, { class: 'modal-lg' });
			},
			error => { console.error(error)},
			() => {
				this._appService.DesbloquearTela();
			});
	}

	openModalBucket() {
		if (this.Buckets.buckets.length == 0)
			this.CarregarBuckets();
		else
			this.modalBucket = this._modalService.show(this.templateModalBucket, { class: 'modal-lg' });
	}

	SelecionarBucket(bucket: BucketListItemModel) {
		this._appService.BloquearTela()
		this._sinistroService.ObterBucket(bucket)
			.subscribe(ret => {
				this.Bucket = ret;
			},
			error => { console.error(error)},
			() => {
				this._appService.DesbloquearTela()
			});
	}

	SelecionarImagemBucket(imagem: BucketImageModel) {
		var selecionada = this.ImagemSelecionado(imagem);
		if (!selecionada && this.BucketImagesPreSelecao.length < 8) {
			this.BucketImagesPreSelecao.push(imagem);
		}
		else if (selecionada) {
		// if (selecionada) {
			this.RemoverImagem(this.BucketImagesPreSelecao.findIndex(x => x.src == imagem.src));
		}
	}

	FecharSelecaoBucket() {
		this.modalBucket.hide();
		this.BucketImagesSelecionadas = this.BucketImagesPreSelecao;
		if (this.ModeloSelecionado.length > 0)
			this.ProcessarImagensSelecionadas();
	}

	ProcessarImagensSelecionadas() {
		this.NotificarErro = null;
		if (this.BucketImagesPreSelecao.length >= 1) {

			// this.BucketImagesSelecionadas = this.BucketImagesPreSelecao;

			var analise = new BucketAnaliseModel();
			analise.images = this.BucketImagesSelecionadas.map(x => new BucketAnaliseImageModel(x.src, x.name));
			analise.modelo = this.ModeloSelecionado[0];
			this._appService.BloquearTela();
			this._sinistroService.ObterSinistros(analise)
				.subscribe(
					ret => {
						this.Sinistros = ret;
						if (ret.grid.length > 0) {
							this.SinistroSelecionado = this.Sinistros.grid[0];
							this.CarregarImagensSinistro();
						}
						ret.analise.forEach(x => {
							var img = this.BucketImagesSelecionadas.find(y => y.src == x.image_src);
							if (img != undefined) {
								img.ps = x.ps;
								img.popover = `<div class='d-flex'><div class='p-2 text-right'><p>Posição:</p><p>Classe:</p><p>Score:</p></div><div class='p-2 text-left'><p><b>${x.posicao}</b></p><p><b>${x.analise.class}</b></p><p><b>${x.analise.score}</b></p></div></div>`
							}
						});
					},
					error => { console.error(error) },
					() => {
						this.IniciaPluginPopover();
						this._appService.DesbloquearTela();
					}
				);
		}
		else {
			this.NotificarErro = "É necessário selecionar de 1 à 8 imagens para continuar.";
		}
	}

	SelecionarSinistro(sinistro: SinistroItemModel) {
		this.SinistroSelecionado = sinistro;
		this.IniciaPluginPopover();
		this.CarregarImagensSinistro();
	}

	IniciaPluginPopover() {
		let timeoutId = setTimeout(() => {
			$('[data-toggle="popover"]').popover();
		}, 20);
	}

	CarregarImagensSinistro() {
		let posicoes: string[] = [];
		this.Sinistros.analise.forEach(x => posicoes.push(x.ps));
		this._appService.BloquearTela();
		this._sinistroService.ObterImagensSinistro(this.SinistroSelecionado.SINISTRO, posicoes)
			.subscribe(ret => {
				ret.forEach(x => x.src = (environment.urlApi + x.src));
				this.SinistroSelecionado.imagesLink = ret;
			},
			error => {
				console.error('Ocorreu um erro ao tentar carregar as imagens do Sinistro.');
			},
			() => {
				this._appService.DesbloquearTela();
			});
	}

	CarregarVeiculos() {
		this.Modelos = [];
		this._sinistroService.ObterModeloCarros()
			.subscribe(ret => {
				ret.forEach(x => {
					this.Modelos.push({ id: x.value, name: x.text });
					// this.Modelos.push(x.nome);
				});
			},
			error => { console.error(error)},
			() => {
				
			});
	}

	AlterouModeloVeiculo(codigos: number[]) {
		if (this.ModeloSelecionado.length > 0)
			this.ProcessarImagensSelecionadas();
	}

	// AlterouModeloVeiculo(codigos: number[]) {
	// 	this.Bucket = null;
	// 	this.SinistroSelecionado = null;
	// 	this.Sinistros = null;
	// 	this.BucketImagesPreSelecao = [];
	// 	this.BucketImagesSelecionadas = [];
	// }

	openModalImageCompare(indiceImg: number) {
		if (this.SinistroSelecionado != null) {
			this.urlImageCompare1 = this.BucketImagesSelecionadas[indiceImg].src;
			this.urlImageCompare2 = this.SinistroSelecionado.imagesLink[indiceImg].src;
			this.modalImageCompare = this._modalService.show(this.templateImageCompare, { class: 'modal-lg modal-comparativo' });
		}
	}

	openModalImageComparePorSelecao(indiceImg: number, imagem: BucketImageModel) {
		if (this.SinistroSelecionado != null) {
			this.urlImageCompare2 = null;

			this.urlImageCompare1 = this.BucketImagesSelecionadas[indiceImg].src;
			var imgPorPosicao = this.SinistroSelecionado.imagesLink.find(x => x.posicao == imagem.ps);
			if (imgPorPosicao != null)
				this.urlImageCompare2 = imgPorPosicao.src;
			
			this.modalImageCompare = this._modalService.show(this.templateImageCompare, { class: 'modal-lg modal-comparativo' });
		}
	}

	openModalImageComparePorAnalize(imagem: SinistroItemImageLinkModel) {
		if (this.SinistroSelecionado != null) {
			this.urlImageCompare1 = null;
			this.urlImageCompare2 = null;
			
			var imgSelecionada = this.BucketImagesSelecionadas.find(x => x.ps == imagem.posicao);
			if (imgSelecionada != null)
				this.urlImageCompare1 = imgSelecionada.src;

			this.urlImageCompare2 = imagem.src;

			this.modalImageCompare = this._modalService.show(this.templateImageCompare, { class: 'modal-lg modal-comparativo' });
		}
	}

	ImagemSelecionado(imagem: BucketImageModel) {
		return this.BucketImagesPreSelecao.find(x => x.src == imagem.src) == null ? false : true;
	}

	RemoverImagem(i) {
		this.BucketImagesPreSelecao.splice(i, 1);
	}

	SetOrdenacaoColuna(coluna: string) {
		this.OrdenacaoColuna = coluna;
	}

	SetOrdenacao(ordem: string) {
		this.Ordenacao = ordem;
	}

	ObterOrdenacao(coluna: string) {
		if (coluna == this.OrdenacaoColuna) {
			if ('desc' == this.Ordenacao)
				return ["order-desc"];
			else
				return ["order-asc"];
		}

		return [];

	}

	FiltrarBuckets() {
		if (this.termoBusca == null || this.termoBusca == '')
			return this.Buckets.buckets;
		
			return this.Buckets.buckets.filter(item => {
				if (!Utilitarios.ContainsString(item.bucketName, this.termoBusca))
					return false;
				else
					return true;
			});
				
	}

	VoltarBucket() {
		this.Bucket = null;
		this.BucketImagesPreSelecao = [];
	}

}
