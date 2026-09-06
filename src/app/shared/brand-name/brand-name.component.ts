import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Renders a bot/app name, highlighting a trailing "IA" in the active
 * palette's accent color (var(--accent)) — matches whichever theme is
 * active (NorteIA, GuIA, etc.) without any per-brand hardcoding.
 */
@Component({
  selector: 'app-brand-name',
  standalone: true,
  imports: [CommonModule],
  template: `<span>{{ base }}</span><span class="brand-name-ia" *ngIf="highlight">{{ highlight }}</span>`,
  styles: [`
    .brand-name-ia {
      color: var(--accent);
      -webkit-text-fill-color: var(--accent);
      font-weight: 800;
    }
  `]
})
export class BrandNameComponent {
  base = '';
  highlight = '';

  @Input() set name(value: string | null | undefined) {
    const trimmed = (value || '').trim();
    if (trimmed.length > 2 && trimmed.slice(-2).toLowerCase() === 'ia') {
      this.base = trimmed.slice(0, -2);
      this.highlight = trimmed.slice(-2);
    } else {
      this.base = trimmed;
      this.highlight = '';
    }
  }
}
