# astewart.io

My personal resume website: a fast, responsive static site built with [Nunjucks](https://mozilla.github.io/nunjucks/) templates and [Sass](https://sass-lang.com/), hosted on AWS S3.

**Live site:** [astewart.io](https://astewart.io/)

## Tech Stack

- **Templating:** Nunjucks
- **Styles:** Sass (SCSS)
- **Package manager:** pnpm
- **Hosting:** AWS S3 + CloudFront CDN

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm start
```

Builds the site and starts a local development server at `http://localhost:3000`.

### Build

```bash
pnpm build
```

Compiles the Nunjucks templates and Sass into static assets in `public/`.

## Project Structure

```
.
├── src/
│   ├── template-parts/   # Nunjucks layouts, partials, and pages
│   ├── styles/           # Sass source files
│   └── images/           # Images and other static files
├── public/               # Build output (generated)
└── package.json
```

## Deployment

The site is deployed as static files to an AWS S3 bucket configured for static website hosting.

```bash
pnpm build
aws s3 sync public/ s3://<bucket-name> --delete
```
