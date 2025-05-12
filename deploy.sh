#!/bin/bash

# 构建应用
npm run build

# 压缩dist目录
tar -czf dist.tar.gz dist/

# 上传到服务器（替换为你的服务器IP）
scp dist.tar.gz root@YOUR_SERVER_IP:/tmp/

# SSH到服务器执行部署
ssh root@YOUR_SERVER_IP << 'ENDSSH'
    # 清理旧文件
    rm -rf /usr/share/nginx/html/*
    
    # 解压新文件
    cd /tmp
    tar -xzf dist.tar.gz
    cp -r dist/* /usr/share/nginx/html/
    
    # 清理临时文件
    rm -rf dist.tar.gz dist
    
    # 重启Nginx
    sudo systemctl restart nginx
ENDSSH

echo "部署完成！"
