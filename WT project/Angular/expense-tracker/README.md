# 💰 Expense Tracker — Angular Mini Project

A clean, fully-functional Expense Tracker built with **Angular 17** (Standalone Components).

---

## 📁 Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/                   # Home page (summary + list)
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.css
│   │   │   ├── add-transaction/        # Add transaction form
│   │   │   │   ├── add-transaction.component.ts
│   │   │   │   ├── add-transaction.component.html
│   │   │   │   └── add-transaction.component.css
│   │   │   └── transaction-list/       # Transaction list display
│   │   │       ├── transaction-list.component.ts
│   │   │       ├── transaction-list.component.html
│   │   │       └── transaction-list.component.css
│   │   ├── models/
│   │   │   └── transaction.model.ts    # Transaction interface
│   │   ├── services/
│   │   │   └── transaction.service.ts  # Data management + LocalStorage
│   │   ├── app.component.ts            # Root component
│   │   ├── app.config.ts               # App providers
│   │   └── app.routes.ts               # Route definitions
│   ├── index.html
│   ├── main.ts                         # App bootstrap
│   └── styles.css                      # Global styles & CSS variables
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

---

## 🚀 Steps to Run the Project

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **Angular CLI** v17+

### Step 1: Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli
```

### Step 2: Navigate into the project folder
```bash
cd expense-tracker
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Start the development server
```bash
ng serve
```

### Step 5: Open in browser
```
http://localhost:4200
```

---

## ✨ Features

| Feature | Details |
|---|---|
| Add Transaction | Title, Amount, Date, Type, Category |
| Transaction Types | Income / Expense toggle |
| Categories | Food, Travel, Bills, Salary, Investment, Other |
| Summary Cards | Balance, Total Income, Total Expenses |
| Delete | Confirm-then-delete any transaction |
| Routing | `/` Home, `/add` Add Transaction |
| Persistence | localStorage — survives page refresh |
| Reactive Forms | Built with Angular FormBuilder + Validators |
| Standalone Components | Modern Angular 17 architecture |

---

## 🛠 Tech Stack

- **Angular 17** (Standalone Components, no NgModule)
- **Reactive Forms** (`FormBuilder`, `Validators`)
- **Angular Router** (lazy-loaded routes)
- **RxJS** (`BehaviorSubject` for reactive state)
- **LocalStorage** (no backend required)
- **Pure CSS** (CSS variables for theming)

---

## 📝 Key Design Decisions

1. **BehaviorSubject in Service** — All components subscribe to `transactions$` and auto-update when data changes.
2. **Standalone Components** — No NgModules; each component declares its own imports.
3. **Lazy Loading** — Routes use `loadComponent()` for optimal bundle splitting.
4. **CSS Variables** — All colors/shadows defined in `:root` for easy theming.
5. **Sample Data** — App populates with 5 sample transactions on first load.

---

## 🏗 Build for Production

```bash
ng build
```
Output goes to `dist/expense-tracker/`.
