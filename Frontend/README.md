
## Folder Structure

```
Frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── services/
│   │   │   │   └── auth.api.js
│   │   │   ├── auth.context.jsx
│   │   │   └── auth.form.scss
│   │   ├── interview/
│   │   │   ├── hooks/
│   │   │   │   └── useInterview.js
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Interview.jsx
│   │   │   ├── services/
│   │   │   │   └── interview.api.js
│   │   │   ├── style/
│   │   │   │   ├── home.scss
│   │   │   │   └── interview.scss
│   │   │   └── Interview.context.jsx
│   │   └── styles/
│   │       └── button.scss
│   ├── App.jsx
│   ├── app.route.jsx
│   ├── main.jsx
│   └── style.scss
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

```