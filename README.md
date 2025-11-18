````md
# Interactive Line Chart for A/B Test

This project implements an interactive **line chart** for visualising A/B test statistics based on `data.json`.

The chart is built with **React + TypeScript** and **Recharts** as the visualization library and can be deployed via **GitHub Pages**.

---

## Data & Metrics

Source: `data.json`, which contains for each date:

- `visits[variationId]`
- `conversions[variationId]`

For every variation and date the following metric is calculated:

```text
conversionRate = (conversions / visits) * 100  // in percent
```
````

Both **daily** and **weekly** aggregates are supported:

- **Day** – raw daily points from `data.json`.
- **Week** – ISO weeks; visits and conversions are summed within a week and then converted to a weekly conversion rate.

---

## Tech Stack

- **React** + **TypeScript**
- **Recharts** (`ComposedChart`, `Line`, `Area`, `Tooltip`, `ResponsiveContainer`, etc.) — visualization library
- CSS Modules for styling
- Can be deployed with **GitHub Pages**

---

## Implemented Features (required)

- Line chart showing **conversion rate (%)** for all variations.
- Data is taken directly from `data.json` and normalised into:

  - a list of variations,
  - day-level and week-level time series.

- **Day / Week** toggle:

  - in _Day_ mode the chart shows daily conversion rate;
  - in _Week_ mode data is aggregated by ISO week.

- **Variation selector**:

  - custom dropdown with checkboxes for all variations;
  - at least one variation is always selected (logic enforced in state).

- **Hover tooltip with vertical guideline**:

  - shows date / week label;
  - for each selected variation: `visits`, `conversions`, and `conversionRate` in percent.

- **Automatic axis adjustment**:

  - Y-axis domain is computed from visible values of conversion rate for currently selected variations;
  - X-axis reflects the current time grain (Day / Week).

- **Responsive layout**:

  - main chart container is constrained to `671px – 1300px` width;
  - controls wrap and rearrange on smaller widths while keeping the chart readable.

---

## Bonus Features

The following optional features from the assignment are implemented:

- **Line style selector**:

  - dropdown with three styles:

    - `Line` – straight line (`type="linear"`),
    - `Smooth` – smoothed line (`type="monotone"`),
    - `Area` – area chart (filled area under the curve).

- **Light / Dark theme toggle**:

  - two buttons `Light` / `Dark`;
  - background, axis, grid and control colours adapt to the selected theme.

---

## Project Structure (high level)

- `src/types/abTest.ts` — domain types for variations and data rows.
- `src/utils/chartData.ts` — pure functions for:

  - normalising variations,
  - building day and week series,
  - computing Y-axis domain.

- `src/utils/dateUtils.ts` — date helpers (formatting, ISO week calculation).
- `src/components/chart/Chart.tsx` — main container component (state, wiring).
- `src/components/chart/ConversionChart.tsx` — chart implementation using Recharts.
- `src/components/chart/ChartTooltip.tsx` — custom tooltip content.
- `src/components/chart/ModeToggle.tsx` — Day / Week selector (dropdown).
- `src/components/chart/LineStyleSelector.tsx` — line style selector (dropdown).
- `src/components/chart/ThemeToggle.tsx` — light / dark theme switch (two buttons).
- `src/components/chart/VariationSelector.tsx` — dropdown with variation multi-select.
- `src/components/chart/chart.module.css` — styles and layout.

---

## Local Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>.git
   cd <your-repo-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   Depending on the chosen tooling:

   - Vite:

     ```bash
     npm run dev
     # or
     yarn dev
     ```

   Open the URL printed in the console (usually `http://localhost:5173` for Vite or `http://localhost:3000` for CRA).

4. **Production build**

   ```bash
   npm run build
   # or
   yarn build
   ```

5. **Deploy to GitHub Pages**

   Configure GitHub Pages to use the build output folder (`dist` for Vite or `build` for CRA), either via:

   - `gh-pages` npm script, or
   - GitHub Actions workflow,

   depending on your preferred deployment setup.

---

```
::contentReference[oaicite:0]{index=0}
```
