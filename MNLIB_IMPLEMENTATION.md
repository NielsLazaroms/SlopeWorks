# MNLib Implementation & Theme Management Documentation

This document explains how themes are managed in the SlopeWorks project and how the `mn-angular-lib` (mnlib) is implemented and configured.

## 1. Theme Management

The project uses **Tailwind CSS v4** for styling and theme management. The themes are defined using the `@theme` block in the global stylesheet.

### Configuration Path
`src/styles.css`

### How it works
In Tailwind CSS v4, the `@theme` block allows you to define custom CSS variables that are automatically mapped to Tailwind utility classes (e.g., `bg-brand-500`, `text-brand-900`).

```css
/* src/styles.css */
@theme {
  --color-brand-50:  #FFFBEB;
  --color-brand-100: #FFF3C4;
  /* ... other brand color scales ... */
  --color-brand-500: #FFBB00;
  /* ... */
}
```

By modifying these variables, you can change the primary branding of the entire application.

---

## 2. MNLib Implementation

`mn-angular-lib` (mnlib) is a custom Angular library used for UI components, configuration management, and internationalization.

### Global Configuration
The library is initialized in the application's main configuration.

**File:** `src/app/app.config.ts`
```typescript
import { provideMnConfig } from 'mn-angular-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    ...provideMnConfig('mn-config.json5', false),
  ]
};
```
- `provideMnConfig('mn-config.json5', false)`: Loads the configuration from a JSON5 file located in the `public` folder.

### Configuration File (`mn-config.json5`)
The `public/mn-config.json5` file is the central place for managing application behavior, translations, and component defaults.

- **Language:** Configures i18n settings, default locale, and domain-to-locale mapping.
- **Defaults:** Defines fallback configurations for mnlib components (like `mn-input-field`, `mn-textarea`).
- **Overrides:** Allows route-specific or section-specific configuration overrides (e.g., for `home`, `navbar`, `footer`).

#### Example Override Structure:
```json5
{
  "overrides": {
    "root": {
      "home": {
        "packages-section": {
          "app-packages-section": {
            "packagesTitleText": "Our packages",
            "cards": [ /* ... */ ]
          }
        }
      }
    }
  }
}
```

### Component-Level Implementation
Individual components consume the configuration using `provideMnComponentConfig`.

**Example:** `PackagesSectionComponent`
1. **Definition:** The component provides its own configuration token.
2. **Injection:** The configuration is injected into the component class.

```typescript
// packages-section.ts
@Component({
  // ...
  providers: [
    provideMnComponentConfig<PackagesSectionConfig>(APP_PACKAGES_SECTION_CONFIG, 'app-packages-section'),
  ],
})
export class PackagesSectionComponent {
  protected readonly componentConfig = inject(APP_PACKAGES_SECTION_CONFIG);
  // Now componentConfig contains values from mn-config.json5
}
```

### Styling Components
Components from `mn-angular-lib` are styled using Tailwind. To ensure Tailwind picks up the classes used inside the library, the source path is added to `src/styles.css`:

```css
@source "../node_modules/mn-angular-lib";
```

## Summary of Implementation Steps
1. **Install** `mn-angular-lib`.
2. **Setup Global Provider** in `app.config.ts`.
3. **Create/Edit** `public/mn-config.json5` to define data and behavior.
4. **Use `provideMnComponentConfig`** in components to link them to specific keys in the configuration file.
5. **Inject the Config** in the component to access the values.
