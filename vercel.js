{
  "version": 2,
  "builds": [
    {
      "src": "api/*.js",
      "use": "@vercel/node",
      "config": { 
        "runtime": "nodejs18.x",
        "includeFiles": ["api/**"]
      }
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
