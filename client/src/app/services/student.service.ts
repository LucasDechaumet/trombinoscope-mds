import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Student } from '../interfaces/student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  BASE_URL = '/students';

  constructor(private apiService: ApiService) {}

  getStudents(classe_id: string) {
    return this.apiService.get<Student[]>(
      `${this.BASE_URL}?classe_id=${classe_id}`
    );
  }

  searchStudents(classe_id: string, keyword: string) {
    return this.apiService.get<Student[]>(
      `${this.BASE_URL}/search?classe_id=${classe_id}&keyword=${keyword}`
    );
  }

  addStudent(formData: FormData) {
    return this.apiService.post(`${this.BASE_URL}`, formData);
  }

  updateStudent(student: Student) {
    console.log('student', student);
    return this.apiService.patch(`${this.BASE_URL}`, student);
  }

  deleteStudent(studentId: string) {
    return this.apiService.delete(`${this.BASE_URL}/${studentId}`);
  }
}
