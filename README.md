# Save Morgan Valley Website

This is the official website for Save Morgan Valley, hosted on GitHub Pages.

## Deployment Instructions

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository named `savemorganvalley.com` (or any name)
2. Make it public (required for free GitHub Pages)
3. Push this code to the repository

### 2. Enable GitHub Pages
1. Go to repository Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Click Save
5. Your site will be live at `https://yourusername.github.io/savemorganvalley.com/`

### 3. Configure Custom Domain with Cloudflare
1. In GitHub repository Settings → Pages → Custom domain, enter: `savemorganvalley.com`
2. In Cloudflare DNS settings, add these records:
   - Type: `CNAME`, Name: `www`, Content: `yourusername.github.io`
   - Type: `A`, Name: `@`, Content: `185.199.108.153`
   - Type: `A`, Name: `@`, Content: `185.199.109.153`
   - Type: `A`, Name: `@`, Content: `185.199.110.153`
   - Type: `A`, Name: `@`, Content: `185.199.111.153`
3. In Cloudflare, set SSL/TLS mode to "Full"
4. Wait for DNS propagation (can take up to 24 hours, usually much faster)

### 4. Add CNAME File
Create a file named `CNAME` (no extension) in the root with just your domain:
```
savemorganvalley.com
```

## Customization
- Edit `index.html` to update content
- Modify `styles.css` to change colors and styling
- Add images to an `images` folder and reference them in HTML

## Local Development
Simply open `index.html` in your browser to preview changes locally.
