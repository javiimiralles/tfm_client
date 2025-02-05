import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private renderer!: Renderer2;
  private duration = 5000;

  colors = {
    info: {
      border: 'border-blue-500',
      background: 'bg-blue-50',
      text: 'text-blue-800',
    },
    success: {
      border: 'border-green-500',
      background: 'bg-green-50',
      text: 'text-green-800',
    },
    warning: {
      border: 'border-yellow-500',
      background: 'bg-yellow-50',
      text: 'text-yellow-800',
    },
    danger: {
      border: 'border-red-500',
      background: 'bg-red-50',
      text: 'text-red-800',
    }
  };

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showAlert(title: string, message: string, type: 'info' | 'success' | 'warning' | 'danger') {
    const alert = this.createAlertElement(title, message, type);
    const body = document.body;

    this.renderer.appendChild(body, alert);

    setTimeout(() => {
      this.renderer.removeChild(body, alert);
    }, this.duration);
  }

  showError(message: string, err: any) {
    console.error(err);
    const msg = err.error.message || message;
    this.showAlert('Error', msg, 'danger');
  }

  private createAlertElement(title: string, message: string, type: 'info' | 'success' | 'warning' | 'danger'): HTMLElement {
    const alert = this.renderer.createElement('div');

    const color = this.colors[type];

    // Agregar clases de TailwindCSS
    this.renderer.setAttribute(
      alert,
      'class',
      `fixed top-5 right-5 max-w-sm w-full border-l-4 ${color.border} ${color.background} shadow-lg rounded-lg p-4 flex items-start space-x-4 animate-fade-in`
    );
    this.renderer.setStyle(alert, 'zIndex', '9999');

    // Contenido
    const content = this.renderer.createElement('div');
    this.renderer.setAttribute(content, 'class', 'flex flex-col');
    const alertTitle = this.renderer.createElement('strong');
    this.renderer.setAttribute(alertTitle, 'class', `font-medium ${color.text}`);
    alertTitle.textContent = title;
    const desc = this.renderer.createElement('span');
    this.renderer.setAttribute(desc, 'class', `text-sm ${color.text}`);
    desc.textContent = message;

    // Añadir contenido al contenedor
    this.renderer.appendChild(content, alertTitle);
    this.renderer.appendChild(content, desc);

    // Añadir icono y contenido al alert
    this.renderer.appendChild(alert, content);

    return alert;
  }
}
