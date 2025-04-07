import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Student } from '../interfaces/student';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generatePdf(students: Student[], classroom: string) {
    const doc = new jsPDF();
    const today = new Date();
    const filename = `${today.toISOString().slice(0, 10)}-${classroom}.pdf`;

    // Titre
    doc.setFontSize(18);
    doc.setTextColor('#06b6d4');
    doc.setFont('helvetica', 'bold');
    doc.text(`TROMBINOSCOPE DE LA CLASSE ${classroom.toUpperCase()}`, 105, 20, {
      align: 'center',
    });
    doc.setDrawColor('#06b6d4');
    doc.line(30, 23, 180, 23);

    let x = 20;
    let y = 35;
    let count = 0;

    for (const student of students) {
      if (!student.photo_url) continue;

      const imageBase64 = await this.getBase64AsCircle(student.photo_url);
      if (!imageBase64) continue;

      doc.addImage(imageBase64, 'PNG', x, y, 30, 30);
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${student.firstname} ${student.lastname}`, x, y + 35, {
        align: 'left',
      });

      x += 35; // espacement horizontal réduit
      count++;
      if (count % 5 === 0) {
        x = 20;
        y += 45; // espacement vertical réduit
      }
    }

    doc.save(filename);
  }

  async getBase64AsCircle(url: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.stroke();

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}
