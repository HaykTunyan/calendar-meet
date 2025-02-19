import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService, Appointment } from '../../../services/indexed-db.service';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule], // ✅ Import DragDropModule
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.scss',
})
export class DragDropComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private indexedDbService: IndexedDbService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.appointments = await this.indexedDbService.getAppointments();
  }

  drop(event: CdkDragDrop<Appointment[]>) {
    moveItemInArray(this.appointments, event.previousIndex, event.currentIndex);
  }

  // async deleteAppointment(id?: number) {
  //   if (!id) return;
  //   await this.indexedDbService.deleteAppointment(id);
  //   this.appointments = this.appointments.filter(app => app.id !== id);
  // }

  deleteAppointment(id?: number) {
    if (!id) return; // Avoid errors if id is undefined
    this.indexedDbService.deleteAppointment(id);
    this.appointments = this.appointments.filter((app) => app.id !== id);
  }

  editAppointment(appointment: Appointment) {
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      width: '400px',
      data: { ...appointment }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const index = this.appointments.findIndex(app => app.id === result.id);
        if (index !== -1) {
          this.appointments[index] = result;
          await this.indexedDbService.addAppointment(result); // ✅ Update IndexedDB
        }
      }
    });
  }
}
