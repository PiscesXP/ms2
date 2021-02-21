# Minecraft Server Management System
Minecraft基岩版管理器 - 后端.

# Features

- [x] 代理mc服务器的stdio
- [x] 提供HTTP连接服务
- [x] 备份/恢复mc存档
- [x] 可(强制)重启mc服务器
- [x] 扩展指令集

# Usage

## 自动部署
本仓库当前配置了自动部署：

- 当你push到deploy-test分支，自动进行部署
  
- 部署后HTTP端口为53333，mc端口为54567


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
