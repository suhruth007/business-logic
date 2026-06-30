# Vibhava Enterprises — Invoice Calculator

Simple Next.js (App Router) + Tailwind CSS app for agricultural wholesale invoice calculations.

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Deploy to Vercel: import the repo or push to GitHub and deploy — Next.js App Router is supported by default.

## PDF Invoice Generator and Email

This project now includes:
- A full invoice entry form with client details, invoice number, date, GST No, L.R. No, HSN Code, particulars, gross weight, rate, and brokerage.
- PDF generation using `@react-pdf/renderer`.
- A semi-transparent watermark reading `POULTRY USE ONLY` across the invoice PDF.
- Email delivery via `/api/send-invoice` using Gmail and Nodemailer.

### Setup Gmail app password

1. Sign in to Google at https://myaccount.google.com.
2. Open `Security`.
3. Enable `2-Step Verification` if it is not already enabled.
4. Return to `Security` and click `App passwords`.
5. Choose `Mail` for app.
6. Choose `Other (Custom name)` and enter `Next.js Invoice App`.
7. Click `Generate`.
8. Copy the 16-character app password.
9. Create a `.env.local` file in the project root with:

```env
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Use

- Download the generated invoice PDF from the button.
- Enter recipient email and click `Send Invoice by Email`.

> Do not commit `.env.local` to git.
