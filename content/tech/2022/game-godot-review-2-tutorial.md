---
title: "复习 Godot 开发流程 其二 重温教程"
subTitle: "First Godot Demo Code Review"
date: 2022-04-09T19:36:54+08:00
tags: ["Godot"]
series: ["游戏开发"]
related: true
katex: true
---

还是本杰明大佬的「[Make an Action RPG in Godot 3.2](https://youtu.be/mAbG8Oi-SvQ)」（[素材](https://github.com/uheartbeast/youtube-tutorials)）这个教程。\
这应该是刷第四遍了，真的不错。常用的基础知识点比较全面，学习曲线也很平缓。

我是一个**巨讨厌**视频教程的人，因为视频往往意味着追求「泛用」「通识」，和「因材施教」这个词完全是反着来的。\
文本我可以自由控制阅读速度，简单的一目了然那就读快点，复杂的就反反复复多读几遍。\
甚至不用翻页，抬抬眼皮挪动目光就可以。视频呢？

- 过于简单的常识你听着的同时几乎没有办法控制地油然而生一股焦躁。\
  我的时间非常宝贵，真的没有那么多生命给你浪费。\
  你还不敢随便拉进度条，因为你不知道对方什么时候会突然讲一个核心重点——\
  也许你打开这个视频的全部目的就只是为了这一个重点。你根本无从预料。
- 复杂的知识需要反复观看来加深理解，你只能拖进度条，还不知道具体应该拖到什么位置。\
  重看几遍就要拖几遍进度条，冲着学习去上过网课的大概都懂，这真的是巨大的心力成本。

拿沐浴来打比方，文档 / 图文教程就像淋浴，你随时可以选择抽身离开或者直接关掉水龙头。\
视频教程就像泡澡，舒服肯定比淋浴舒服，但对其本身的硬性条件要求很高，水温太凉或者太烫（你已经{{< ruby "泡在里面" "打开视频" >}}）都会让你想打人。

但做的好的视频教程还是有，本哥这个视频的信息密度就属于我能接受的程度。\
虽然还是有点初级 / 啰嗦；不过考虑到质量可以容忍，对我来说完全没问题。~~水温非常舒适~~

由于我这是 n 进宫了就不记那些过于基础的知识点了，此处只记录涉及到的相关最佳实践。

## 项目设置

1. 像素风格小图片素材{{< ruby "导入" "Import" >}}时 **不能勾**「Filter」，最好「{{< ruby "预设" "Preset" >}}」改成 `2D Pixel`。\
   如果后续的图片素材也同样都是像素风，可以把这个预设 `2D Pixel` 设为默认。
2. 菜单栏 →「Project」→「Project Settings...」→「General」标签——\
   再选中「Display」栏的「Window」项设置游戏窗口。\
   开头的 `Width/Height` 是「真实尺寸」，`Test Width/Height` 是「调试时显示尺寸」。\
   记得拉到最下面的{{< ruby "拉伸" "Stretch" >}}，启用 `viewport` {{< ruby "模式" "Mode" >}}，{{< ruby "方向" "Aspect" >}}选为 `keep`（保持横纵比）。

## 引入角色

1. 添加 `KinematicBody2D` 节点（运动学物体、即会动的物理碰撞体）并命名为 `Player` 作为玩家的载体，以确保我们以后能控制它行动。
2. 可以观察到 `KinematicBody2D` 节点本身是不可见的，所以还要给它添加一个 `Sprite` 子节点，用来显示玩家的形象。
3. 把用到的 PNG Sprite 素材拖到 `Sprite` 节点的{{< ruby "材质" "Texture" >}}，把{{< ruby "动画设置项" "Animation" >}}的{{< ruby "水平帧" "Hframes" >}}调成素材对应的帧数（这个教程里用的素材是 `60`）。
4. 选中 `KinematicBody2D` 节点，勾选锁定右边的「Makes sure the object's children are not selectable.（确保子对象不能被选中）」，绑定属于玩家的整棵节点树。
5. 右键 `KinematicBody2D` 节点选择「Save Branch as Scene（将分支另存为独立场景）」。

## 简单 FSM（有限状态机）和控制角色移动

给 Player 添加脚本。没啥好说的，都在注释里了：

```GDScript
enum { IDLE, MOVE, ROLL, ATTACK }  # 枚举状态自动机所有状态 所谓"有限"嘛

# 导出变量的好处是可以在调试游戏时**即时调整数值**动态观察效果
export(float) var max_speed = 100.0  # 移速上限
export(float) var acceleration = 25.0  # 加速度 可以理解为角色的移动力
export(float) var friction = 10.0  # 环境摩擦力
export(float) var roll_speed = 125.0  # 翻滚速度 暂时没用上

var face_aspect: Vector2 = Vector2.ZERO  # 面向矢量
var move_vector: Vector2 = Vector2.ZERO  # 移动矢量
onready var _action_state = IDLE  # 记录状态机的状态


func _physics_process(delta):
	match self._action_state:  # 根据状态机变化执行对应动作
		ROLL:
			do_roll()  # 翻滚
		ATTACK:
			do_attack()  # 攻击
		_:
			do_move(delta)  # 移动


func _unhandled_input(_event):
	var input_vector: Vector2 = Vector2.ZERO
	input_vector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
	input_vector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	#print("[DEBUG] 当前移动方向", input_vector)
	self.face_aspect  = input_vector.normalized()  # 归一化向量 防止对角线(√2)移动更快
	if self.face_aspect == Vector2.ZERO:
		self._action_state = IDLE
	else:
		self._action_state = MOVE
	if Input.is_action_just_pressed("action_attack"):
		self._action_state = ATTACK  # 同时移动优先攻击
	if Input.is_action_just_pressed("action_roll"):
		self._action_state = ROLL  # 同时攻击优先翻滚


func do_move(delta):
	if self.face_aspect != Vector2.ZERO:
		self.move_vector = self.move_vector.move_toward(  # 被摩擦力逼停
				Vector2.ZERO,
				clamp(friction, 0.0, max_speed) * 60 * delta)  # 物理帧补正卡顿
	else:
		self.move_vector = self.move_vector.move_toward(  # 克服摩擦力做功
				self.face_aspect * max_speed,
				clamp(acceleration - friction, 0.0, max_speed) * 60 * delta)  # 不能为负导致反向加速
	self.move_vector = move_and_slide(self.move_vector)  # 自动处理物理帧补正卡顿


func do_attack():
	print("[DEBUG] 攻击输入判定帧")


func do_roll():
	print("[DEBUG] 翻滚输入判定帧")
```

稍微解释一下以上设计：\
移速上限为 `100`，如果没有摩擦力会在 $ 100 \div 25 = 4 $ 帧之内从**静止**逐渐加速直至移速上限。\
而有了摩擦力就至少需要 $ \lfloor 100 \div (25 - 10) \rfloor = 6 $ 帧用来加速，同时停止运动时也会体现渐出的丝滑效果，符合事实逻辑。\
Godot 也是标准的一秒 60 帧（再强调一次是后端的物理运算帧，不是前端的渲染帧），算下来一帧也就 0.02 秒不到，你也许会质疑多这两帧有啥意义。但话不是这样讲的。\
一个游戏所谓的手感真不是玄学，都是无数个这样毫不起眼的细节堆出来的。

就算不提手感这种很主观的概念，很多游戏内部的重要机制也取决于此。\
比如《剑网 3》的「加速」属性，为什么要分段？为什么加速属性的收益是阶梯式的？\
如果 2 帧不重要，那大附魔小附魔小药小吃之类的增益不也是蚊子腿吗？为什么那么贵？

而且质疑「区区游戏，何论手感？」其实是一件很没道理的事。\
照这么说 FTG（格斗游戏）的动画取消、立回、确反都是笑话咯？小心被真人格斗。\
你做不到不代表别人做不到。\
有人真的是按帧玩游戏的，《任天堂明星大乱斗 {{< ruby "Melee" "日版叫 DX" >}}》的 {{< ruby "双闪光" "Double Shine" >}} 甚至无限闪光了解一下。

- 虚假的电子竞技：「运营」40 分钟，一波推平。（搁这下棋呢？）
- 真正的电子竞技：1 帧决胜负。不是最后定输赢的 1 帧，是你操作的 **每 1 帧**。

扯远了，话说回来，这里的设计并不全是为了所谓「手感」，甚至不是主要目的。\
主要目的是为了游戏的「仿真」程度。

一个游戏拥有逼真的物理引擎是很有必要的，因为当没有人能够预料到的意外发生之时，你作为游戏制作者唯一能够指望的就是程序本身的健壮性，你不可能飞到玩家家里抢下手柄现修 bug。\
只要拟真程度足够高，哪怕游戏出现了意外，最后产生的效果也会在人类的理解范围内，能够继续正常游玩；在机缘巧合之下甚至可能反过来增加游戏性，变成游戏的一部分。

而且扩展性强对后续的开发复用也很有好处。\
比如我要做一个沼泽地形，在上面走会减速，怎么想都要侵入原本的移动系统，该如何设计呢？\
打好了基础，我连一行代码都不用改，把对应的摩擦力数值调高就是了。\
某种程度上不能说是功在千秋，也可以说一劳永逸了。

## 给角色添加碰撞体以及 YSort 自动排序

一个角色有形象、能运动，就够了吗？当然不。游戏是用来玩的，不是用来看的。\
所以我们需要碰撞体，来和环境乃至其他一切物体产生「交互」。

1. 给 `Player` 添加子节点 `CollisionShape2D`（碰撞形状）。
2. 设置项的 `Shape` 选择 `New CapsuleShape2D`（胶囊状），这个形状的好处是碰到拐角等犄角旮旯的时候更容易转向，而不是被卡住动弹不得。
3. 同样给别的实体也加上碰撞体，树啊灌木啊之类的，然后就可以产生碰撞了。
4. 此时发现两个实体重叠时显示的优先级是节点的排序决定的，这显然不合理。\
   （显示角色会浮在树叶上或者被压在树干下。）
5. 添加 `YSort` 节点（我命名为 `Entities`），直接把所有实体都丢到里面，现在可以发现自动排序了。需要注意 `YSort` 是根据节点的「原点」来排序的，所以记得调整好 Sprite、碰撞体、阴影等节点本身的相对位置，避免仍然显示异常。

## 给角色添加动作动画

1. 添加子节点 `AnimationPlayer` 插帧完成各向动画。
2. 添加子节点 `AnimationTree`，右键「Add BlendSpace2D」，点击编辑进入{{< ruby "座标视图" "Blend Space" >}}。
3. 点击第三个按钮「Create Points.」，分别在四个顶点（注意 Y 轴正方向是下，反过来的）添加动画，并把{{< ruby "混合" "Blend" >}}模式改成虚线（否则会鬼畜）。虚线代表不同状态之间的过渡是离散的，如果是骨骼动画才是用实线（自动补间完成关键帧之间的平滑过渡）。
4. 并将 y 方向的正负上限设置为 `±1.1`，调整顶点形成新的三角，这样一来斜向移动就优先显示为横向了。因为面向落在三角里永远顶不满 y 轴，比如右上的矢量就会落在偏右的地方。
5. 同样设置另一个，并将「Idle」和「Run」两个 Blend 节点连接起来，把「Idle」设置为自动播放，让动画树起始就处于 Idle 状态。

```GDScript
onready var _animation_tree = $AnimationTree  # 获取动画树
onready var _animation_state = _animation_tree.get("parameters/playback")  # 获取动画树的状态机


func do_move(delta):
	if self.face_aspect == Vector2.ZERO:
		self.move_vector = self.move_vector.move_toward(  # 被摩擦力逼停
				Vector2.ZERO,
				clamp(friction, 0.0, max_speed) * 60 * delta)  # 物理帧补正卡顿
		self._animation_state.travel("Idle")  # 更新动画树的状态机 播放对应面向矢量方向的闲置动画
	else:
		self.move_vector = self.move_vector.move_toward(  # 克服摩擦力做功
				self.face_aspect * max_speed,
				clamp(acceleration - friction, 0.0, max_speed) * 60 * delta)  # 不能为负导致反向加速
		self._animation_tree.set("parameters/Run/blend_position", self.face_aspect)  # 将移动方向的混合座标设置为面向矢量
		self._animation_tree.set("parameters/Idle/blend_position", self.face_aspect)  # 同步闲置时的面向 确保停下来时不会突然转身
		self._animation_state.travel("Run")  # 更新动画树的状态机 播放对应面向矢量方向的奔跑动画
	self.move_vector = move_and_slide(self.move_vector)  # 自动处理物理帧补正卡顿
```

## 设置游戏背景图像

1. 可以标准方案 `Sprite` 节点启用 `Region` 设置，导入素材时启用 `Repeat`。
2. 也可以利用 `TextureRect` 节点设置{{< ruby "拉伸模式" "Stretch Mode" >}}为 `Tile` 自动填充，比 `Sprite` 节点必须手动调整尺寸方便一点。不过问题在于 `TextureRect` 节点是 `Control` 节点的子节点，也就是说它本质上是一个 UI 节点，不应该被当作背景使用。
3. 建议使用第一种方法，以免以后出现莫名其妙的显示错位问题。~~多改两个数字累不死~~

## 利用 TileMap 节点自动铺砖

1. 在游戏关卡场景新建 `TileMap` 子节点，「New TileSet」，导入素材 [^tilesetter]。
2. 「Edit」素材，随便拉一个区域（然后才会出现进一步的选项），启用{{< ruby "对齐" "Snap" >}}按钮，把 `Snap Options` 的{{< ruby "步长" "Step" >}}改为 `16 × 16`，现在可以重新选定区域了，把所有图块都包含进来。
3. 设定 `Autotile Bitmask Mode` 设置为 `3×3 (minimal)`，`Subtile Size` 也改为 `16 × 16`，然后就可以画 {{< ruby "位掩码" "Bitmask" >}} 了。

[^tilesetter]: 此类素材可以用 [Tilesetter](https://www.tilesetter.org/downloads) 生成。（就是 13 刀有点小贵）

![](https://s2.loli.net/2022/04/10/cF3E2QujLUA5YdC.png)

原理很简单，就是一个九宫格，除开自己不是有 8 个方向的「邻居」嘛；\
根据哪些方位有邻居，哪些方位没有，来判断合适的对应图样（以自动完成无缝拼接）。\
更详细的原理可以参考《[How to Use Tile Bitmasking to Auto-Tile Your Level Layouts](https://gamedevelopment.tutsplus.com/tutorials/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673)》这篇文章以及官方文档《[Using TileMaps](https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html)》。（实在看得眼花照着上图抄作业就是了。）

至于 `Name` 和 `Icon` 无所谓，可以改成自己喜欢的。\
切换回关卡场景，选中设定好的 TileMap 就可以快速设计关卡（画地图）了。\
（和画 Bitmask 一样左键画右键擦。）

> 技术的进步啊。想当年前辈们完成这一步，每一格都要肉眼认、手动选……

说到 TileMap，其实目前的功能还非常有限，4.0 原生支持将场景作为 tile，到时候就起飞了。\
其实现在（Godot 3.4）也可以，详见《<a href="/tech/game-godot-trick-instance-tilemap/" target="_blank">Godot 3.4 使用 TileMap 实例化场景</a>》。

## 给 TileMap 添加碰撞体

1. 故技重施，将悬崖也设置为 Autotile，注意悬崖的图片要大一点，`TileMap` 节点 `Cell` 设置项的 `Size` 和里面 `TileSet` 的 `Subtile Size` 都是 `32 × 32`。
2. 掩码不需要重画一遍，画好的 Bitmask 是可以复制（Copy bitmask.）和粘贴的。
3. 搞定掩码之后按下 <kbd>2</kbd> 切换到 {{< ruby "碰撞体" "Collision" >}} 设置，给 Autotile 添加碰撞体积。
4. 这里操作有点繁琐，必须一个一个单独设置，最快的操作是：
   1. 左键点击选中方格；
   2. <kbd>Shift</kbd>+<kbd>R</kbd> 添加新矩形；
   3. 再次左键点击放下矩形。
5. 现在用 Aututile 铺好的悬崖就有碰撞体积了（作为墙使用）。

## 区域检测（Hitbox & Hurtbox）

1. 新建一个场景，添加 `Area2D` 节点，添加 `CollisionShape2D` 子节点，保存为单独的场景 {{< ruby "Hitbox" "伤害判定框" >}}，{{< ruby "Huttbox" "受伤害检测框" >}} 如法炮制。\
   故意不给 `CollisionShape2D` 子节点添加形状是为了将这两个通用类抽象出来，便于复用。
2. 新建一个草的场景，「{{< ruby "Instance Child Scene" "实例化子场景" >}}」选择保存的 `Hurtbox` 场景文件。
3. 右键勾选「{{< ruby "Editable Children" "可编辑子节点" >}}」，这样就给草自定义了专属的 Hurtbox。
4. 给角色添加一个 `Position2D` 子节点（我命名为 `Barycenter`），给 `Barycenter` 节点实例化一个 Hitbox。调整 `Barycenter` 的位置，这样攻击的判定才根据角色的中心对称。
5. 回到动画播放器，给 `Barycenter` 添加 `Rotation Degree` 的关键帧，让重心面向跟随攻击动画方向旋转。
6. 继续给 Hitbox 具体**形状**的 `Disable` 添加关键帧。攻击动画有 4 帧，想让中间 2 帧有攻击判定，那么就要让动画在第 2 帧开始时取消禁用，第 4 帧开始时勾选禁用。\
   平时就把 Hitbox 禁用掉，只有做出攻击动作的时候才会出现攻击判定框。
7. 然后是 Collision `Layer` / `Mask` 的设置。Godot 默认设置都是同一层（即第 1 层），这是为了在游戏没有做更多额外设置的时候生效，实际上是不合理的。\
   你可以想象一对发送者和接收者，是把自己的位置信息发送给对方。\
    （默认是众生平等一律视为同一种东西，自己发送给自己，因此一切碰撞都会相互影响。）\
    更通俗一点也可以用本哥视频里的说法：你是「坐在」Layer 层，然后「面对」Mask 层。

| Layer      |                    |                   |      |
| :--------- | :----------------- | :---------------- | :--- |
| `#1` World | `#2` Player        | `#3` Enemy        | `#4` |
| `#5`       | `#6` PlayerHurtbox | `#7` EnemyHurtbox | `#8` |

| Mask       |                    |                   |      |
| :--------- | :----------------- | :---------------- | :--- |
| `#1` World | `#2` Player        | `#3` Enemy        | `#4` |
| `#5`       | `#6` PlayerHurtbox | `#7` EnemyHurtbox | `#8` |

可以在项目设置的「2d Physics」设置项里命名，重新项目生效。

|         物体         |            Layer            |            Mask            |                                                                                            说明                                                                                            |
| :------------------: | :-------------------------: | :------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 悬崖、灌木等环境实体 |           `World`           |                            |                                                                     没有任何 Mask<br/>它们都是死物，不会主动去找谁互动                                                                     |
|     可破坏的罐子     |  `World`<br>`EnemyHurtbox`  |                            |                                                          它既是实体，可以和其他实体产生碰撞<br/>同时可以视为一个「不会动的敌人」                                                           |
|     可破坏的草丛     |       `EnemyHurtbox`        |                            |                                                                                    相当于没有实体的罐子                                                                                    |
|         玩家         | `Player`<br>`PlayerHurtbox` | `World`<br>`EnemyHurtbox`  | 具有和环境发生互动的主观能动性<br/>因此会和 `World` 层产生碰撞<br/>还会对敌人造成伤害<br/>其实 Mask 可以加上 `Enemy`<br/>这样敌人就会和玩家产生体积碰撞<br/>可以根据设计选择是否能卡住玩家 |
|         敌人         |  `Enemy`<br>`EnemyHurtbox`  | `World`<br>`PlayerHurtbox` |                                                                                          原理同上                                                                                          |

举个例子，比如单独把玩家抽出来看就是：

- 会和悬崖、墙壁、树木、灌木等环境产生碰撞，但会穿过草丛、敌人、其他玩家；\
  （网游里考虑到同屏单位数量一般都是可以穿怪穿人的，单机讲究身位的话一般不能。）
- 攻击会对罐子、草丛、敌人生效；
- 会受到敌人的攻击。
- 玩家和敌人不会互相碰撞，但却都会被环境的实体阻挡。

非常简单易懂。

至于 `Player`、`Enemy` 分别和自己的 `Hurtbox` 分开也是有必要的。\
比如一位长腿的大~~姐姐~~ 蜘蛛，打腿可能不算做伤害（攻击判定没有进 Hurtbox），但讲究的游戏（追求不穿模）就会做模型修正让腿无法穿过地面（做出自动屈膝之类的动作来贴合地面）。\
或者说一个穿披风的角色——披风一般是有布料演算的，不会直接穿过身体——但披风飘在空中被打到显然不能算伤害，否则就太不合理了。

## 击退效果和伤害属性

`area_entered` 这个信号传递的参数 `area` 是整个 `Area2D` 节点对象，在里面写什么属性都可以。

```GDScript
# player.gd
extends KinematicBody2D
# 玩家的主脚本


func do_move(delta: float):
	# 前略
	$Hitbox.knockback_vector = self.move_vector  # 击退方向与面向同步
	# 后略
```

```GDScript
# sword_hitbox.gd
extends Area2D
# 玩家的 Hitbox (可以视为武器属性)


export(float) var knockback_power: float = 20.0  # 击退力
export(float) var damage: float = 1.0  # 伤害

var knockback_vector = Vector2.ZERO setget set_knockback


# 归一(标准)化击退效果
# 当然也可以不做 那样就是把移动速度也加成进击退效果 也说得通
func set_knockback(aspect: Vector2):
	knockback_vector = aspect.normalized() * knockback_power * 10
```

然后 `area_entered` 信号的回调函数 `_on_area_entered(area)` 的参数就是 `sword_hitbox.gd` 这个脚本（{{< ruby "附着" "attach" >}}的节点）。

```GDScript
# enemy.gd
extends KinematicBody2D
# 敌人的主脚本 不过单独写在hurtbox的脚本也可以


export(float) var air_friction = 10.0  # 空气摩擦力

var _knockback = Vector2.ZERO
var _health = 2.0


func _physics_process(delta):
	_knockback = _knockback.move_toward(  # 被摩擦力逼停
			Vector2.ZERO,
			max(air_friction, 0.0) * delta * 60)  # 物理帧补正卡顿
	_knockback = move_and_slide(_knockback)  # 处理击退力(被击退)


func _on_area_entered(sword_hitbox):
	self._knockback = sword_hitbox.knockback_vector  # 获取击退力并应用
	self._health -= sword_hitbox.damage  # 获取伤害并应用
```

## 抽象出特效动画

如果不同敌人具有不同的消失特效，每次都要重写一遍动画脚本就很麻烦。\
因此可以把针对性的特定脚本抽象成通用的脚本。

```GDScript
# hit_effect.gd
extends AnimatedSprite
# 受击特效动画


func _ready():
	var err = self.connect("animation_finished", self, "_on_animation_finished")  # 连接信号
	assert(err == 0)  # 断言没有错误
	play("default")  # 播放默认的动画(受击特效)


func _on_animation_finished():  # 信号回调函数
	queue_free()  # 当动画播放完毕之后释放自己
```

接着建立对应的 `AnimatedSprite` 动画节点，应用素材（帧动画），保存为单独的场景（假设为 `grass_effect.tscn`），直接把以上的脚本附上，之后主脚本直接实例化「特效场景」即可。

```GDScript
# grass.gd
extends Node2D
# 草的主脚本


const GRASS_EFFECT = preload("res://src/models/grass_effect.tscn")  # 预加载特效动画场景


func _play_vanish_animation():
	var grass_effect = GRASS_EFFECT.instance()  # 实例化特效动画场景
	get_parent().add_child(grass_effect)  # 将特效动画添加为兄弟节点
	# 添加为兄弟节点 而不是根节点(get_tree)的子节点 有一个好处:
	# 草场景的父节点是YSort(自动排序)节点 这样一来动画也会自动应用排序效果
	grass_effect.global_position = global_position  # 修正动画的播放位置


func _on_Hurtbox_area_entered(_area):
	_play_vanish_animation()  # 播放动画
	# 由于动画是单独的场景 播放完毕会释放它自己(占用的内存) 所以不用管了
	queue_free()  # 释放自己(草本身)就完事
	# 如果有血量(不是草而是其他敌人) 一次打不死 也是在这里加判定
```

## 小怪 AI：索敌

```GDScript
# player_detection.gd
extends Area2D
# 玩家检测节点的脚本


var player = null


func can_see_player() -> bool:
	return player != null


func _on_PlayerDetectionZone_body_entered(body):
	player = body


func _on_PlayerDetectionZone_body_exited(_body):
	player = null
```

```GDScript
# enemy.gd
extends KinematicBody2D
# 敌人主脚本 与本节无关的内容已酌情删减


enum { IDLE, WANDER, CHASE }  # 枚举状态自动机所有状态

export(float) var max_speed = 60.0  # 移速上限
export(float) var acceleration = 50.0  # 加速度
export(float) var friction = 40.0  # 环境摩擦力
export(float) var air_friction = 10.0  # 空气摩擦力

var _move_vector: Vector2 = Vector2.ZERO  # 移动矢量
var _knockback = Vector2.ZERO  # 击退矢量

onready var _action_state = IDLE  # 记录状态机的状态
onready var _sprite = $AnimatedSprite
onready var _player_detection = $PlayerDetectionZone  # 索敌范围(检测玩家用的 Area2D 节点)


func _physics_process(delta):
	_knockback = _knockback.move_toward(Vector2.ZERO,  # 被摩擦力逼停
			max(air_friction, 0.0) * delta * 60)  # 物理帧补正卡顿
	_knockback = move_and_slide(_knockback)  # 处理击退
	match self._action_state:  # 简易状态机
		CHASE:
			do_chase(delta)  # 追逐
		WANDER:
			do_wander(delta)  # 游荡
		IDLE:
			do_idle(delta)  # 闲置
	_move_vector = move_and_slide(_move_vector)  # 处理移动


func move_to_point(point_position: Vector2, delta: float):  # 移动到指定地点
	var face_vector: Vector2 = global_position.direction_to(point_position).normalized()
	_move_vector = _move_vector.move_toward(face_vector * max_speed,
			clamp(acceleration - friction, 0.0, max_speed) * delta * 60)
	_sprite.flip_h = _move_vector.x < 0  # 调整面向


func alert_around():  # 巡视四周(游荡还没做 因此目前只有单纯的警戒功能)
	if _player_detection.can_see_player():  # 检测到玩家
		_action_state = CHASE  # 开始追逐玩家


func do_chase(delta):
	var player = _player_detection.player  # 尝试获取玩家节点
	if player != null:  # 检测到玩家存在
		move_to_point(player.global_position, delta)  # 朝玩家所在地点移动
	else:
		_action_state = IDLE  # 丢失追逐目标 继续闲置


func do_wander(_delta):
	# TODO 游荡功能还没做
	alert_around()


func do_idle(delta):
	_move_vector = _move_vector.move_toward(Vector2.ZERO,
			max(friction, 0.0) * delta * 60)
	_move_vector = move_and_slide(_move_vector)
	alert_around()
```

## 添加无敌帧（避免短时间内被大量判定伤害次数）

```GDScript
# hurtbox.gd
extends Area2D
# Hurtbox 通用脚本


signal invincibility_started(visibility)  # 无敌帧开始信号(参数是预留给以后做凸显无敌帧特效的)
signal invincibility_ended  # 无敌帧结束信号

var _invincible: bool = false setget set_invincible  # 无敌帧
var _visibility: bool = false  # 无敌帧可见状态

onready var _collision = $CollisionShape2D
onready var _timer = $Timer


func start_invincibility(duration: float, enable_blink: bool = false):
	_visibility = enable_blink  # TODO 特效暂未显示
	self._invincible = true  # 启用无敌帧
	_timer.start(duration)  # 开始无敌帧倒计时


func set_invincible(is_invincible: bool):  # 根据新的无敌帧状态触发对应信号
	if is_invincible:
		emit_signal("invincibility_started", _visibility)
	else:
		emit_signal("invincibility_ended")


func _on_Hurtbox_invincibility_started(_visibility):
	_collision.set_deferred("disabled", true) # 禁用受击碰撞箱(实质性无敌)


func _on_Hurtbox_invincibility_ended():
	_collision.disabled = false # 重新启用受击碰撞箱(取消无敌)


func _on_Timer_timeout():
	self._invincible = false  # 无敌帧结束 触发信号
```

## 血量显示

实在没什么可说的，值得一提的就一个小知识点：\
勾选（启用）`TextureRect` 节点的 `Expand` 配置项之后，尺寸（`Rect` 的 `Size`）才能小于材质素材本身的大小，否则节点的尺寸会被自动撑到材质本身的尺寸。

注意是紧挨着材质（`Texture`）下面的 `Expand`；\
不是 `Control` 节点通用配置里的 Size Flags > Horizontal / Vertical > Expand 这个同名设置。

## 敌人之间的软碰撞（伪物理）

目前的敌人之间也是没有碰撞体积的，本来就这样也没什么问题。\
可是稍微溜一溜两个敌人就会完全重合在一起，看起来只有一个敌人，这就影响游戏体验了。

解决方案不是让敌人之间进行碰撞判定，会带来大量计算负担，表现效果也不好（互相卡住）。\
而是再加一个特殊的碰撞体：它本身同样没有体积判定，但当碰撞发生时会给双方一个反向的移动矢量，来模拟碰撞的物理效果。这个向量不用太大，能阻止多个敌人叠在一起就够了。

```GDScript
# soft_collision.gd
extends Area2D
# 软碰撞脚本


func is_colliding() -> bool:  # 判定是否发生碰撞
	return get_overlapping_areas().size() > 0  # 存在重叠的区域 = 发生碰撞


func gen_push_vector() -> Vector2:  # 生成推开的移动向量
	if is_colliding():
		var areas = get_overlapping_areas()
		var push_vector = areas[0].global_position.direction_to(global_position)
		# areas[0]: 由于碰撞双方都会进行判定 因此各管各的的就够了
		return push_vector.normalized()
	else:
		return Vector2.ZERO
```

```GDScript
# enemy.gd
extends KinematicBody2D
# 敌人主脚本 与本节无关的内容已酌情删减


onready var _soft_collision = $SoftCollision


func _physics_process(delta):
	if _soft_collision.is_colliding():  # 发生碰撞
		_move_vector += _soft_collision.gen_push_vector() * delta * 600  # 推开自己
		# 由于每个敌人都会同时推开自己 等于是互相推开了
		# 类似车让人的同时人让车 结果双方都愣住了(还蛮尴尬的)
	_move_vector = move_and_slide(_move_vector)
```

当然，最后还要给软碰撞单独设置一层 `SoftCollision` 层：\
它自己（Layer）是软碰撞体，它会与别的软碰撞体（Mask）发生碰撞。

> 更好的办法是利用<a href="/tech/game-godot-review-1-prepare/#_processdelta-%E5%92%8C-_physics_processdelta-%E8%AF%A5%E7%94%A8%E5%93%AA%E4%B8%AA" target="_blank">之前讲过的 Timer</a> 来定时检测，没必要每一帧都检测并处理碰撞。\
> 不过示例的性能已经够用了，毕竟是 2D 游戏，还是实际分辨率压到 320 × 180 的低品质渲染。\
> 如果是 3D 游戏、高品质三渲二（奥日 2）、涉及大数字的大量计算（暗黑 3 的范围伤）等等，只要存在性能问题就可以考虑诸如此类的细节优化了，最后的效果积少成多非常可观。\
> 毕竟出现的性能问题本来就是这样聚沙成塔、集腋成裘，结果堆出来的。

## 镜头设置

最符合直觉的设计逻辑是将镜头设置在玩家节点里，这样镜头天然就跟随玩家。\
不过如此一来会出现一些——诸如血量等 GUI 无法跟随镜头（HUD 不跟随镜头留在环境里也太怪了），玩家死亡导致节点被释放后镜头也会被重置到初始位置……等等，奇怪的问题。\
因此最好另辟蹊径：

1. 新建 `CanvasLayer` 节点，这个节点会与主世界（`Node2D` 节点）断开位置之间的联系，成为单独的一层，UI 相关的内容都应该放在里面。
2. 镜头当然也算 UI，在 `CanvasLayer` 节点下添加 `Camera2D` 场景，勾选启用{{< ruby "平滑镜头" "Smoothing" >}}。
3. 在玩家场景添加 `RemoteTransform2D` 子节点，`Remote Path` 设置为 `Camera2D` 镜头节点，这样镜头就会跟随玩家了。同时玩家死亡后镜头也会留在原地。
4. 在镜头场景（`Camera2D` 节点）添加 `Node` 子节点，这个节点没有 `transform` 属性。
   1. 也就是说，它的父节点的位置信息不会传给它的子节点。命名为 `SeparationNode`。
   2. 给 `SeparationNode` 添加两个 `Position2D` 子节点，用来定位限制镜头的极限边界，分别命名为 `LimitTopLeft` / `LimitBottomRight`。
   3. 添加对应脚本，以后移动两个 `Position2D` 子节点就可以可视化编辑镜头的边界了。

```GDScript
# camera.gd
extends Camera2D
# 镜头脚本


onready var top_left = $SeparationNode/LimitTopLeft
onready var bottom_right = $SeparationNode/LimitBottomRight


func _ready():
	limit_top = top_left.position.y
	limit_right = bottom_right.position.x
	limit_bottom = bottom_right.position.y
	limit_left = top_left.position.x
```

## 小怪 AI：巡逻（游荡）

1. 每只小怪生成之时就记录自己的当前座标，标记为出生点。
2. 在出生点附近（周围固定半径的一个圆，可以视为警戒区域）随机生成一个巡逻地点。
3. 移动到巡逻地点之后站岗（闲置）一段时间，然后继续下一次巡逻（游荡）。
4. 途中一旦发现玩家，就优先开始追逐玩家，直到玩家脱离视野或脱离仇恨范围。
5. 追逐玩家 > 当前巡逻任务 > 下一次巡逻任务。

这个机制的妙处在于天然存在回归机制：

1. 追逐玩家过程中丢失仇恨，立刻执行下一次巡逻任务（状态机切换为 `WANDER`）。
2. 由于巡逻地点只会在出生点附近刷新，因此表现为「脱离仇恨后自动回到出生区域」。
3. 缺点是实现过于简陋（没有导航系统），脱离仇恨之后是径直（直线路径）前往出生点。\
   也就是说，很容易被玩家利用地形卡住。当然了，`move_and_slide()` 以及 360 度的全向移动矢量（而不是仅玩家可输入的八向移动操作）还是存在一定容错性。

```GDScript
# wander_controller.gd
extends Node2D
# 游荡控制器节点脚本

export(int) var wander_range: float = 30.0  # 巡逻范围

var start_position: Vector2 = Vector2.ZERO
var target_position: Vector2 = Vector2.ZERO

var _wandering: bool = false

onready var _alert_timer = $Timer


func _ready():
	start_position = global_position  # 出生点位置
	target_position = global_position  # 下一次巡逻地点位置


func wandering() -> bool:  # 是否处于游荡(巡逻)状态
	return _wandering


func alerting() -> bool:  # 是否处于警戒(站岗)状态
	return not _alert_timer.is_stopped()


func start_wander():
	_wandering = true
	_update_new_target()
	print("已更新新的巡逻地点 ", target_position, " 开始巡逻")


func stop_wander():
	_wandering = false
	print("到达巡逻地点 终止巡逻")


func start_alert(duration: float = 3.0):
	_alert_timer.start(duration)


func _update_new_target():
	var new_target = start_position + Vector2(
				rand_range(-wander_range, wander_range),
				rand_range(-wander_range, wander_range))
	# TODO 优化新巡逻地点的生成效率
	while new_target.distance_to(target_position) < wander_range / 2:
		# 避免生成的下一次巡逻地点过近
		new_target = start_position + Vector2(
				rand_range(-wander_range, wander_range),
				rand_range(-wander_range, wander_range))
	target_position = new_target
```

```GDScript
# enemy.gd
extends KinematicBody2D
# 敌人主脚本 与本节无关的内容已酌情删减


export(bool) var guard_mode: bool = true  # 守卫模式(追出太远放弃仇恨)
export(float) var max_chase_range: float = 200.0  # 最大仇恨范围
export(float) var wander_initiative: float = 75.0  # 游荡几率(巡逻的主动性)

var _keep_enmity: bool = true

onready var _wander_controller = $WanderController


func alert_around():
	if _player_detection.can_see_player():  # 检测到玩家
		_action_state = CHASE  # 开始追逐玩家
	elif not (_wander_controller.wandering() or _wander_controller.alerting()):
		if randi() % 100 + 1 > wander_initiative:
			_action_state = IDLE
			_wander_controller.start_alert(rand_range(1, 3))
		else:
			_action_state = WANDER
			_wander_controller.start_wander()


func do_chase(delta):
	if guard_mode and global_position.distance_to(
			_wander_controller.start_position) > max_chase_range:
		_keep_enmity = false  # 守卫模式下 追逐距离太远 丢失仇恨
		# 更好的实现是真的做一个仇恨值(耐心值)系统出来:
		#     1. 脱离仇恨范围 仇恨值逐渐降低
		#     2. 仇恨值归零后判定为拉脱离仇恨 回满血 无敌(一般表现为 100% 闪避)
		#        (大部分 MMORPG 是这样, 不过也有 LOL 这类特例, 追求快节奏, 拉脱只回血不无敌)
		#     3. 并且暂时禁用仇恨系统
		#     4. 回到出生点后取消无敌 重新启用仇恨系统
	var player = _player_detection.player
	if player != null and _keep_enmity:
		move_to_point(player.global_position, delta)
	else:
		_action_state = WANDER


func do_wander(delta):
	move_to_point(_wander_controller.target_position, delta)
	if global_position.distance_to(_wander_controller.target_position) <= 4:
		_keep_enmity = true  # 回到出生点 重新恢复仇恨
		_action_state = IDLE
		_wander_controller.stop_wander()
		_wander_controller.start_alert(rand_range(2, 3))
	alert_around()


func do_idle(delta):
	_move_vector = _move_vector.move_toward(Vector2.ZERO,
			max(friction, 10.0) * delta * 60)
	_move_vector = move_and_slide(_move_vector)
	alert_around()
```

## 音效

这个<a href="/tech/game-godot-review-1-prepare/#%E5%BA%94%E8%AF%A5%E5%9C%A8%E4%BB%80%E4%B9%88%E6%97%B6%E6%9C%BA%E4%BD%BF%E7%94%A8%E5%8D%95%E4%BE%8B" target="_blank">之前也讲过</a>了。

- 单独的场景附带的音效（比如受伤音效，应该是和受击特效动画绑定的）需要自动播放，勾选启用 `Autoplay`，播放完直接被父节点 `queue_free()` 释放掉，非常简单。
- 常驻的场景（比如玩家节点）待需要时，再现场实例化就是：

```GDScript
# sound.gd
extends AudioStreamPlayer
# 音效播放器脚本

func _ready():
	var err = self.connect("finished", self, "queue_free")  # 代码连接信号
	assert(err == 0)  # 断言没错
```

```GDScript
const SOUND = preload("res://sound.tscn")
get_parent().add_child(SOUND.instance())  # 添加为兄弟节点 防止音效没播放就被 queue_free 打断
# get_tree().current_scene.add_child() 也可以 反正音效在哪放都是放
```

## 视觉特效（着色器）

Sprite > CanvasItem > Material > New ShaderMaterial > New Shader 建立新的{{< ruby "着色器" "Shader" >}}，\
另存为 `white_mask.tres`（白色蒙版）：

```c
shader_type canvas_item;

uniform bool active = false;

void fragment() {
	vec4 previous_pixel = texture(TEXTURE, UV);
	vec4 bleached_pixel = vec4(1.0, 1.0, 1.0, previous_pixel.a);
	COLOR = active ? bleached_pixel : previous_pixel;
}
```

1. 首先是定义 `shader_type`（着色器类型）——\
   有 `canvas_item`（2D）、`spatial`（3D）、`particle`（粒子效果）三种类型。
2. 然后是 `uniform`，类似 GDScript 里的 `export` 导出变量——\
   定义之后可以在外部通过 UI 界面编辑值。\
    （这个功能很强大，你甚至可以导出一个全功能的颜色选择器）
3. 最后是 `fragment()` 分片处理函数，这个函数会对目标材质的每一个像素逐一处理。
   1. 先拿到了原材质的像素数据 `previous_pixel`。\
      这是一个 `vec4` 四维向量，四维分别代表 RGBA 四条通道。
   2. 对每一个像素进行{{< ruby "「漂白」" "bleach" >}}。（不是《死神》哦 ~~是不是暴露年龄了~~）
   3. 每一个像素都使用新的 1.0 × 3 的 RGB 值（`#ffffff`），染成白色。
   4. 但保留原来的 alpha 通道（透明度），这样就原材质就只有存在图形的部分才会被变成白色，而不是包括透明部分的整个区域。
   5. 最后的最后，根据之前导出的变量决定 `COLOR` 应用 _新的颜色_ 还是 _原本的颜色_。\
      （标准的三目运算式应该看得懂吧）

接着建立一个 `AnimationPlayer` 动画节点，没错，多个动画之间可以直接叠加。\
添加启用和禁用 `active` 的关键帧，循环播放。目标材质就会在原材质和白色剪影之间切换了。\
调整动画持续时间，比如开启白色蒙版 0.1 秒，关闭蒙版 0.1 秒，循环，闪烁特效就完成了。
