import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { ContextosService } from 'src/app/servicios/contextos.service';
import { UiService } from 'src/app/servicios/ui.service';

@Component({
  selector: 'app-info-contexto',
  templateUrl: './info-contexto.component.html',
  styleUrls: ['./info-contexto.component.scss'],
})
export class InfoContextoComponent implements OnInit {

  @Input() barrioSeleccionado: any;
  @Input() barrioUbicacion: any;
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef;

  cargaReproduccion = false;

  segmentoActual = 'todo';

  year = 2019;
  defaultDate = new Date('2019-12-31').toISOString();
  maxDate = new Date('2019-12-31').toISOString();
  minDate = new Date('2010-06-03').toISOString();

  bulletCharts = [];
  loadingBullets = true;
  ticks = { position: 'none' };
  description = '';
  title = '';

  barChart: Chart;
  cargandoBar = true;

  ionchips: any[] = [{
    value: 'ciudad',
    check: true,
    style: 'opacity: 0.2;',
    color: 'medium',
    text: 'Ciudad'
  }, {
    value: 'ubicacion',
    check: true,
    style: 'opacity: 0.7;',
    color: 'medium',
    text: 'Ubicación'
  }, {
    value: 'seleccion',
    check: true,
    style: 'opacity: 0.2;',
    color: 'primary',
    text: 'Selección'
  }/* , {
    value: 'promedio',
    check: true,
    style: '',
    color: 'dark',
    text: 'Promedio'
  }, {
    value: 'perfil',
    check: true,
    style: '',
    color: 'primary',
    text: 'Perfil'
  } */];

  constructor(
    private contextosService: ContextosService,
    private uiService: UiService,
  ) { }

  ngOnInit() {
    this.cargarInformacion();
  }

  cargarInformacion() {
    this.cargandoBar = this.loadingBullets = true;
    if (this.barrioSeleccionado) {
      Promise.all([
        this.contextosService.datosContextualización(this.segmentoActual,
          this.barrioUbicacion.id_barrio, this.barrioSeleccionado.id_barrio, this.year).toPromise(),
        this.contextosService.categorizacion(this.barrioUbicacion.id_barrio, this.barrioSeleccionado.id_barrio, this.year).toPromise()
      ]).then(values => {
        this.cargarGraficaLinea(values[0]);
        this.cargarBulletCharts(values[1]);
      });
    } else {
      Promise.all([
        this.contextosService.datosContextualización(this.segmentoActual,
          this.barrioUbicacion.id_barrio, this.barrioUbicacion.id_barrio, this.year).toPromise(),
        this.contextosService.categorizacion(this.barrioUbicacion.id_barrio, this.barrioUbicacion.id_barrio, this.year).toPromise()
      ]).then(values => {
        this.cargarGraficaLinea(values[0]);
        this.cargarBulletCharts(values[1]);
      });
    }
  }

  async reproducir() {
    this.cargaReproduccion = true;
    await this.contextosService.reproducir(this.barrioUbicacion, this.barrioSeleccionado);
    this.cargaReproduccion = false;
  }

  cargarGraficaLinea(datos: any) {
    if (!datos) {
      this.uiService.presentToast('Recurso no disponible offline');
      return;
    }
    this.cargandoBar = true;

    const lineChartData = {
      labels: datos.labels,
      datasets: datos.datasets
    };

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true
          }
        },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Cant.'
            },
            gridLines: {
              zeroLineColor: 'transparent'
            }
          }],
          xAxes: [{
            gridLines: {
              drawTicks: false,
              display: false
            }
          }]
        }
      }
    });
    this.cargandoBar = false;
  }

  cargarBulletCharts(data: any) {
    this.bulletCharts = [];
    data.forEach(e => {
      const titulo = e.conflictividad.nombre;
      const ind = e.indicadores;

      const target = { value: ind.promedio, label: 'Promedio', size: 4, color: 'black' };
      const pointer = { value: ind.perfil ? ind.perfil : 0, label: 'Perfil', size: '25%', color: 'var(--ion-color-primary)' };

      const ranges = [
        { show: true, name: 'ubicacion', startValue: 0, endValue: ind.ubicacion, color: 'var(--ion-color-medium)', opacity: 0.7 },
        { show: true, name: 'seleccion', startValue: 0, endValue: ind.seleccion, color: 'var(--ion-color-primary)', opacity: 0.2 },
        { show: true, name: 'ciudad', startValue: 0, endValue: ind.ciudad, color: 'var(--ion-color-medium)', opacity: 0.2 }
      ];
      this.bulletCharts.push({
        title: titulo,
        target,
        pointer,
        ranges
      });
    });

    this.loadingBullets = false;
  }

  showHide(chip) {
    chip.check = !chip.check;
    this.bulletCharts.forEach(b => {
      b.ranges.forEach(r => {
        if (r.name === chip.value) {
          r.show = !r.show;
        }
      });
    });


  }

  ionChange(defaultDate) {
    const date = new Date(defaultDate);
    this.year = date.getFullYear();
    this.cargarInformacion();
  }

  segmentChanged(e) {
    this.cargandoBar = true;
    this.segmentoActual = e.detail.value;
    if (this.barrioSeleccionado) {
      this.contextosService.datosContextualización(this.segmentoActual, this.barrioUbicacion.id_barrio,
        this.barrioSeleccionado.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });
    } else {
      this.contextosService.datosContextualización(this.segmentoActual, this.barrioUbicacion.id_barrio,
        this.barrioUbicacion.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });
    }
  }

  ionViewWillLeave() {
    this.bulletCharts = [];
    this.barChart = null;
  }

}
