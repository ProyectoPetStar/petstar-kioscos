import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { Highcharts } from 'highcharts';
import { configAppUsed, configByTurn, configAppUsedGral } from './config.charts';
import { Message } from '../../models/message';
import { Plantas } from '../../models/plantas';
import { Kiosco } from '../../models/kiosco';
import { SOCKET_WS } from '../../constants';
import { AuthService } from '../../auth/auth.service';
import swal from 'sweetalert2';
import { notify } from '../../utils';


declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  public mensaje: Message;
  public kioscos_now: number;
  public app_more_used: string;
  public planta_more_access: string;
  public ws_admin = new WebSocket(SOCKET_WS + '/ADMIN');
  public loading: boolean;
  public plantas: Array<Plantas>;
  public kioscos: Array<Kiosco>;
  public submitted: boolean;
  public formulario: FormGroup;
  public paramsFind: any;
  public dataGral: Array<any>;
  public tipoRpt: number;


  constructor(
    private auth: AuthService,
    private service: DashboardService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mensaje = new Message('info_dashboard', 'info');
    this.plantas = [];
    this.kioscos = [];
    this.dataGral = [];
    this.tipoRpt = -1;
    this.kioscos_now = 0;
    this.app_more_used = '';
    this.planta_more_access = '';
    this.paramsFind = {
      id_planta: -1,
      id_kiosco: -1,
      fecha: ''
    };

    this.service.conteoKiosco(this.auth.getIdUsuario()).subscribe(result => {

      if (result.response.sucessfull) {
        let planta = new Plantas(-1,'SELECCIONE','','','','',1);
        this.app_more_used = result.data.aplicacion.aplicacion;
        this.planta_more_access = result.data.planta.planta;
        this.plantas = result.data.listPlanta;
        this.plantas.splice(0,0,planta)
        this.kioscos = result.data.listKiosco;
        this.kioscos.splice(0,0,new Kiosco(-1,'SELECCIONE',-1,'','','',1,-1,'','','',planta,'','', true));
        
        setTimeout(()=>{
          this.ws_admin.send(JSON.stringify(this.mensaje));

          this.ws_admin.onmessage = (response) => {
            this.kioscos_now = JSON.parse(response.data)[0];
          };

          this.buildChartGral(result.data.listReportes);
          this.loading = false;
          this.loadFormulario();
        },1500);
     

      } else {

        this.loading = false;
      }
    }, error => {

      swal('Oops...', 'Ocurrió un error en el servicio!', 'error')
      this.loading = false;

    });
  }

  loadFormulario(): void {
    this.formulario = this.fb.group({
      id_planta: new FormControl({ value: this.paramsFind.id_planta, disabled: false }, [Validators.pattern(/^\d+$/)]),
      id_kiosco: new FormControl({ value: this.paramsFind.id_kiosco, disabled: false }, [Validators.pattern(/^\d+$/)]),
      fecha: new FormControl({ value: this.paramsFind.fecha, disabled: false }, [Validators.required])
    });
  }

  submit(ev) {
    ev.preventDefault();

    this.submitted = true;

    if (this.formulario.valid) {
      //Formatea fecha
      let format = new Date(this.paramsFind.fecha);
      let new_date = format.toLocaleString().split(' ')[0];
      let name_kiosco = this.kioscos.filter(el => el.id_kiosko == this.paramsFind.id_kiosco)[0].nombre_kiosko;

      if (this.tipoRpt == 1) {

        this.service.reporteByDia(this.auth.getIdUsuario(), this.paramsFind, new_date).subscribe(result => {

          if (result.response.sucessfull) {
            this.bluidChartByDay(result.data.listReportes, name_kiosco, new_date);
          } else {
            swal('Oops...', result.response.message, 'error')
          }

        }, error => {
          swal('Oops...', 'Ocurrió un error en el servicio!', 'error')
        });

      } else if (this.tipoRpt == 2) {
        this.service.reporteByAplicacion(this.auth.getIdUsuario(), this.paramsFind, new_date).subscribe(result => {

          if (result.response.sucessfull) {
            this.bluidChartByApp(result.data.listReportes, name_kiosco, new_date)
          } else {
            swal('Oops...', result.response.message, 'error')
          }
        }, error => {
          swal('Oops...', 'Ocurrió un error en el servicio!', 'error')
        });
      }

    } else {
      notify('Verifique los datos capturados!', 'danger', 2800);
    }

  }

  buildChartGral(accesos: Array<any>): void {
    setTimeout(() => {
      let datos = accesos.map(el => el.conteo);
      configAppUsedGral.series = [];
      configAppUsedGral.title.text = 'Aplicación mas utilizada';
      configAppUsedGral.subtitle.text = '';
      configAppUsedGral.xAxis.categories = accesos.map(el => el.nombre);
      configAppUsedGral.series.push({ name: ' Cantidad de accesos ', data: datos });
      $('#appUsedGral').highcharts(configAppUsedGral);
    }, 500);
  }

  bluidChartByDay(accesos: Array<any>, name_kiosco: string, dia: string): void {
    setTimeout(() => {
      let datos = accesos.map(el => el.conteo);
      configByTurn.series = [];
      configByTurn.title.text = 'Conexiones ' + dia;
      configByTurn.subtitle.text = name_kiosco;
      configByTurn.xAxis.categories = accesos.map(el => el.nombre);
      configByTurn.series.push({ name: 'Cantidad  ', data: datos });
      $('#byDay').highcharts(configByTurn);
    }, 500);
  }

  bluidChartByApp(accesos: Array<any>, name_kiosco: string, dia: string): void {
    setTimeout(() => {
      let data = accesos.map(el => el.conteo);
      configAppUsed.series = [];
      configAppUsed.title.text = 'Conexiones por aplicación ' + dia;
      configAppUsed.subtitle.text = name_kiosco;
      configAppUsed.xAxis.categories = accesos.map(el => el.nombre);
      configAppUsed.series.push({ name: ' Total de conexiones ', data: data });
      $('#appUsed').highcharts(configAppUsed);
    }, 500);
  }

  cambiaCombo(): void{
    this.paramsFind.id_kiosco = -1;
  }

  consultaReporteByDia(): void {
    this.tipoRpt = 1;
    $('#btnConsulta').trigger("click");
  }


  consultaReporteByApp(): void {
    this.tipoRpt = 2;
    $('#btnConsulta').trigger("click");
  }

  getFilterKioscos(id_planta: number): Array<Kiosco> {
    return this.kioscos.filter(el => (el.planta.id_planta == id_planta || el.id_kiosko == -1));
  }

  ngOnDestroy() {
    this.ws_admin.close();
  }

}
