# 修改记录

1. `app/templates/base_full.html` 原来的内容部分是 container ，内容为1180（自适应的），现在改为`container-fluid`
2. index.html页面的结构调整
3. js放在所有页面的最下面，可在浏览器「查看源码」查看位置
4. table标签修改为以下内容：`<table border="1" cellspacing=0 cellpadding=0>`

# 接口文档

获取经济数据
```
GET /economic
```
参数：

+ city：城市名
+ type：type类型
+ sub_type：sub_type名
+ date：年份

> type和sub_type如下：

```
[
    {
        'name': '地区生产总值',
        'type': 1,
        'child': [
            {
                'sub_type': 1,
                'sub_name': '第一产业'
            },
            {
                'sub_type': 2,
                'sub_name': '第二产业'
            },
            {
                'sub_type': 3,
                'sub_name': '第三产业'
            },
        ]
    }, {
        'name': '社会消费品总额',
        'type': 2,
        'child': [
            {
                'sub_type': 4,
                'sub_name': '城镇'
            },
            {
                'sub_type': 5,
                'sub_name': '农村'
            }
        ]
    }, {
        'name': '固定资产投资',
        'type': 3,
        'child': [
            {
                'sub_type': 6,
                'sub_name': '第一产业投资'
            },
            {
                'sub_type': 7,
                'sub_name': '第二产业投资'
            },
             {
                'sub_type': 8,
                'sub_name': '第三产业投资'
            }
        ]
    }
    ]
```
