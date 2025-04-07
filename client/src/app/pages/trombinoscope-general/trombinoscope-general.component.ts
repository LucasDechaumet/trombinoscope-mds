import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Student } from '../../interfaces/student';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { DatePickerModule } from 'primeng/datepicker';
import { SplitButton } from 'primeng/splitbutton';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-trombinoscope-general',
  imports: [
    FormsModule,
    ButtonModule,
    ToastModule,
    InputIcon,
    IconField,
    InputTextModule,
    DrawerModule,
    DatePickerModule,
    SplitButton,
  ],
  templateUrl: './trombinoscope-general.component.html',
  styleUrl: './trombinoscope-general.component.scss',
  providers: [MessageService],
})
export class TrombinoscopeGeneralComponent implements OnInit {
  @ViewChild('singleFileInput') singleFileInput!: ElementRef;
  @ViewChild('folderFileInput') folderFileInput!: ElementRef;

  classroom: string | null = null;
  keyword: string = '';
  students: Student[] = [];
  searchSubject = new Subject<string>();
  selectedStudent: Student | null = null;

  headerTitle: string = 'Trombinoscope Général';
  isSidebarVisible: boolean = false;
  isEditPhotoDisabled: boolean = false;
  base64Preview: string = '';
  pendingPhotos: File[] = [];
  currentPhotoIndex: number = 0;
  isEditMode: boolean = false;

  studentDetailsForm: Student = {
    firstname: '',
    lastname: '',
    birthdate: undefined,
    phone: '',
    address: '',
    photo_url: '',
    classe_id: '',
  };

  items: MenuItem[] = [
    {
      label: 'Via un dossier',
      command: () => this.openFolderFileInput(),
    },
  ];

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.classroom = params.get('classroom');
      if (this.classroom) this.getStudents();
    });

    this.searchSubject.pipe(debounceTime(600)).subscribe((keyword) => {
      this.searchStudents(keyword);
    });
  }

  generatePdf(): void {
    if (!this.classroom) return;
    this.pdfService.generatePdf(this.students, this.classroom);
  }

  openDrawerDetails(student: Student): void {
    this.selectedStudent = student;
    this.isEditMode = true;
    this.headerTitle = "Détails de l'étudiant";
    this.studentDetailsForm = {
      ...student,
      birthdate: student.birthdate ? new Date(student.birthdate) : undefined,
    };
    this.base64Preview = '';
    this.isEditPhotoDisabled = false;
    this.isSidebarVisible = true;
  }

  closeDrawer(): void {
    this.isSidebarVisible = false;
    window.location.reload();
  }

  onKeywordChange(): void {
    this.searchSubject.next(this.keyword);
  }

  getStudents(): void {
    this.studentService.getStudents(this.classroom!).subscribe({
      next: (students) => (this.students = students),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur de récupération des étudiants.',
        }),
    });
  }

  searchStudents(keyword: string): void {
    if (!this.classroom) return;
    if (!keyword) return this.getStudents();

    this.studentService.searchStudents(this.classroom, keyword).subscribe({
      next: (students) => (this.students = students),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur de recherche.',
        }),
    });
  }

  openSingleFileInput(): void {
    if (!this.classroom) return;
    this.singleFileInput.nativeElement.click();
  }

  openFolderFileInput(): void {
    if (!this.classroom) return;
    this.folderFileInput.nativeElement.click();
  }

  onSingleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.pendingPhotos = [input.files[0]];
    this.currentPhotoIndex = 0;
    this.preparePhotoForm(this.pendingPhotos[0]);
  }

  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.pendingPhotos = Array.from(input.files);
    this.currentPhotoIndex = 0;
    this.preparePhotoForm(this.pendingPhotos[0]);
  }

  preparePhotoForm(file: File): void {
    this.isEditMode = false;
    const [firstname, lastname] = this.extractNames(file.name);
    this.studentDetailsForm = {
      firstname,
      lastname,
      birthdate: undefined,
      phone: '',
      address: '',
      photo_url: '',
      classe_id: this.classroom,
    };

    const reader = new FileReader();
    reader.onload = () => {
      this.base64Preview = reader.result as string;
      this.isEditPhotoDisabled = true;
      this.headerTitle = "Ajout d'un élève";
      this.isSidebarVisible = true;
    };
    reader.readAsDataURL(file);
  }

  extractNames(fileName: string): [string, string] {
    const base = fileName.split('.')[0];
    const parts = base.split('_');
    return parts.length === 2 ? [parts[0], parts[1]] : ['', ''];
  }

  onSaveStudent(): void {
    if (!this.classroom) return;

    if (this.isEditMode) {
      // MODE ÉDITION
      this.studentService.updateStudent(this.studentDetailsForm).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Élève mis à jour',
          });
          this.isSidebarVisible = false;
          this.getStudents();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour.',
          });
        },
      });
    } else {
      // MODE AJOUT
      const file = this.pendingPhotos[this.currentPhotoIndex];
      if (!file) return;

      const formData = new FormData();
      formData.append('firstname', this.studentDetailsForm.firstname);
      formData.append('lastname', this.studentDetailsForm.lastname);
      formData.append(
        'birthdate',
        this.studentDetailsForm.birthdate?.toISOString() || ''
      );
      formData.append('phone', this.studentDetailsForm.phone);
      formData.append('address', this.studentDetailsForm.address);
      formData.append('classe_id', this.classroom);
      formData.append('photo', file);

      this.studentService.addStudent(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Élève enregistré',
          });
          this.currentPhotoIndex++;
          if (this.currentPhotoIndex < this.pendingPhotos.length) {
            this.preparePhotoForm(this.pendingPhotos[this.currentPhotoIndex]);
          } else {
            this.isSidebarVisible = false;
            this.getStudents();
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Erreur lors de l'enregistrement.",
          });
        },
      });
    }
  }

  onDeleteStudent(): void {
    if (!this.selectedStudent?.id) return;
    this.studentService.deleteStudent(this.selectedStudent?.id).subscribe({
      next: () => {
        this.getStudents();
        this.isSidebarVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Élève supprimé',
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la suppression.',
        }),
    });
  }

  updateStudent(student: Student) {
    this.studentService.updateStudent(student).subscribe({
      next: () => {
        this.getStudents();
        this.isSidebarVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Élève mis à jour',
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la mise à jour.',
        }),
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default.jpeg';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur de déconnexion.',
        }),
    });
  }
}
