import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Classe } from '../../../interfaces/classe';
import { ToastModule } from 'primeng/toast';
import { ClasseService } from '../../../services/classe.service';
import { Router } from '@angular/router';
import { Branch } from './branch';
import { AddClassForm } from './addClasseForm';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    PanelMenuModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class SidebarComponent implements OnInit {
  classes: MenuItem[] = [];
  branches: Branch[] = [
    { name: 'Développeur', icon: 'pi-desktop' },
    { name: 'DA', icon: 'pi-palette' },
    { name: 'Marketing', icon: 'pi-euro' },
    { name: 'UX-UI', icon: 'pi-pencil' },
  ];
  addClasseForm: AddClassForm = {
    name: '',
    branch: undefined,
    icon: '',
  };
  isVisible: boolean = false;

  constructor(
    private classeService: ClasseService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getMenuItems();
  }

  save() {
    if (!this.addClasseForm.name || !this.addClasseForm.branch) {
      this.messageService.add({
        severity: 'error',
        summary: 'Champs manquants',
        detail: 'Veuillez renseigner la filière et le nom de la classe.',
      });
      return;
    }

    this.classeService.addClasse(this.addClasseForm).subscribe({
      next: (response) => {
        const newClassLabel = this.addClasseForm.name;
        const branchLabel = this.addClasseForm.branch!.name;
        const branchIcon = 'pi ' + this.addClasseForm.branch!.icon;

        // Chercher le groupe (filière) correspondant
        const existingGroup = this.classes.find(
          (group) => group.label?.toLowerCase() === branchLabel.toLowerCase()
        );

        const newItem = {
          label: newClassLabel,
          command: () =>
            this.router.navigate([
              '/trombinoscope',
              newClassLabel.toLowerCase(),
            ]),
        };

        if (existingGroup) {
          existingGroup.items?.push(newItem);
        } else {
          // Créer un nouveau groupe si la filière n'existe pas encore
          this.classes.push({
            label: branchLabel,
            icon: branchIcon,
            items: [newItem],
          });
        }

        this.isVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'La classe a été ajoutée avec succès',
        });

        // Réinitialiser le formulaire
        this.addClasseForm = {
          name: '',
          branch: undefined,
          icon: '',
        };
      },
      error: (error) => {
        console.error('Error adding class:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message,
        });
      },
    });
  }

  cancel() {
    this.isVisible = false;
    this.addClasseForm = {
      name: '',
      branch: undefined,
      icon: '',
    };
  }

  getMenuItems() {
    return this.classeService.getGroupedClasses().subscribe({
      next: (items) => {
        for (const group of items) {
          for (const item of group.items!) {
            const label = item.label!;
            item.command = () =>
              this.router.navigate(['/trombinoscope', label.toLowerCase()]);
          }
        }

        this.classes = items;
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
      },
    });
  }

  showDialog() {
    this.isVisible = true;
  }
}
