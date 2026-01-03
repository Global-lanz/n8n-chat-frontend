import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AppActions from '@store/actions/app.actions';
import { SettingsAdminService, Setting } from '@core/services/settings-admin.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  licenseDuration = signal<number>(365);
  webhookToken = signal<string>('');
  defaultBotName = signal<string>('Assistente Virtual');
  
  backendVersion = signal<string>('Carregando...');
  frontendVersion = signal<string>(packageInfo.version);
  buildDate = signal<string>('');
  apiEnvironment = signal<string>('');
  
  generatedToken = signal<string>('');
  showGeneratedToken = signal<boolean>(false);
  tokenCopied = signal<boolean>(false);
  
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);

  constructor(
    private settingsService: SettingsAdminService,
    private store: Store,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.loadVersions();
  }

  loadVVersão do backend (via API /config)
    this.apiService.getConfig().subscribe({
      next: (config: any) => {
        this.backendVersion.set(config.version || '1.0.0');
        this.buildDate.set(config.buildDate || '');
        this.apiEnvironment.set(config.environment || 'production');
      },
      error: (err) => {
        console.error('Erro ao carregar versão do backend:', err);
        this.backendVersion.set('N/A');
      }
    });

    // Versão do frontend (lê version.json local com fallback para package.json)
    // GitHub Actions vai criar version.json na raiz do frontend para builds RC/produção
    this.http.get<any>('/version.json').pipe(
      catchError(() => {
        // Fallback: ler package.json (desenvolvimento)
        return this.http.get<any>('/package.json').pipe(
          catchError(() => of({ version: '1.0.0' }))
        );
      })
    ).subscribe({
      next: (versionData) => {
        this.frontendVersion.set(versionData.version || '1.0.0');
      },
      error: (err) => {
        console.error('Erro ao carregar versão do frontend:', err);
        this.frontendVersion.set('1.0.0);
        this.frontendVersion.set('N/A');
      }
    });
  }

  // Helpers para badges de versão
  getVersionBadgeClass(version: string): string {
    if (version.toUpperCase().includes('RC')) return 'badge warning';
    if (version.includes('beta') || version.includes('alpha')) return 'badge';
    return 'badge success';
  }

  getVersionLabel(version: string): string {
    if (version.toUpperCase().includes('RC')) return 'Release Candidate';
    if (version.includes('beta')) return 'Beta';
    if (version.includes('alpha')) return 'Alpha';
    return 'Estável';
  }

  isReleaseCandidate(version: string): boolean {
    return version.toUpperCase().includes('RC');
  }

  isStableVersion(version: string): boolean {
    return !version.includes('-');
  }

  hasRCVersion(): boolean {
    return this.isReleaseCandidate(this.frontendVersion()) || 
           this.isReleaseCandidate(this.backendVersion());
  }

  allStable(): boolean {
    return this.isStableVersion(this.frontendVersion()) && 
           this.isStableVersion(this.backendVersion()) &&
           this.backendVersion() !== 'N/A' &&
           this.backendVersion() !== 'Carregando...';
  }

  loadSettings() {
    this.loading.set(true);
    this.settingsService.getAllSettings().subscribe({
      next: (settings: Setting[]) => {
        settings.forEach(setting => {
          switch (setting.key) {
            case 'default_license_duration':
              this.licenseDuration.set(parseInt(setting.value) || 365);
              break;
            case 'webhook_secret_token':
              this.webhookToken.set(setting.value || '');
              break;
            case 'default_bot_name':
              this.defaultBotName.set(setting.value || 'Assistente Virtual');
              break;
          }
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.loading.set(false);
        this.notificationService.error('Erro ao carregar configurações');
      }
    });
  }

  saveLicenseDuration() {
    if (this.licenseDuration() < 1) {
      this.notificationService.error('A duração da licença deve ser pelo menos 1 dia');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('default_license_duration', {
      value: this.licenseDuration().toString(),
      description: 'Duração padrão da licença em dias para novos usuários'
    }).subscribe({
      next: () => {
        this.notificationService.success('Duração da licença salva com sucesso!');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving license duration:', err);
        this.notificationService.error('Erro ao salvar duração da licença');
        this.saving.set(false);
      }
    });
  }

  saveBotName() {
    if (!this.defaultBotName().trim()) {
      this.notificationService.error('O nome do bot não pode estar vazio');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('default_bot_name', {
      value: this.defaultBotName(),
      description: 'Nome padrão do bot para novos usuários'
    }).subscribe({
      next: () => {
        this.notificationService.success('Nome do bot salvo com sucesso!');
        this.saving.set(false);
        // Recarrega a config global para atualizar o nome em toda aplicação
        this.store.dispatch(AppActions.loadConfig());
      },
      error: (err) => {
        console.error('Error saving bot name:', err);
        this.notificationService.error('Erro ao salvar nome do bot');
        this.saving.set(false);
      }
    });
  }

  generateWebhookToken() {
    // Gera token UUID v4
    this.generatedToken.set(crypto.randomUUID());
    this.showGeneratedToken.set(true);
    this.tokenCopied.set(false);
  }

  saveWebhookToken() {
    if (!this.generatedToken()) {
      this.notificationService.error('Token não gerado');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('webhook_secret_token', {
      value: this.generatedToken(),
      description: 'Token de segurança para autenticar webhooks'
    }).subscribe({
      next: () => {
        this.notificationService.success('Token de webhook salvo com sucesso!');
        this.webhookToken.set('****');
        this.showGeneratedToken.set(false);
        this.generatedToken.set('');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving webhook token:', err);
        this.notificationService.error('Erro ao salvar token de webhook');
        this.saving.set(false);
      }
    });
  }

  cancelTokenGeneration() {
    this.showGeneratedToken.set(false);
    this.generatedToken.set('');
    this.tokenCopied.set(false);
  }

  async copyTokenToClipboard() {
    try {
      await navigator.clipboard.writeText(this.generatedToken());
      this.tokenCopied.set(true);
      this.notificationService.success('Token copiado para área de transferência!');
      setTimeout(() => this.tokenCopied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      this.notificationService.error('Erro ao copiar token');
    }
  }

  async copyWebhookUrl() {
    try {
      const url = this.getWebhookUrl();
      await navigator.clipboard.writeText(url);
      this.notificationService.success('URL copiada para área de transferência!');
    } catch (err) {
      console.error('Failed to copy:', err);
      this.notificationService.error('Erro ao copiar URL');
    }
  }

  getWebhookUrl(): string {
    return `${environment.apiBaseUrl}/api/webhook/create-client`;
  }
}
