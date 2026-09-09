# Installation Guide

## 1. Download the Template

Unzip the `motorcycle-service-shop` folder to a location on your computer.
No build tools, package managers, or compilers are required — every page is
plain HTML, CSS and JavaScript.

## 2. Open the Project

You can open `index.html` directly in a browser to preview the site, but for
correct behavior of relative paths and (later) any fetch-based form
submissions, it's best to serve the folder over a local web server:

**Using VS Code:** install the "Live Server" extension, right-click
`index.html`, and choose **Open with Live Server**.

**Using Python (already installed on most systems):**
```
cd motorcycle-service-shop
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

**Using Node.js:**
```
npx serve motorcycle-service-shop
```

## 3. Run the Website

Navigate between pages using the header menu. All internal links are
relative, so the site works identically from a local server or once
uploaded to hosting.

## 4. Upload to Hosting

The template is static, so it works on any standard web host:

- **Shared hosting (cPanel, etc.):** upload the entire `motorcycle-service-shop`
  folder contents to your `public_html` (or equivalent) directory via FTP or
  the file manager.
- **Netlify / Vercel:** drag and drop the folder into the dashboard, or
  connect a Git repository containing it. No build command is needed —
  leave the publish directory as the project root.
- **GitHub Pages:** push the folder to a repository and enable Pages on the
  `main` branch root.

Once live, update `sitemap.xml`, `robots.txt`, and the `canonical` /
`og:url` meta tags in each page's `<head>` to your real domain.
