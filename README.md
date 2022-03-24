# ACT

act is an open source and free automated configuration middle and back-end integrated product solution. It is an automated configuration system developed by vue2 and element ui. The most popular front-end technology stack and back-end service technology stack can be used to quickly build a back-end management system, Assistant agile system development.

# Preview

http://www.autoct.top

# How Use

## install act server

1. docker pull philguo/act:v1.0.0
2. configure the appsettings configuration under the /opt/config directory

```
{
    "FreeSql": {
      //数据库链接字符串
      "Connection": "Data Source=10.0.0.8;port=3306;userid=root;password=123456;database=cbb;Charset=utf8mb4;"
    },
    "Web": {
      //jwt配置
      "Key": "LSyir1XvVA7fJmNjI2Dzxj9sj4JDsakk",
      "Secret": "ktbN7JdBBUIVm4GIy68EYnc6WQ7Zy2h8",
      //token过期时间
      "AuthExpired": 7200
    },
    "Swagger": {
      "Title": "dynamic-config",
      "Version": "v1",
      "IsEnableSwagger": true
    }
}
```

3. restore sql script
4. docker run -itd --name=dc -p 80:80 -v /opt/config:/app/config philguo/act:v1.0.0

## install act cli

1. npm i act-vue-tp -g
2. npm i
3. 'vue.config.js' setting 'target'
4. npm run dev

# Join Us

- QQ Group : 592407137
- WeChat : g1269112828
