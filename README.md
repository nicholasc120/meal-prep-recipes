# Macro-Friendly Recipe Collection

A GitHub Pages site for hosting macro-friendly recipes. Each recipe is designed to deliver 500-600 calories with at least 40 grams of protein per serving.

## Features

- Browse recipes by category (Chicken, Ground Beef, Steak, Other)
- Filter by rating, difficulty, and portions
- Responsive design for all devices
- Simple markdown-based recipe management

## Adding Recipes

Simply add markdown files to the `/public/recipes` folder with the following frontmatter format:

```markdown
---
title: Your Recipe Name
category: Chicken
rating: 5
difficulty: Easy
portions: 4
prepTime: 15 min
cookTime: 25 min
calories: 550
protein: 45g
---

## Ingredients

- List your ingredients here

## Instructions

1. Add your instructions here
```

## Deploying to GitHub Pages

### Step 1: Build the Site

Run the build command to generate the production files:

```bash
npm run build
```

This creates a `dist` folder with all your static files.

### Step 2: Push to GitHub

Make sure your repository is on GitHub:

```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

### Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Create a new file `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

5. Commit and push this workflow file
6. Your site will automatically deploy to `https://yourusername.github.io/repository-name/`

### Alternative: Manual Deployment

If you prefer to deploy manually:

1. Build the site: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch:

```bash
git subtree push --prefix dist origin gh-pages
```

3. In GitHub Settings → Pages, set the source to the `gh-pages` branch

## Development

Run locally:

```bash
npm install
npm run dev
```

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
