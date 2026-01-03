import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsAdminService, Setting } from '@core/services/settings-admin.service';
import { environment } from '../../../../environments/environment';

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
  
  generatedToken = signal<string>('');
  showGeneratedToken = signal<boolean>(false);
  tokenCopied = signal<boolean>(false);
  
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);

  constructor(private settingsService: SettingsAdminService) {}

  ngOnInit() {
    this.loadSettings();
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
        alert('Erro ao carregar configurações');
      }
    });
  }

  saveLicenseDuration() {
    if (this.licenseDuration() < 1) {
      alert('A duração da licença deve ser pelo menos 1 dia');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('default_license_duration', {
      value: this.licenseDuration().toString(),
      description: 'Duração padrão da licença em dias para novos usuários'
    }).subscribe({
      next: () => {
        alert('✅ Duração da licença salva com sucesso!');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving license duration:', err);
        alert('❌ Erro ao salvar duração da licença');
        this.saving.set(false);
      }
    });
  }

  saveBotName() {
    if (!this.defaultBotName().trim()) {
      alert('O nome do bot não pode estar vazio');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('default_bot_name', {
      value: this.defaultBotName(),
      description: 'Nome padrão do bot para novos usuários'
    }).subscribe({
      next: () => {
        alert('✅ Nome do bot salvo com sucesso!');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving bot name:', err);
        alert('❌ Erro ao salvar nome do bot');
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
      alert('Token não gerado');
      return;
    }

    this.saving.set(true);
    this.settingsService.updateSetting('webhook_secret_token', {
      value: this.generatedToken(),
      description: 'Token de segurança para autenticar webhooks'
    }).subscribe({
      next: () => {
        alert('✅ Token de webhook salvo com sucesso!');
        this.webhookToken.set('****');
        this.showGeneratedToken.set(false);
        this.generatedToken.set('');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving webhook token:', err);
        alert('❌ Erro ao salvar token de webhook');
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
      setTimeout(() => this.tokenCopied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Erro ao copiar token');
    }
  }

  async copyWebhookUrl() {
    try {
      const url = this.getWebhookUrl();
      await navigator.clipboard.writeText(url);
      alert('✅ URL copiada para área de transferência!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Erro ao copiar URL');
    }
  }

  getWebhookUrl(): string {
    return `${environment.apiBaseUrl}/api/webhook/create-client`;
  }
}
