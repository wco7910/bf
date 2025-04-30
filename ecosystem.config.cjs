module.exports = {
  apps: [
    {
      name: 'balcancefit 0.0.1',
      // instances: 1, // 0: CPU core 만큼 인스턴스 생성
      // watch: true,
      // exec_mode: 'cluster', 
      // instances: "max",
      // node_args: ["--unhandled-rejections=strict", "--experimental-specifier-resolution=node"],
      script:
        'node --unhandled-rejections=strict --experimental-specifier-resolution=node dist/www.js',
        // 'dist/www.js',
      env_production: {
        NODE_ENV: 'production',
        max_memory_restart: '1024M',
      },
      env_development: {
        NODE_ENV: 'development',
        max_memory_restart: '1024M',
      },
    },

  ],
};
