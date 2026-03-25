# User Management Screen

A fully functional, responsive **User Management** interface built with vanilla HTML, CSS, and JavaScript — no frameworks or external dependencies.

## Overview

This project implements a front-end user management screen where administrators can create, view, edit, and manage application users. It was built from a detailed [UI Specification](UI_SPECIFICATION.md) to demonstrate front-end development skills including component design, form validation, and interactive data handling.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Features

### User List Table
- **Sortable columns** — click any column header to cycle through ascending, descending, and default order
- **Filterable columns** — per-column filter popovers with real-time search (text-based and dropdown for boolean fields)
- **Row selection** — click a row to load user details into the form for editing
- **Hide disabled users** — toggle checkbox to filter out inactive accounts

### User Detail Form
- **Create & edit users** with fields for username, display name, phone, email, role assignment, and enabled status
- **Multi-select dropdown** for assigning user roles (Guest, Admin, SuperAdmin)
- **Client-side validation** with inline error messages:
  - Username: required, 3–50 alphanumeric characters, uniqueness check
  - Display Name: required, 2–100 characters
  - Phone: optional, valid phone format
  - Email: required, valid format, uniqueness check
  - User Roles: at least one role required
- **Toast notifications** for success/error feedback

### UI & Responsiveness
- Clean, modern design using the **Inter** font family
- Smooth hover effects, focus states, and micro-animations
- Fully **responsive layout** — side-by-side on desktop (≥992px), stacked on mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic markup) |
| Styling | Vanilla CSS (custom properties, flexbox) |
| Logic | Vanilla JavaScript (ES6+, IIFE pattern) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

No build tools, bundlers, or package managers required.

## Getting Started

### Option 1 — Open directly
Simply open `index.html` in any modern browser.

### Option 2 — Local server
```bash
# Using Node.js
npx serve .

# Or using Python
python -m http.server 8000
```

Then navigate to `http://localhost:3000` (or `8000` for Python).

## Project Structure

```
├── index.html            # Main page markup
├── index.css             # Styles and design system
├── index.js              # Application logic (CRUD, validation, sorting, filtering)
├── UI_SPECIFICATION.md   # Detailed UI/UX specification document
└── README.md             # This file
```

## Architecture Decisions

- **No frameworks** — demonstrates core web fundamentals and DOM manipulation proficiency without relying on abstractions
- **In-memory data store** — user data is managed client-side with seed data for demonstration purposes
- **IIFE pattern** — all JavaScript is encapsulated in an Immediately Invoked Function Expression to avoid polluting the global scope
- **CSS custom properties** — centralized design tokens for consistent theming and easy maintenance
- **Semantic HTML** — proper use of `<table>`, `<form>`, `<label>`, ARIA attributes, and keyboard navigation for accessibility

## License

This project is provided for demonstration and evaluation purposes.
