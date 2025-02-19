import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import {
  IndexedDbService,
  Appointment,
} from '../../../services/indexed-db.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  daysInMonth: Date[] = [];
  appointments: Appointment[] = [];

  constructor(
    private dialog: MatDialog,
    private indexedDbService: IndexedDbService,
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    this.generateCalendar();
    await this.loadAppointments();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    this.daysInMonth = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
      this.daysInMonth.push(new Date(year, month, day));
    }
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  async openEventDialog(day: Date) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { date: day },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const newAppointment: Appointment = {
          ...result,
          date: result.date.toISOString(), 
        };

        const id = await this.indexedDbService.addAppointment(newAppointment);
        if (id !== undefined) {
          newAppointment.id = id; 
          this.appointments.push(newAppointment);
          this.cdr.detectChanges();
        }
      }
    });
  }

  async deleteAppointment(id?: number) {
    if (!id) return;
    await this.indexedDbService.deleteAppointment(id);
    this.appointments = this.appointments.filter((app) => app.id !== id);
  }

  async loadAppointments() {
    this.appointments = await this.indexedDbService.getAppointments();
    this.cdr.detectChanges();
  }

  drop(event: CdkDragDrop<Appointment[]>, day: Date) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.appointments,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const appointment = event.previousContainer.data[event.previousIndex];
      appointment.date = day.toISOString();
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.indexedDbService.addAppointment(appointment);
    }
  }
}
