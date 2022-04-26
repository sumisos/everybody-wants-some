---
title: "存储卡相关知识简单科普"
subTitle: "如何看懂选好的 SD 卡的参数"
date: 2019-07-14T18:45:00+08:00
tags: ["硬件", "存储"]
series: ["外设"]
related: true
---

## 存储卡种类
大部分人都见过的存储卡应该有两种，大的和小的。  

### Trans-flash Card
小的就是前几年手机常用的存储卡，你管他叫 `内存卡`\*也好，`SD 卡` 也罢，`TF 卡` 也行，实际上人家原名 `Trans-flash Card`，后来改名 `Micro SD Card`。  

> \* 以前：——前略，内存卡 balabala  
> ——确实，不过那个其实应该叫存储卡  
> 
> 后来：——前略，（委屈）我说内存卡被骂了（那时候还没有 XX 警察和出警的梗）  
> ——FTMDP，就是内存卡就要叫内存卡就要叫就要叫就要叫就要叫  

### Secure Digital Memory Card
大的一般是相机用得多，那个才是**真正**的 SD 卡（Secure Digital Memory Card）。  
其实这是一个大类，详细又分为：  
* `SDHC`（SD High Capacity）：一般我们叫的大 SD 卡就是这种  
* `SDXC`（SD Extended Capacity）  
* `SDUC`（SD Ultra Capacity）  

其实就是容量和读写速度的区别，现在说相机用的 SD 卡一般默认指 SDHC。  

### 容量大小
虽然不同种类的 SD 卡直观来看是容量上的区别，如果看本质的话其实是文件系统的区别：  
* `普通 SD` 是 `FAT16`（size < 2 GB）  
* `SDHC` 是 `FAT32`（size > 32 GB）  
* `SDXC` 才是 `exFAT`（size < 2 TB）  
* `SDUC` 也是 `exFAT`（size < 128 TB）  

### 读写速度
SDUC 是 SD 7.0 标准提出的两个种类之一，另一种是 SD Express（读取速度接近 1 GB/s）。  
SD Express 不是横向发展的种类，而是垂直方向上的技术拓展。  
它管的是传输速度，跟容量没关系，也就是说有：  
* `SDHC Express`  
* `SDXC Express`  
* `SDUC Express`  

另外还有 MS 卡（`Memory Stick`，俗称 *记忆棒*，索尼研发的\*）和 CF 卡（`Compact Flash`，闪迪制定标准的闪存卡）。  
要考古的话早年还有东芝和三星的 SM 卡（`Smart Media`），西门子和闪迪的 MMC 卡（`Multi-Media Card`），国内接触的比较少就不继续展开了。  

> \* 没错，就是 PlayStation 3 那个，童年回忆有了。  

## 存储卡速度
### 总线速度标准
![总线速度](https://www.sdcard.org/cms/wp-content/uploads/2021/04/bus_speed_img2021.png)

### 速度等级
![速度等级](https://www.sdcard.org/cms/wp-content/uploads/2021/03/video_speed-class_01.png)

即 Speed Class，分为四级：  
* Class 2（> 2 MB/s）  
* Class 4（> 4 MB/s）  
* Class 6（> 6 MB/s）  
* Class 10（> 10 MB/s）  

一般说的 Class 0 是指低于 Class 2 和没标注的。  
都 2020 年了，C10 以下也好意思拿出来卖？  

#### 超高速速度等级
分为两级：  
* UHS-I（UHS Speed Class 1，> 10 MB/s）  
* UHS-III（UHS Speed Class 3，> 30 MB/s）  

有一说一，现在还标着 C10 卖的卡的感觉都是用早年的最高标准骗外行。  
U1 = C10，你随便找张 U3 的卡岂不是等于 3 倍 C10 性能？  
如果非要杠，C10 就是 Class 的最高标准了，1 TB/s 不也是 C10？  
U1 也许会标 C10 好看一点，但凡他能达到 29.9 MB/s 他会放着 U3 不标去标什么 C10 吗？  
~~我感觉有可能，C10 确实比什么 U123 看起来高端。~~  

#### 视频速度等级
为什么视频速度会比「超高速」还高一个 level 啊？那就要问问最吃容量的文件格式是什么了。  

音频弟弟就不用说了，目前的技术用数字信号记录音频是有其局限性的，上限（说的就是你，flac）摆在那里，群众对耳放 / 功放的追求又比较玄学。~~所以现在还有一大堆黑胶党~~  

而胶片 / 胶卷党就很难过了，人眼能接受的信息粒度是有限小的，就算你视力 5.2，能看清多远的极限就在那里，同样距离拍一张超高分辨率的照片 ~~放大再放大，每根毛看得都清清楚楚~~ 一定是比人眼要清晰的。  
况且图像编码技术日新月异，胶片早就打不过数码了，战斗力差距还会随着技术发展越来越大。  

图像再大也就一张图，视频可是能在 n 张图像（帧）的基础上无限增长的……  
~~那吃容量关速度什么事啊？~~ 每秒读写吞吐量都暴增了，可不就是速度的事了吗。  
现在不是都拍4K视频 ~~120fps那种~~ 了吗，所以专门为它出了新的标准，分为五级：  
* V6（6 MB/s）  
* V10（10 MB/s）  
* V30（30 MB/s）  
* V60（60 MB/s）  
* V90（90 MB/s）  

![视频画幅](https://www.sdcard.org/cms/wp-content/uploads/2021/03/video_speed-class_02.png)

### 应用 I/O 速度
其实电商网站上最常标的是这个，一个是 A 比起其他字母看起来更牛批，另外日常使用中最关键的确实是应用 IO 速度，分为两级：  
* Class 1（A1，随机读取 > 1500 IO/s，随机写入 > 500 IO/s，持续顺序写入\* > 10 MB/s）  
* Class 1（A2，随机读取 > 4000 IO/s，随机写入 > 2000 IO/s，持续顺序写入 > 10 MB/s）  

> \* <ruby><rb>Sustained</rb><rp>（</rp><rt>持续</rt><rp>）</rp></ruby> <ruby><rb>Sequential</rb><rp>（</rp><rt>顺序</rt><rp>）</rp></ruby> <ruby><rb>Write performance</rb><rp>（</rp><rt>写入性能</rt><rp>）</rp></ruby>：等 5G 普及了网速不再是瓶颈，手机下载速度就取决于这个了。~~不对啊，现在（2021）手机对 SD 卡的支持不太友好吧~~  

![IO 速度](https://www.sdcard.org/cms/wp-content/uploads/2020/12/img_application.jpg)
