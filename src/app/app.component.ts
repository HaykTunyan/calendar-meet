import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , HeaderComponent , CalendarComponent, DragDropComponent  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'calendar-app';
}
