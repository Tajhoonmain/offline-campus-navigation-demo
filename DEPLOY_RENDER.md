## Deploying to Render as a Static Site

This project is a **pure frontend** React + TypeScript + Vite app. It is deployed on Render as a **Static Site**, not as a web service or SSR app.

### Build & Publish Settings

- **Service type**: Static Site
- **Build command**:

  ```bash
  npm install && npm run build
  ```

- **Publish directory**:

  ```text
  dist
  ```

- **Node version**: managed automatically by Render (no custom config required).

Once deployed, Render will provide a **live site URL** (for example, `https://your-app.onrender.com`). That URL can be encoded into a QR code for easy access on mobile devices during the open house.

### Data Loading Expectations

The app reads navigation data via `fetch()` and is designed to work in two modes:

- **Local development (default)**:

  - Navigation JSON is loaded from the static asset:

    ```text
    /public/data/navigation.json
    ```

  - At runtime, this is available at:

    ```text
    /data/navigation.json
    ```

- **Production with external JSON (optional)**:

  - You may point the app at an external JSON endpoint by defining:

    ```text
    VITE_DATA_URL
    ```

    in your Render Static Site environment variables.

  - When `VITE_DATA_URL` is set, the app will fetch navigation data from that URL and fall back to `/data/navigation.json` only if `VITE_DATA_URL` is unset.

In both cases, the JSON must conform to the fixed `NavigationData` interface documented in `src/types.ts`. No backend code runs on Render; the app is entirely static and works offline once loaded.

