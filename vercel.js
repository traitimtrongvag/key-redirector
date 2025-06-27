{
  "version": 2,
  "builds": [
    {
      "src": "api/get-key.js",
      "use": "@vercel/node",
      "config": { "runtime": "nodejs18.x" }
    }
  ],
  "routes": [
    {
      "src": "/get-key",
      "dest": "/api/get-key.js",
      "methods": ["GET"]
    }
  ]
}
