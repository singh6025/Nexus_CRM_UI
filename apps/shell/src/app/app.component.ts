import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebSocketService } from '@farmeasy/shared-state';
import { AuthStore } from '@farmeasy/shared-auth';

@Component({
  selector: 'crm-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  private readonly wsService = inject(WebSocketService);
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    if (this.authStore.isAuthenticated()) {
      this.wsService.connect();
    }
  }
}
