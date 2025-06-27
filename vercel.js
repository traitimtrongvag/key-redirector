{
  "version": 2,
  "builds": [
    {
      "src": "*.js",
      "use": "@vercel/node",
      "config": {
        "runtime": "nodejs18.x"  // Hoặc "nodejs20.x" nếu muốn dùng Node 20
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"  // Đảm bảo file chính của bạn là index.js
    }
  ]
}
