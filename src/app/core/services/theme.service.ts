import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return (savedTheme as Theme) || 'light';
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }

  private currentPalette = 'green';

  // Fontes carregadas sob demanda por paleta (nenhum outro tema paga o custo dessa fonte).
  private readonly PALETTE_FONT_LINK_ID = 'theme-palette-font';
  private readonly PALETTE_FONTS: Record<string, string> = {
    norteia: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700&family=Montserrat:wght@400;500;600;700;800&display=swap'
  };

  setPalette(palette: string): void {
    this.currentPalette = palette || 'green';
    this.applyPalette(this.currentPalette);
  }

  private applyPalette(palette: string): void {
    // Remove any existing palette classes from body
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('palette-'));
    classesToRemove.forEach(c => document.body.classList.remove(c));

    // Add the new palette class if not default (green)
    if (palette && palette !== 'green') {
      document.body.classList.add(`palette-${palette}`);
    }

    this.applyPaletteFont(palette);
  }

  private applyPaletteFont(palette: string): void {
    const existingLink = document.getElementById(this.PALETTE_FONT_LINK_ID) as HTMLLinkElement | null;
    const fontUrl = this.PALETTE_FONTS[palette];

    if (!fontUrl) {
      existingLink?.remove();
      return;
    }
    if (existingLink?.href === fontUrl) {
      return;
    }
    existingLink?.remove();

    const link = document.createElement('link');
    link.id = this.PALETTE_FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }
}
