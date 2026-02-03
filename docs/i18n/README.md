---
title: Internationalization (i18n)
description: Setup and workflow guidance for multi-language support.
---

# Internationalization (i18n)

We use `next-intl` to provide locale routing and message management across all client apps.

## Setup checklist

1. Add locale routing in `apps/*/app/[locale]/`.
2. Store translations in `messages/<locale>.json`.
3. Wrap layouts with `NextIntlClientProvider`.

## Example: locale layout

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;

  if (!supportedLocales.includes(locale)) {
    // Inline note: return 404 for unsupported locales to avoid fallback loops.
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Translation workflow

- Add new copy to `messages/en.json` first.
- Request translations for target locales.
- Track missing strings in the localization backlog.

## RTL readiness

- Use logical properties (e.g., `margin-inline-start`).
- Ensure icons flip correctly for RTL locales.

> Inline note: keep translations close to features so product owners can review copy changes.
