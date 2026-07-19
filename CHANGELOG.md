# Changelog — Zenith Dental Template

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-07-19
### Added
- **Project Structure**: Packaged and restructured the layout into a distinct `Template/` container and a separate `Documentation/` index.
- **SEO Elements**: Added Twitter Cards metadata, canonical links, sitemap placeholders, robots.txt directives, and local business JSON-LD structured schema.
- **Accessibility Improvements**: Integrated keyboard modal focus traps, focus restorations on close, dynamic ARIA labels for calendar buttons, and menu aria toggles.
- **Favicon Packages**: Added the cross-platform favicons set (favicon.ico, apple-touch-icon.png, 16x16/32x32 PNGs, and site.webmanifest).
- **Interactive Summary Widget**: Dynamic details rendering inside step 3 of the booking wizard, reflecting chosen service, doctor, dates, times, and pricing.

### Changed
- **Performance Optimizations**: Converted PNG assets (doctor profiles, clinic hero) into optimized WebP formats (reducing folder weights by ~80%).
- **Lazy Loading**: Added `loading="lazy"` tags to images below the fold to boost initial page speed metrics.
- **Clean Architecture**: Refactored inline styling tags from HTML elements into clean properties in `Template/assets/css/components.css`.
- **Event Listeners**: Replaced inline onClick JS scripts on buttons with programmatic Event Listeners in `Template/assets/js/main.js`.
- **Color contrast**: Darkened light neutral slate fonts to `#64748b` to ensure WCAG AA compliance.
