import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { IndexedDbService } from '../../../services/indexed-db.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;
  minDate: Date = new Date(); 
  minTime: string = ''; 

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    private indexedDbService: IndexedDbService,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date } | null
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: [this.data?.date || new Date(), Validators.required],
      time: ['', Validators.required],
      description: [''],
    });

    // Watch for changes in the date field to adjust time restrictions
    this.appointmentForm.get('date')?.valueChanges.subscribe((selectedDate) => {
      this.updateTimeRestriction(selectedDate);
    });
  }

  updateTimeRestriction(selectedDate: Date) {
    const today = new Date();
    if (
      selectedDate &&
      new Date(selectedDate).toDateString() === today.toDateString()
    ) {
      this.minTime =
        today.getHours().toString().padStart(2, '0') +
        ':' +
        today.getMinutes().toString().padStart(2, '0');
    } else {
      this.minTime = '';
    }
  }

  async onSubmit() {
    if (this.appointmentForm.valid) {
      const formData = this.appointmentForm.value;
      formData.date = new Date(formData.date);

      try {
        await this.indexedDbService.addAppointment(formData);
        console.log('data saved', formData);
      } catch (error) {
        console.error('error', error);
      }

      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
