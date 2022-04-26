---
title: "Godot 3.4 使用 TileMap 实例化场景"
date: 2022-04-20T12:04:14+08:00
tags: ["Godot"]
series: ["游戏开发"]
related: true
toc: false
---

> 主要思路参考 timothyqiu 的《[如何在 TileMap 中使用实例场景【Godot 教程】](https://www.bilibili.com/video/BV1kf4y1b7L2)》，略有优化。

原理是将取好名的 TileSet 作为「占位图」画好，加载的时候通过脚本代码自动用「场景实例」替换掉「该名称的占位图」。

## 原因

为什么要这样？关卡里不是所有元素都是一张图：比如一棵树，它不只是一张图，它有自己的碰撞体（可以通俗地理解为有模型），因此不能直接用（目前仅限图像）的 Autotile 来画。\
包括关卡里的小怪，它们不止有模型，甚至还有 AI（实现运行逻辑的脚本）。

## 代码

```GDScript
# utils.gd
extends Node
# autoload 自动加载的工具类


func instance_tiles(tilemap, tile_name, scene_path):
	var tile_id = tilemap.tile_set.find_tile_by_name(tile_name)
	assert(tile_id != -1)
	var scene = load(scene_path)
	var tile_region_size = tilemap.tile_set.tile_get_region(tile_id).size
	for pos in tilemap.get_used_cells_by_id(tile_id):
		var scene_node = scene.instance()  # 实例化一个新的场景节点
		tilemap.get_parent().add_child(scene_node)  # 把场景实例挂载到场景树
		scene_node.position = tilemap.map_to_world(pos) + tile_region_size / 2  # 修正位置
		tilemap.set_cellv(pos, -1)  # 清除占位图
```

> 然后在项目设置 > AutoLoad 加载并启用该工具脚本。

```GDScript
# level.gd
extends Node2D
# 关卡脚本


onready var _models_tilemap = {
	# 前三个节点都是 YSort 便于自动排序
	# 最后是设定好的 TileMap 节点
	"tree": $Entities/Plants/Trees/TreeTileMap,
	"bush": $Entities/Plants/Bushes/BushTileMap,
	"grass": $Entities/Plants/Grasses/GrassTileMap,
}


func _ready():
	for model in _models_tilemap:
		Utils.instance_tiles(_models_tilemap[model], model,
				"res://src/models/" + model + ".tscn")
```

与开头提到的视频教程有什么区别呢？\
主要的问题在于 timothyqiu 大佬的演示视频是用的他平台跳跃系列教程的关卡素材，实例化的场景是金币（标准的方格）。可是其他类型游戏（比如俯视角 ARPG）实际应用时可能不是标准的没有偏移量的正方形 tile，而是长方形、也许材质还带有偏移量。\
此时再用视频教程里用的 `cell_size` 来计算修正坐标就会出现错位的 bug。

## 解释

优化之处是利用{{< ruby "图块" "tile" >}}本身的尺寸大小来修正坐标，并利用 `Tex Offset` 来校正偏移量。\
场景本身的 `Sprite` 节点用的材质图偏移量有多少（注意是 `Offset` 不要和 `Position` 弄混了），TileMap > TileSet > Selected Tile > Tex Offset 就应该是多少。\
最后的效果才是「所见即所得」，编辑器里预览是什么样，实际游戏运算也一样，不存在错位。

> 为什么一些材质必须有 `Offset`？因为 YSort 节点的自动排序功能是按「原点」来排序的。\
> 因此 `Sprite` 节点的原点应该和（视觉上的）图像中心同步，否则排序后就会出现穿模 bug。

而且俯视角 2D 游戏还有个需求是材质可能重叠，比如紧挨着的两棵树上下是会重叠一部分的。\
解决方案是将设置好的 **不同** 规格的 TileMap > Cell > Size **统一** 改为固定的值（即正方形方格，比如 16 × 16）。这样就能统一按照同一标准（比例尺）对齐了。\
而且允许多个材质之间错开一部分而不是「要么完全错开，要么完全重叠」。\
另外 TileMap > Tile Origin 也可以设置为 `Center` 而不是默认的{{< ruby "左上角" "Top Left" >}}，这样相对来说大尺寸的材质就比较好操作。
