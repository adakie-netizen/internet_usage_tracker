# Internet Usage Tracker

A small responsive web application for monitoring a mobile Internet plan and estimating a sustainable daily data budget.

## Features

- Configure a data plan (Go + duration).
- Track current day and total consumption.
- Calculate remaining data and recommended daily budget.
- Compare current average usage with the remaining budget.
- Add daily usage entries.
- Persist entries locally with `localStorage`.
- Responsive interface for desktop and mobile.
- No framework or backend required.

## Demo

Open `index.html` in a modern browser.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage API

## Project structure

```text
internet-usage-tracker/
├── index.html
├── style.css
├── app.js
├── README.md
└── LICENSE
```

## How the calculation works

The remaining daily budget is calculated as:

`remaining data / remaining days`

The application also calculates the current average:

`consumed data / elapsed days`

These values are compared to give a simple status indicator.

## Privacy

The application does not send usage data to a server. Entries are stored locally in the browser using `localStorage`.

## Possible improvements

- Add charts for daily consumption.
- Import/export usage data as CSV.
- Add browser notifications when the daily budget is exceeded.
- Add dark mode.
- Add multiple plans/profiles.
- Add automated tests.

## License

MIT
