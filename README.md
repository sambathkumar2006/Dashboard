# Applied – Job Application Tracker

A React-based job application tracker that helps users manage job applications, monitor their application progress, and organize their job search in one place.

## Features

### Dashboard
- View total applications and status-wise counts.
- View application status distribution.
- See recently added applications.
- Navigate directly to application details.

### Applications
- View all job applications.
- Search by company name or role.
- Filter by application status.
- Sort applications by company or application date.
- Paginate application results.
- Keep search, filter, sort, and page information in the URL.
- Create, edit, view, and delete applications.

### Application Management
- Reusable application form.
- Form validation for required fields, URLs, salary ranges, and application dates.
- Track status history with timestamps.
- Confirmation modal before deleting an application.

### Pipeline
- View applications in Kanban columns.
- Drag and drop applications between statuses.
- Optimistic status updates with rollback on API failure.
- Toast notifications for update results.
- Optional chaos mode to simulate API failures.

### Additional Features
- Light and dark themes.
- Responsive layout.
- Debounced search.
- Loading, error, and empty states.

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- Redux Toolkit
- React Redux
- Tailwind CSS
- JSON Server

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock backend

```bash
npm run mock
```

The JSON Server runs at:

`http://localhost:3001`

### 3. Start the frontend

Open another terminal in the project directory and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## Chaos Mode

To simulate API failures during Kanban status updates, create a `.env` file in the project root:

```env
VITE_CHAOS_MODE=true
```

Restart the Vite development server after changing the environment variable.

Set it to `false` or remove the variable to disable chaos mode.

## Application Routes

| Route | Description |
|---|---|
| `/` | Dashboard |
| `/applications` | Applications list |
| `/applications/new` | Create application |
| `/applications/:id` | Application details |
| `/applications/:id/edit` | Edit application |
| `/pipeline` | Kanban pipeline |

## Redux State Management

Redux Toolkit manages the application data and asynchronous API operations.

Main state structure:

```js
{
  applications: {
    items: [],
    status: "idle",
    error: null,
    selectedApplication: null,
    detailsStatus: "idle",
    detailsError: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
    pendingStatusUpdates: {}
  }
}
```

### Redux responsibilities

- `applicationsSlice.js` – reducers and asynchronous thunks.
- `applicationsSelectors.js` – reusable selectors and memoized dashboard statistics.
- `store.js` – Redux store configuration.
- `applicationsApi.js` – centralized API requests.

## Backend

JSON Server uses `mock/db.json` as the database.

Base URL:

`http://localhost:3001`

Main API endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/applications` | Get applications |
| GET | `/applications/:id` | Get one application |
| POST | `/applications` | Create application |
| PATCH | `/applications/:id` | Update application |
| DELETE | `/applications/:id` | Delete application |

## Custom Hooks

### useForm

A reusable custom hook that manages:

- Form values.
- Validation errors.
- Touched fields.
- Input changes.
- Blur events.
- Form submission.
- Form reset.

## Known Limitations and Future Improvements

- Add automated tests for components and Redux operations.
- Persist the selected theme between sessions.
- Improve accessibility, including keyboard support for Kanban interactions.
- Add CSV export and bulk application actions.
- Consider server-side filtering and pagination for larger datasets.
- Add more dashboard analytics.

## Author

Developed as a frontend development assignment using React, Redux Toolkit, and Tailwind CSS.