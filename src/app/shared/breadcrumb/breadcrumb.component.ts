import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ItineraryService } from '../../services/itineraries.service';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private itineraryService: ItineraryService
  ) {}

  ngOnInit(): void {
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const urlSegments = this.router.url.split('/').filter(segment => segment);
      let url = '';
      this.breadcrumbs = urlSegments.map(segment => {
        url += '/' + segment;
        return {
          label: this.getLabel(segment),
          url
        };
      });

      // Reemplazo para la query de resultados
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resultados')) {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const destino = queryParams['destino'];
        const label = destino
          ? `Resultados para "${decodeURIComponent(destino)}"`
          : 'Resultados';
        const resultIndex = this.breadcrumbs.findIndex(b => b.url.includes('/resultados'));
        if (resultIndex !== -1) {
          this.breadcrumbs[resultIndex].label = label;
        }
      }

      const idIndex = this.breadcrumbs.findIndex(breadcrumb => breadcrumb.label.length > 10 && breadcrumb.label.includes('-')); 
      if (
        idIndex !== -1 && 
          (urlSegments[idIndex - 1] === 'resultados' ||
          urlSegments[idIndex - 1] === 'perfil' ||
          urlSegments[idIndex - 1] === 'mis-itinerarios' ||
          urlSegments[idIndex - 1] === 'paso-1' ||
          urlSegments[idIndex - 1] === 'paso-2' ||
          urlSegments[idIndex - 1] === 'paso-3' ||
          urlSegments[idIndex - 1] === 'resumen'
        )
      ) {
        const id = urlSegments[idIndex];
        this.itineraryService.getItineraryById(id).subscribe(itinerary => {
          this.breadcrumbs[idIndex].label = itinerary.title;
        });
      }
    });
  }

  private getLabel(segment: string): string {
    const map: { [key: string]: string } = {
      '': 'Home',
      'itinerarios': 'Itinerarios',
      'crear-itinerario': 'Crear Itinerario',
      'paso-1': 'Paso 1',
      'paso-2': 'Paso 2',
      'paso-3': 'Paso 3',
      'resumen': 'Resumen',
      'editar': 'Editar',
      'resultados': 'Resultados',
      'home': 'Home',
      'perfil': 'Perfil',
      'usuario': 'Usuario',
      'login': 'Login',
      'registro': 'Registro',
      'mis-datos': 'Mis Datos',
      'mis-itinerarios': 'Mis Itinerarios',
      'blog': 'Blog',
      'contacto': 'Contacto',
      'faqs': 'Faqs',
      'puntos-interes': 'Puntos de Interés'
    };

    if (map[segment]) return map[segment];
    if (!isNaN(Number(segment))) return 'Detalle';
    return decodeURIComponent(segment);
  }
}
