# FileKit

Free online file tools — convert, compress, watermark, and transform images and PDFs. No account needed, files never stored.

## Tools

**Image**
- Convert (JPEG, PNG, WebP, AVIF)
- Resize
- Compress
- Grayscale
- Watermark
- Strip Metadata
- Images to PDF
- Image Info

**PDF**
- Merge
- Metadata viewer
- Rotate Pages
- Password Protect
- Watermark

## Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Image processing | Sharp |
| PDF processing | pdf-lib, node-qpdf2 |
| Containerisation | Docker |

## Project Structure

```
FileConverter/
  apps/
    api/        # Express backend
    web/        # React frontend
  Dockerfile
```

## Local Development

**Backend**
```bash
cd apps/api
npm install
npm run dev
```

**Frontend**
```bash
cd apps/web
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, proxied to backend on `http://localhost:8181`.

## Production

Build and run with Docker:

```bash
docker build -t filekit .
docker run -p 8181:8181 \
  -e NODE_ENV=production \
  -e PORT=8181 \
  -e MAX_UPLOAD_MB=50 \
  -e TMP_DIR=./tmp \
  filekit
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8181` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MAX_UPLOAD_MB` | `50` | Max upload size in MB |
| `TMP_DIR` | `./tmp` | Temp directory for processing |

## Requirements

- Node.js 20+
- [QPDF](https://github.com/qpdf/qpdf/releases) installed on the system (required for PDF password protection)

## License

MIT