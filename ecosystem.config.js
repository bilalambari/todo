module.exports = {
    apps: [{
        name: 'todo-ambaritek',
        script: 'npx',
        args: 'vite preview --host 0.0.0.0 --port 3000',
        cwd: '/www/wwwroot/todo.ambaritek.com',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
    }]
}
