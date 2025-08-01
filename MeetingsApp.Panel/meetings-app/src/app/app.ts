import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
