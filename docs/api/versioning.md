---
title: API Versioning and Changelog
description: Version strategy, migration guidance, and changelog practices.
---

# API Versioning and Changelog

We use URL-based versioning (`/v1`, `/v2`) to keep integrations stable while enabling safe evolution.

## Version strategy

- **/v1**: current stable version.
- **/v2**: next major changes with deprecations called out in advance.

```text
# Inline note: version prefixes are part of the routing layer, not a capability concern.
/v1/forms
/v2/forms
```

## Deprecation policy

1. Announce breaking changes in the changelog.
2. Provide a migration guide with code examples.
3. Support the old version for at least one release cycle.

## Changelog template

```md
## 2026-02-03
- Added: /v2/forms with pagination support.
- Deprecated: /v1/forms?cursor=... (use /v2/forms?page=...)
```

## Migration guide template

```md
### Migrating from v1 to v2
- Update endpoint base URLs to `/v2`.
- Replace `cursor` pagination with `page` and `limit`.
- Validate webhook signatures using the new header names.
```
