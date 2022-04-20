---
title: "复习 Godot 开发流程 其一 前期准备"
subTitle: "工欲善其事 必先利其器"
date: 2022-04-08T22:52:10+08:00
tags: ["Godot"]
series: ["游戏开发"]
related: true
mermaid: true
katex: true
---

隔了数月再捡起 Godot 居然觉得无所适从，找不到从何下手。\
顿时一股悲哀从心底升起：曾几何时我也是过目不忘、学过一遍必如数家珍的选手。\
现在变成这个 ~~B 样~~，是谁的错呢？

虽然人老了，活还是要干的。以后还是老老实实勤做笔记吧。\
想当年中学的时候每一个老师都不厌其烦地叨叨「好记性不如烂笔头」。\
从「嗤之以鼻」到「有点道理」再到「不以为然」，到现在再反转，果然姜还是老的辣。

## 技术选型

前天（2022.4.6）刚好出了 [开发者快照](https://godotengine.org/article/dev-snapshot-godot-4-0-alpha-6) `alpha 6`，不过跟我没关系。\
一堆坑没填呢，真没精力开新坑了。（至少等年中 beta 再说）

> 话说之前 Godot 4.0 开发进度竟然从 82% 倒退回 81%，挺乐的。\
> （关闭的 issues 没有新开的多就会这样）

4.0 肯定是和 3.x 不兼容的——改了很多语法，重命名部分系统函数和变量。\
好消息是官方确认会出迁移工具帮助 3.x 项目过渡到 4.0。\
不过我估计有也不会用，毕竟我这种，啊，强迫症晚期，啊，人称重构狂魔。\
~~Code Review 对我来说是一种享受。~~

这次用的是最新的稳定版 `v3.4.4.stable.official [419e713a2]`。

## 参考文档

<span class="sticker">
  <a href="https://docs.godotengine.org/en/stable/" target="_blank"><img src="https://img.shields.io/badge/Godot-官方文档-informational" /></a>
  <a href="http://godot.pro/doc/index.html" target="_blank"><img src="https://img.shields.io/badge/文档-中文翻译-informational" /></a>
  <a href="https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html" target="_blank"><img src="https://img.shields.io/badge/GDScript-语法-informational" /></a>
</span>

## 开发范式

### 代码格式

「[代码格式](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html#formatting)」参考 Python 的《[PEP 8 编程风格指南](https://www.python.org/dev/peps/pep-0008/)》。

### 命名约定

「[文件命名](https://docs.godotengine.org/en/stable/tutorials/best_practices/project_organization.html)」考虑到项目一致性，文件命名统一使用全小写蛇形 `snake_case`。

> 除非你写的是 C# 要用{{< ruby "类名做文件名" "ClassName" >}}，那你用大驼峰。\
> 当然 场景 / 类 / 节点 的命名仍使用大驼峰，和默认的节点名格式保持一致。

「[变量命名](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html#naming-conventions)」就那一套，没什么可说的。

### 代码顺序

「[代码顺序](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html#code-order)」如下：

```GDScript
tool  # 标记为工具脚本(会在编辑器直接执行 不用运行调试器)
class_name  # (可选)类定义
extends  # 继承
# docstring 多行文档说明

signals  # 信号
enums  # 枚举
constants  # 常量
exported variables  # 导出变量
public variables  # 公共变量
private variables  # 私有变量
onready variables  # 自动初始化变量

optional built-in virtual _init method  # (可选)内置的初始化虚函数
built-in virtual _ready method  # 内置的初始化完成(节点第一次级联场景树时)虚函数
remaining built-in virtual methods  # 其他内置的虚函数
public methods  # 公共方法(函数)
private methods  # 私有方法
```

> 「方法」就是「函数」。一般**面向对象**叫 {{< ruby "方法" "method" >}}、**面向过程**叫 {{< ruby "函数" "function" >}}。

这个顺序一定要背下来吗？\
不要，谁有功夫背这个。[自定义脚本模板](https://docs.godotengine.org/en/stable/tutorials/scripting/creating_script_templates.html)直接套就完了。\
Windows 打开 `%APPDATA%\Godot\script_templates`，新建文本文件 `all_comments.gd`：

```GDScript
extends %BASE%
# docstring 文档说明


################################################################
# Signals 信号
################################################################

################################################################
# Enums 枚举
################################################################

################################################################
# Constants 常量
################################################################

################################################################
# Exported variables 导出变量
################################################################

################################################################
# Public variables 公共变量
################################################################

################################################################
# Private variables 私有变量
################################################################

################################################################
# Onready variables 自动初始化变量
################################################################


################################################################
# built-in virtual methods 内置的虚函数
################################################################
#func _init()%VOID_RETURN%:
#	pass


func _ready()%VOID_RETURN%:
	pass


#func _process(delta%FLOAT_TYPE%)%VOID_RETURN%:
#	pass


################################################################
# Public methods 公共函数
################################################################


################################################################
# Private methods 私有函数
################################################################


################################################################
# Setter/Getter methods
################################################################


################################################################
# Callback methods 回调函数
################################################################

# 记得文件末尾空一行 好习惯 老生常谈了
# 我印象里起初的目的是为了兼容某些文件系统的 EOF 吞字符问题
```

## 常见 Q & A

以下答案均来自官方文档《[最佳实践](https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html)》一章。

### SceneTree（场景树）和 NodeTree（节点树）

任何游戏引擎都是围绕着构建程序所用的事物抽象的。\
在 Godot 中，游戏就是一棵由节点构成的树，树又可以结合起来构成场景。\
然后你还可以将这些节点连起来，让它们通过信号进行通信。

游戏的所有场景都汇集在场景树（Scene Tree）中，字面意思是一棵由场景形成的树。\
又由于场景是由一个个子节点聚合而成的，以树的形式保存为节点树（Node Tree），因此场景树也是节点树，一棵更大的节点树。

<div class="mermaid">
flowchart TD
	scene_root["某个场景<br>（决战关卡）"] === scene_a["场景 A<br>（BOSS）"]
	scene_root === scene_b["场景 B<br>（宝箱）"]
</div>

这是一棵（最简单的）场景树。

<div class="mermaid">
flowchart TD
	scene_root["某个场景<br>（决战关卡）"] === parent(["子节点<br>（BOSS 对象实例）"])
	scene_root === scene_b["场景 B<br>（宝箱）"]
	subgraph scene_a["场景 A（BOSS）"]
		parent === child_1(["孙节点 1<br>（BOSS 的动画）"])
		parent === child_2(["孙节点 2<br>（BOSS 的音效）"])
	end
</div>

这是**同一棵**场景树（不过是把子节点的细节显示出来了）。如上图所示：

- 场景 A 是一棵节点树；
- 包含场景 A 的「某个场景」是场景树，当然更是一棵节点树。

但是，从场景的角度来考虑设计游戏更容易，因为它们可以代表角色、武器、门或用户界面。\
节点是面向 **内部的业务逻辑** 的，场景却是面向 **实际的应用场景** 的。

你可以创建任意数量的场景，用 `.tscn` 扩展名保存到硬盘上，表示「{{< ruby "text scene" "文本场景" >}}」。\
（没错，Godot 最常见的 `.tscn` 文件就是「以文本形式保存或者说记录的场景」。）\
我们把这些文件叫作「{{< ruby "Packed Scene" "打包场景" >}}」，因为它们将场景的内容信息进行了打包。

```GDScript
var the_scene = preload("res://packed_scene.tscn").instance()
get_tree().get_root().add_child(the_scene)  # 在场景树根节点手动添加某个场景
```

### 如何选择分辨率

|   类型   |          |                                                                              尺寸                                                                               |    拉伸模式    |     拉伸比例     |
| :------: | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------: | :--------------: |
|          | 推荐设置 |                                                                        `Width × Height`                                                                         | `Stretch Mode` | `Stretch Aspect` |
| 桌面游戏 |  像素风  | `256 × 224` \~ `640 × 480`<br/>取决于你用的大部分素材，比如 `320 × 180`<br/>（1080p 的像素就真的只是一种 _风格_ 了）<br/>（我只见过有插画，游戏大规模用不现实） |   `viewport`   |      `keep`      |
| 桌面游戏 | 非像素风 |             `1920 × 1080`<br/>`3840 × 2160`（2K）<br/>（4K？独立游戏？~~噗哧~~ 大佬右转虚幻 5 如何）<br/>（有能力做 4K 的不会看本文，不会选 Godot）             |      `2d`      |     `expand`     |
| 手机游戏 |   横屏   |                                     `1280 × 720`<br/>`1920 × 1080`（针对高端机型）<br/>（再高没有意义，你的玩家没有写轮眼）                                     |      `2d`      |     `expand`     |
| 手机游戏 |   竖屏   |                                                         `720 × 1080`<br/>`1080 × 1920`（针对高端机型）                                                          |      `2d`      |     `expand`     |
| 应用程序 |          |                                                                    你想要支持的最小窗口尺寸                                                                     |   `disabled`   |     `ignore`     |

- 采用 `expand` 拉伸应该善用 **布局** 菜单将 Control 节点的锚点吸附到正确的位置。
- 不想支持异形屏（比如 16:10 的显示器，18:9 甚至 19:9 的手机）可以不用 `expand` 而是继续采用 `keep`，多余的部分会自动用黑边填充。
- 竖屏手游应该将 Display > Window > Handheld > Orientation 设置为 {{< ruby "portrait" "竖屏" >}}。
- 应用程序可以在脚本的 `_ready()` 函数中通过设置 `OS.min_window_size` 的值来定义窗口的最小尺寸。这样可以防止用户将应用窗口缩得过小，导致 UI 布局出现问题。

> 手机**显示**的分辨率和拍摄是两码事，哪怕 10 吋平板，超过 1080p 肉眼凡胎又能看出个什么花呢？\
> 恕我直言，1440p 都 TM 是纯噱头、无效堆料。\
> 你就是看得出来？（大圣收了神通吧）~~那你跟我说干嘛，你去跟中科院说啊。~~\
> 拍摄还有点说法，万一机主就是喜欢用手机拍（他买得起 RED，但他买了就是不用），拍完别说 60 吋 8K 屏，他用 IMAX 巨幕放，有钱任性爱造作，行不行？当然可以。至少物质上可以实现。

### 如何组织项目结构

文件夹名和文件名，{{< ruby "必须" "must" >}}小写，{{< ruby "尽量" "should" >}}在适当的时候使用复数形式。

举例（自用项目组织）：

```Bash
game/
│
├── assets/                 # 资源
│ ├── images/
│ └── sounds/
│
├── docs/                   # 文档
│ ├── .gdignore             # 有这个名字的文件则此目录所有内容(包括二级子目录)都会被忽略
│ ├── learning.html
│ ├── README.md
│ └── ...
│
├── src/                    # 源码
│ ├── characters/           # 角色
│ │ ├── enemies/
│ │ ├── npcs/
│ │ └── player/
│ ├── levels/               # 关卡
│ │ ├── world_01/
│ │ │ ├── w1_level_01.gd
│ │ │ ├── w1_level_01.tscn
│ │ │ ├── w1_level_02.gd
│ │ │ ├── w1_level_02.tscn
│ │ │ └── ...
│ │ ├── world_02/
│ │ └── ...
│ ├── models/               # 模型
│ │ ├── forest/
│ │ │ ├── bush.tscn
│ │ │ ├── tree.tscn
│ │ │ ├── grass.gd
│ │ │ ├── grass.tscn
│ │ │ └── ...
│ │ ├── town/
│ │ │ ├── house.tscn
│ │ │ ├── house_door.gd
│ │ │ ├── house_door.tscn
│ │ │ └── ...
│ │ └── ...
│ └── ...
│
└── project.godot           # 项目基础文件(定位项目根目录)
```

### 如何切换场景

#### 手动更换场景

| 多种实现方式 |                                                             方式                                                             |       是否继续处理        |                          缺点                           |
| :----------: | :--------------------------------------------------------------------------------------------------------------------------: | :-----------------------: | :-----------------------------------------------------: |
| 删除现有场景 | 1. `SceneTree.change_scene()`<br/>2. `SceneTree.change_scene_to()`<br/>3. `get_node("/root/Main").free()`<br/>删除整个主场景 |         卸载内存          |   回到此场景变得更昂贵<br/>（重新加载需要时间和内存）   |
| 隐藏现有场景 |                               更改节点的可见性和碰撞检测<br/>从游戏角色的角度隐藏整个节点子树                                |         处理继续          |                    增加不必要的负载                     |
| 分离现有场景 |                   `Node.remove_child(Node)`<br/>将此场景从场景树上分离<br/>类似其他引擎里的禁用（disable）                   | 仍在内存中<br/>但处理停止 | 如果场景树中存在数据更新<br/>则此场景里的数据会变得过时 |

> 小地图功能或本地多人分屏游戏可以使用 [`ViewportContainer`](https://docs.godotengine.org/en/stable/classes/class_viewportcontainer.html#class-viewportcontainer) 来同时显示多个不同的场景。

#### 直接切换场景树

对于小型游戏，一个更简易的选择是使用一个游戏单例；\
然后用 [`SceneTree.change_scene()`](https://docs.godotengine.org/en/stable/classes/class_scenetree.html#class-scenetree-method-change-scene) 直接切换游戏的主场景（舞台）。

不过这种方式需要注意 GUI 的额外处理，可以选用以下任一方式：

- GUI 也是单例
- 将 GUI 包含在世界中
- 手动添加到根节点的子节点

否则 GUI 会在场景转换时自行删除。

### 何时使用场景与脚本

正如本章一开始就讲过了：Godot 说的「场景」一般泛指的 `.tscn` 文件，其本质就是打包好的场景（Packed Scene）而已。理论上只用纯脚本就可以实现场景的所有功能。\
那么在既可以用脚本包也可以用场景的情况下，什么时候应该选用脚本呢？

#### 从性能方面考虑

- 脚本每条指令都要调用脚本 API，导致后端要进行多次 「查找」，以找到要执行的逻辑。
- 场景定义了使用序列化数据创建对象的资源。\
   引擎可以在后端批量处理场景，并提供比脚本好得多的性能。

也就是说：**场景包的速度比脚本快；游戏越大，越应该选用场景包。**

#### 从易用性方面考虑

<details class="collapse" open="open">
  <summary>使用脚本添加一个节点</summary>

```GDScript
extends Node

func _init():
	var child = Node.new()
	child.name = "Child"
	child.script = preload("Child.gd")
	child.owner = self
	add_child(child)
```

</details>

<details class="collapse">
  <summary>使用场景添加一个节点</summary>
  <p>点击加号，选中要添加的节点，点击确定。</p>
</details>

#### 从稳定性方面考虑

实际使用过程中勾选一个选项 / 改变一个数值很容易，但你很难「不小心」删掉一整行代码。\
这是好处也是坏处，是优势也是劣势：

- 「创造」过程中，采用 **脚本** 写代码一字一句交代得清清楚楚显然更保险；
- 「使用」过程中，采用 **场景** 来修改提供现成的可配置项对于 _节点本身_ 的破坏性显然更小。

因此得出下列结论。

#### 结论

- 如果想创建一个基本工具，会在不同的项目中重用，可能会提供给不同技能水平的人（包括那些不认为自己是程序员的人），那么它应该是一个脚本，最好有一个自定义名称 / 图标。
- 如果想创建一个基于本游戏特有的概念，那么它应该是一个场景，场景比脚本更容易跟踪 / 编辑（毕竟可视化），而且更安全（出错的概率更小\*），最后性能也更高。

> \* 众所周知，开发过程中最大的安全隐患是「你」，你就是一个人形 bug 制造机。\
> 你会受到体力（生理）/ 精力（心理）以及来自外界环境的各种负面影响，堪称极其不稳定。\
> ~~血肉苦弱，有机体。~~ 如果有得选，尽量不要给自己任何犯错的机会。

至于那些仅用场景无法实现的功能，当然是正常写脚本了（你想用场景也不能够啊）。\
（说起来一个游戏真正的精华，灵魂所在，往往是这些引擎本身的接口提供不了的功能。）

### `_process(delta)` 和 `_physics_process(delta)` 该用哪个

游戏是使用循环来运行的。每一帧，你都需要先更新游戏世界的状态，再把它画到屏幕上。\
刷新画面的每一帧怎么来的？当然是运算出来的。\
依赖于这个「刷新画面」的帧——我称之为前端渲染帧，{{< ruby "即俗称的 FPS" "Frames Per Second" >}}——\
就是 `_process()` 处理数据的时机。

无论渲染时间长短（进而导致{{< ruby "渲染帧速率" "FPS / 帧数" >}}高低），随着现实时间的推移同步进行一致性更新的（我称之为后端物理帧）——就是 `_physics_process()` 处理数据的时机。

而 `delta` 这个参数表示 {{< ruby "deltatime" "增量时间" >}}（$ \Delta t $），指「上一帧到这一帧经过的时间」。\
通过 deltatime 动态调整游戏的表现，就能做到（避免 _掉帧_ 发生）：\
无论游戏后端运算速率的快慢，最后展现出来玩家感受到的观感是平滑且一致的。

- 前端渲染帧越高越好；越高表示画面刷新速率越快、频率越高，画面响应越及时。\
   前端渲染帧可能随着时间、设备的不同而不同。
- 后端物理帧变化越小越好；变化越小表示游戏运行得越稳定。\
  后端物理帧会努力维持在一个固定的频率\*。

> \* 后端物理帧在默认设置下恒定为一秒 60 帧。（以格斗游戏为典型的大部分游戏都是 60 帧）\
> 你可以在 Project Settings > Physics > Common > Physics Fps 设置这个值。

任何和物理运算（比如运动和碰撞）相关的行为都应该在 `_physics_process()` 中处理，比如角色的移动速度 / 子弹的弹道速度等等。

- 大部分时候都应该将速度乘以 deltatime；\
   否则游戏一卡顿就会导致判定出现异常（它理应已抵达那里，但实际上却尚未到达那里）。
- 有时加速度也应该乘以 deltatime；\
   否则可能出现类似坠落前 90 米掉落用了 0.9 秒，最后 10 米却用了 10 秒的怪异情形。

很多玩家司空见惯的 bug 背后就是这么简单的原理。

> 以上只是范式，很多游戏并没有这样做；有些是没有顾及到，有些是不在乎，有些甚至是故意为之。\
> 比如跑毒图的都知道 GTA5 就是物理和渲染帧挂钩的：同一辆车，FPS 越高极限速度就越快。\
> 也许 R 星认为当画面掉帧时应该让操作一起卡顿对玩家来说才更公平。\
> （没有嘲讽的意思，你细想是有它的道理在的。涉及到输入反馈等多方面的游戏体验优化问题）

---

如果只是需要一个一直运行，但不需要像 `_process()` 或 `_physics_process()` 频率那么高的逻辑检查和数据缓存循环，可以利用计时器实现：

```GDScript
while true:
	my_method()
	$Timer.start()  # Timer 节点设置为 1 / 2.5 / 10 秒就随你高兴了
	yield($Timer, "timeout")
	# 这里确实需要, 其他非必要情况不推荐使用 yield, 能用信号实现就尽量用信号替代
```

### `_input(event)` 和 `_unhandled_input(event)` 该用哪个

两者都可以用来接收并处理单独的输入事件。二者的区别在于：如果按键、鼠标点击等事件没有被 `_input()` 回调或用户界面组件处理，`_unhandled_input()` 方法才会收到这个事件。

游戏中的输入通常是使用 `_unhandled_input()` 处理的。\
而 `_input()` 回调可以用来在 `_unhandled_input()` 获取前拦截并处理输入事件\*。

> \* 比如鼠标输入就应该尽量使用 `_input()` 而不是 `_unhandled_input()`，以免被奇奇怪怪的 UI 组件拦截进而导致操作失灵。

```GDScript
func _unhandled_input(event):
	match event.get_class():
		"InputEventKey":
			if Input.is_action_just_pressed("ui_accept"):
				print(get_process_delta_time())
```

为了保证最佳性能，尽可能避免在上面说的 `_process()` 或 `_physics_process()` 里高频率轮询检查玩家输入——不管实际有没有输入，它们都会触发检查（浪费巨量资源）。\
而 `_input()` 或 `_unhandled_input()` 只会在引擎实际检测到存在输入的帧上触发。

当然了，如果的确需要 deltatime 的话，你可以根据实际需求来获取对应的 deltatime。

```GDScript
func _process(delta):  # 或者 _physics_process, 具体区别详见上一节
	if Input.is_action_just_pressed("ui_select"):
		print(delta)
```

### 单例（自动加载 `autoload`）什么时候用

Godot 的场景系统虽然强大而灵活，但有一个缺点：无法保存多个场景都需要的信息。\
具体来说：玩家得分、背包 / 仓库、永久属性、持有货币、阵营声望……等等。

你当然可以通过一些变通方法来解决此问题，但是它们有其自身的局限性：

- 可以把需要的数据当成子节点来加载和卸载；\
   然而，这就意味着产生了不健康的强耦合关系——如果缺失了数据，这些场景就无法再独立正常运行。
- 可以把需要的数据存储到硬盘里的 `user://` 目录（类似存档文件），谁需要就自行读取；\
   可是频繁地读写文件是一件很麻烦也很耗资源的事，甚至可能拖累游戏运行速度。

#### 什么是 Godot 的单例

单例就是解决「在多个场景之间持久存储数据」的常见用例的实用工具。\
利用单例，你可以实现：

- 无论当前运行哪个场景，始终加载。因此可以用来切换场景和处理场景之间的过渡。
- 存储全局变量（比如玩家信息），因为 GDScript 在设计上就不支持全局变量。

> 需要注意的是 Godot 中的单例比较特殊，只是「行为」类似我们一般所说的「单例设计模式」中的那种「真」单例。也就是说，如果你确实需要，你**{{< ruby "可以" "may" >}}**把 Godot 的单例多次实例化。

#### Godot 里单例的实际用法

你可以设置 {{< ruby "自动加载" "AutoLoad" >}} 来加载「场景包」或「继承自 Node 节点（`extends Node`）的脚本」。\
比方说「Path」为 `res://player_variables.gd`，「Node Name」为 `PlayerVariables`。\
这意味着，任何节点都可以访问并使用一个名为 `PlayerVariables` 的单例：

```GDScript
var player_vars = get_node("/root/PlayerVariables")
player_vars.health -= 10
```

如果你还勾选了**{{< ruby "启用" "Enable" >}}**（默认勾选），那么就可以直接访问该单例而不需要通过 `get_node()`：

```GDScript
PlayerVariables.health -= 10
```

#### 应该在什么时机使用单例

举个实际的例子：切割音频问题。

假设我们正在制作一个平台跳跃类游戏（类似超级马里奥），希望收集金币时能够播放音效。\
如果使用 `AudioStreamPlayer` 节点，当正在播放音效时调用它，新的声音就会打断第一个声音。

有一个堪称一劳永逸的解决方案——写一个全局的、能够自动加载的类（音效管理器）。\
它会生成一个 `AudioStreamPlayers` 的节点池，每次新的音效播放请求出现就添加到节点池里开始播放。假如取名为 `Sound`，你可以在项目的任何地方使用 `Sound.play("coin_pickup.ogg")` 之类的方式轻松调用，听起来很美好是吧。

短期来看，这确实解决了问题；但与此同时，它带来了更多更大的麻烦。

- **全局对象**：整个项目**每一个**需要声音的地方现在都**强依赖**于这个音效类。假如一个音效有错误，或者找不到一个可用 `AudioStreamPlayer`，那么一切都会崩溃，**一切**。
- **全局访问**：任何对象都可以从**任何地方**调用 `Sound.play(sound_path)`。如果你发现有一个音效有错，你对于它具体在什么位置完全{{< ruby "是毫无头绪" "have no idea" >}}，你必须漫山遍野地去排查**每一个**可能出错的地方。
- **全局资源占用**：由于从游戏启动之始就维护了一个 `AudioStreamPlayer` 节点池，你不知道该如何控制数量——太少会出现 bug（被吞掉而没有播放成功的音效），太多则会占用更多其实根本没必要占用的内存。

将使用音效的场景的 `AudioStreamPlayer` 尽可能保留在其内部，以上问题都会消失。

- 每个场景管理自己的状态信息，如果数据有问题，只会在该场景{{< ruby "内部出现问题" "死道友不死贫道" >}}。
- 每个场景只会访问自己的节点，如果出现一个和它相关的 bug，不用找了，必然是它。
- 每个场景占用的内存按需分配（~~少份多次~~）；而且在不再需要时可以直接从内存中卸载掉。

> 然后会碰到一个问题：音效可能放不完——当金币被吃掉的时候播放音效，而音效还没放完可能整个金币节点就被 `queue_free()` 释放掉了。这里提两个解决方案：
>
> 1. 金币被吃的时候{{< ruby "现" "临时" >}}创建一个新的 `AudioStreamPlayer` 节点并挂载到根节点再播放，放完清理。\
>    （音效不像图形会「错位」，随便在哪放都是同样效果。~~总不可能从邻居的蓝牙音箱放出来吧~~）
> 2. 金币被吃的时候隐藏金币的图像和碰撞体，启动音效播放器，播放完毕后再释放整个金币节点。

讲清楚了为什么应该谨慎使用单例（自动加载），现在说说到底怎么用才不算乱用：

- **静态数据**：如果你需要某个类专属的数据，比如数据库，那么自动加载很合适。\
   因为 Godot 中并没有脚本 API 来创建和管理静态数据。
- **静态函数**：创建一个只返回值的函数库（工具类）。
- **范围广泛的系统**：如果一个类只管理自己的信息，而不会掺杂其他对象的数据。\
   而且这个信息可能到处都会访问，那么使用单例是一个好主意，比如任务 / 对话系统。

一句话：有一个游戏系统 1. 自己管自己（的数据）；2. 全局可访问；3. 独立存在。\
这个系统就是单例（自动加载）没跑了。

### 如何快速调试（使用 `tool` 工具脚本预览代码效果）

将 `tool` 关键字放在任何 GDScript 文件的顶部，它将在编辑器中运行。\
用[官方文档](https://docs.godotengine.org/en/stable/tutorials/plugins/running_code_in_the_editor.html)的话说：「这使您可以导入和导出插件，创建自定义级别编辑器之类的插件，或使用与项目中使用的相同的节点和 API 来创建脚本。」

我没当成脚本；我是当成「即时可见的调试器」（所见即所得）用的。不过需要注意两点：

1. 如果你写了 bug，由于立刻运行，bug 会传染给编辑器，可能导致编辑器崩溃。\
   （比如涉及 `queue_free()`，一定要**极其谨慎**，小心再小心。）\
   解决方案：主要逻辑写完测过没问题再在文件开头加上 tool 慢慢~~调教~~ 调试。
2. 如果你状态不太好（加班太久神智不清），可能会忘记编辑器和实际运行之间是有区别的。\
   （然后你 debug 半天死活没有效果差点疯掉，最后发现是编辑器和游戏的代码弄混了。）\
   解决方案：把在编辑器中运行的代码和在游戏中运行的代码分开，如下所示。

```GDScript
func _process(delta):
	if Engine.editor_hint:
		print("现在在编辑器中", delta)
	else:
		print("现在在游戏中", delta)
```

### 如何自定义数据结构

并不是任何事都必须用 Node 节点来完成；比如自定义数据结构，使用 Object 扩展即可。

给大家简单表演一个链表助助兴吧：

```GDScript
# linked_list.gd
extends Object
class_name LinkedList  # 定义 class_name 后 本类会被视为全局变量 直接用就完了
# 简单的链表实现


class LinkedListNode:  # 链表节点内部类
	var value = null
	var next = null

	func _init(p_value, p_next = null):  # 递归结构
		self.value = p_value
		self.next = p_next


var head = null  # 单向链表头部


func _init(value):
	self.head = LinkedListNode.new(value)


func find_node(value):  # 寻找节点
	var current = self.head
	while current and current.value != value:
			current = current.next
	if current == null:
		print("Node ", value, " not found!")
		return null
	print("Node ", value, " found.")
	return current


func insert_after(value, new_value):  # 插入节点
	var new_node = LinkedListNode.new(new_value)
	var current = self.find_node(value)
	new_node.next = current.next
	current.next = new_node


func append(value):  # 在尾部添加节点
	var new_node = LinkedListNode.new(value)
	var current = self.head
	while current.next:
		current = current.next
	current.next = new_node


func prepend(value):  # 在头部添加节点
	var new_node = LinkedListNode.new(value)
	new_node.next = self.head
	self.head = new_node


func remove(value):  # 移除指定节点
	var current = self.head
	var previous_node = null
	while current and current.value != value:
		previous_node = current
		current = current.next
	if current == self.head:
		self.head = current.next
	else:
		previous_node.next = current.next


func remove_head():  # 移除头部节点
	self.head = self.head.next


func remove_tail():  # 移除尾部节点
	var current = self.head
	var previous_node = null
	while current and current.next:
		previous_node = current
		current = current.next
	previous_node.next = null


func traverse():  # 遍历节点
	var current = self.head
	var temp = ""
	while current:
		temp += str(current.value) + " "
		current = current.next
	print(temp)
```

> 如果是继承节点（`extends Node`）的脚本定义了 `class_name` 还会自动加入节点列表。

单元测试：

```GDScript
# main.gd
extends Node


func _ready():
	var linked_list = LinkedList.new(1)  # 不需要额外引入 直接用即可 原因上面讲过了

	linked_list.append(2)
	linked_list.append(3)
	linked_list.append(4)
	linked_list.traverse()  # 1, 2, 3, 4

	linked_list.insert_after(2, 5)
	linked_list.traverse()  # 1, 2, 5, 3, 4

	linked_list.prepend(6)
	linked_list.traverse()  # 6, 1, 2, 5, 3, 4

	linked_list.remove(3)
	linked_list.traverse()  # 6, 1, 2, 5, 4

	linked_list.remove_head()
	linked_list.traverse()  # 1, 2, 5, 4

	linked_list.remove_tail()
	linked_list.traverse()  # 1, 2, 5

	linked_list.find_node(2)
	linked_list.find_node(3)
```

预期结果：

```
1 2 3 4
Node 2 found.
1 2 5 3 4
6 1 2 5 3 4
6 1 2 5 4
1 2 5 4
1 2 5
Node 2 found.
Node 3 not found!
```

这里只是简单演示一下用法，如何做内存管理、甚至扩展成 `双向循环链表` 此处不再赘述。

> Object 不管理内存，如果类继承自 Object，必须手动删除（`free`）它的实例来释放内存。

```GDScript
extends Object
class_name TreeNode

var _parent : TreeNode = null
var _children : = [] setget  # TODO 这里写 setter 和 getter

func _notification(p_what):
	match p_what:
		NOTIFICATION_PREDELETE:  # 手动实现析构函数
			for a_child in _children:
				a_child.free()
```

同理，`队列`、`栈`、`堆`、`二叉搜索树` / `红黑树` / `散列树` / 各种 `树`、各种 `图`、不相交集……\
无论何种数据结构，只要你想，你做就完了。\
GDScript 是一门具有自举能力的独立编程「语言」。

> Godot 就是用 GDScript 写的，编辑器本身其实就是一个 Godot 游戏。

除了 [Object](https://docs.godotengine.org/en/stable/classes/class_object.html#class-object) 之外，你还可以使用 [Reference](https://docs.godotengine.org/en/stable/classes/class_reference.html#class-reference)，如果你不想手动进行内存管理的话。\
Reference 会跟踪对自己的引用，只有当对自己没有另外的引用存在时，才会删除加载的内存。
（除此之外跟 Object 没啥区别。`Tree` 节点就是 Object，`File` 对象就是 Reference。）

如果你想将数据结构保存为文件，可以再进一步使用 [Resource](https://docs.godotengine.org/en/stable/classes/class_resource.html#class-resource)。\
它们天然具有将其对象属性，序列化和反序列化 Godot 资源文件的能力。\
（用人话说：以文件形式保存和加载。脚本 `.gd` 和场景包 `.tscn` 其实就是 Resource。）\
具体用法可以参考「[创建自己的资源](https://docs.godotengine.org/en/stable/tutorials/scripting/resources.html#creating-your-own-resources)」。

### 如何应用面向对象原则

如果可能的话，应该尽量设计没有依赖性的场景。\
你应该创建场景，而场景将所需的一切保留在其内部。

另外设计项目架构时可以思考以下几个问题：

#### 聚合 or 组合

- 聚合：简单地聚在一起，彼此之间并不直接依赖。
- 组合：除了聚在一起之外，还进一步互相连接彼此，进而形成一个整体。

#### 继承 or 构造

- 继承：全盘接受父类的一切，并在此基础上扩展自己的特有功能。
- 构造：想象一堆拼到一半的乐高积木，你可以选择自己想要的不同部件组成特定的整体。

#### 场景如何与外部环境交互

一句话：向下调用（善用 `$`），向上信号。\
具体应用可以参考官方文档对 [依赖注入](https://docs.godotengine.org/en/stable/tutorials/best_practices/scene_organization.html#how-to-build-relationships-effectively) 设计模式的实现。
