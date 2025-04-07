import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Classe } from '../interfaces/classe';
import { Observable } from 'rxjs/internal/Observable';
import { MenuItem } from 'primeng/api';
import { map } from 'rxjs';
import { AddClassForm } from '../layout/components/sidebar/addClasseForm';

@Injectable({
  providedIn: 'root',
})
export class ClasseService {
  BASE_URL = '/classes';

  constructor(private apiService: ApiService) {}

  getGroupedClasses(): Observable<MenuItem[]> {
    return this.apiService.get<Classe[]>(this.BASE_URL).pipe(
      map((classes) => {
        const grouped: { [key: string]: MenuItem } = {};

        for (const classe of classes) {
          if (!classe.branch) {
            continue;
          }
          const branchKey = classe.branch.toLowerCase();
          const label =
            classe.branch.charAt(0).toUpperCase() + classe.branch.slice(1);
          const icon = 'pi ' + classe.icon;

          if (!grouped[branchKey]) {
            grouped[branchKey] = {
              label,
              icon,
              items: [],
            };
          }

          grouped[branchKey].items!.push({
            label: classe.name,
            command: () => {},
          });
        }

        return Object.values(grouped);
      })
    );
  }

  addClasse(classe: AddClassForm) {
    return this.apiService.post(this.BASE_URL, classe);
  }
}
