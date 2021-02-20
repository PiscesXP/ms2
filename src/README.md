# Minecraft Server Management System

### 自定义命令

#### 天气命令

`<clear | rain | thunder> [time]`

修改天气并设置持续时间

#### 时间命令

`<day | noon | night | midnight>`

修改游戏时间

#### 画圆命令

`circle <x y z> <r> <block_id>`

以坐标`<x y z>`为圆心，`<r>`为半径，使用`<block_id>`方块画圆

#### 一键清理命令

`clean <water | snow> <x y z> [n=10] [h=5]`

清除坐标`<x y z>`四周`n`格，上下`h`格的积雪或水源，`n`和`h`为可选参数