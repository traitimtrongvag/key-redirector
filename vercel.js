{
  "version": 2,
  "builds": [
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/*",
      "use": "@vercel/static"  // Xử lý file tĩnh (HTML/CSS/JS)
    }
  ],
  "routes": [
    // Route cho trang chủ (file tĩnh)
    {
      "src": "/",
      "dest": "/public/index.html"
    },
    // Route cho API
    {
      "src": "/get-key",
      "dest": "/api/get-key.js",
      "methods": ["GET"]
    },
    // Fallback: Redirect 404 về trang chủ
    {
      "src": "/(.*)",
      "status": 404,
      "dest": "/public/index.html"
    }
  ]
}
