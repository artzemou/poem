module.exports = {
  apps: [
    {
      name: 'Poem',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'py', 'views'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        NODE_NO_WARNINGS: '1',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_NO_WARNINGS: '1',
        PORT: 5000
      }
    }
  ]
};
