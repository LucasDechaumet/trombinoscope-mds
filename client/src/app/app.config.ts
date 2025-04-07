import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const Cyan = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{cyan.500}',
          inverseColor: '#ffffff',
          hoverColor: '{cyan.600}',
          activeColor: '{cyan.700}',
        },
        surface: {
          background: '#ffffff',
          color: '#334155',
        },
        highlight: {
          background: '{cyan.900}',
          focusBackground: '{cyan.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Cyan,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
