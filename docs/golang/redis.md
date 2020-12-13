#### redis 的使用

##### mac os 安装

```bash
brew install redis
```

完成后可以使用下面的命令启动 redis 服务器

```shell
brew services start redis
# 或者
redis-server /usr/local/etc/redis.conf
```

##### 搭建 redis 集群

```shell

redis-server

#创建slave
mkdir redis
cp /usr/local/etc/redis.config ./redis
cd redis
# redis.config文件的端口号，然后添加slaveof localhost 6379
vim redis.conf

redis-serve ./redis.conf

```

连接 master

```shell
#connect
redis-cli -p 6369
#查看关系
>INFO replication

#设置数据

SET key value

#查看数据

GET key
```

连接 slave0

```shell
#connect
redis-cli -p 16369
#查看关系
>INFO replication
# master和slave可以及时同步数据
GET key
```

##### 主从切换

1.从库的 config 文件去掉 slaveof localhost 6379 重新启动下 2.主库设置为 16379 的从库
