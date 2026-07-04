# CLAUDE.md

## Stack
- frontend/: Angular 21 (signals, services, guards)
- External/machine-specific paths (MnLib, legacy refs): see `PATHS.md`

## Run (always background)
- frontend: `npm run start`

## Frontend rules
- State: signals. Data/logic: services. Route protection: `auth.guard`, `association-permission.guard`. JWT: `interceptors/auth.interceptor.ts` (auto-refresh on 401).
- **Always use MnLib components** — never build a custom equivalent if an MN component covers the use case.
  Available: `mn-alert`, `mn-badge`, `mn-button`, `mn-calendar`, `mn-checkbox`, `mn-datetime`, `mn-dual-horizontal-image`, `mn-error-message`, `mn-icon`, `mn-information-card`, `mn-input-field`, `mn-list`, `mn-modal`, `mn-multi-select`, `mn-select`, `mn-tab`, `mn-table`, `mn-textarea`
- Errors: `ErrorHandlerService` (never `console.error`); API errors: `ApiErrorService` (toast).
- Styling: Tailwind + DaisyUI.
- **Never change `mn-angular-lib` version** in `frontend/package.json` (pinned).
- Common components: `src/app/components/`; 

## i18n
- Files: `public/assets/i18n/en.json` + `nl.json` — all visible strings need keys in both.
- Templates: `MnTranslatePipe`; backend arrays: `{{ entity.translations | resolveTranslation:'name':currentLanguage() }}`
- Lang switch: `AuthService.setLanguage()` → `MnLanguageService` + `POST /users/language`


## Translation
- Frontend: `ResolveTranslationPipe`; lang switch via `AuthService.setLanguage()`.

## Code style
- JSDoc on every function, interface, class, property. English only. No `====` separators. DRY after second use.


## CI
Check `.github/` before touching CI-relevant files.
CI already gates backend pushes on `npm test` (`test-backend` job in `.github/workflows/deploy.yml`) — a failing or missing test breaks the pipeline.
