import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-recipe');
  protected readonly sidebarWidth = signal(250); // Default width in px
  protected readonly isMobileMenuOpen = signal(false);
  protected isResizing = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  startResizing(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    // Min width 150px, Max width 400px
    const newWidth = Math.max(150, Math.min(400, event.clientX));
    this.sidebarWidth.set(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}
