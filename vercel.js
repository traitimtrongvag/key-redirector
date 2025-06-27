{
  "version": 2,
  "builds": [
    {
      "src": "api/get-key.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/get-key",
      "dest": "/api/get-key.js"
    },
    {
      "src": "/",
      "dest": "/api/get-key.js"  // Redirect root về API
      // Hoặc hiển thị trang HTML tĩnh nếu có
    }
  ]
}
