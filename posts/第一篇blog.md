# 第一篇博客  记iot逆向入门

## 第一题    [HGAME 2023 week2]Pirated router

一个路由器固件逆向的题，给了一个bin文件。放在kali里面，binwalk -e提取出来固件。（有人说这个 SquashFS 文件系统的binwalk要安装特定模块，或者用fmk，不过我的确实是成功提取了）。发现有四个文件，找到squashfs-root文件夹，在bin文件夹里面有一个secret_program，看题面应该是这个。拖进ida里面

```
int __fastcall main(int argc, const char **argv, const char **envp)
{
  _OWORD v4[8]; // [xsp+10h] [xbp+10h]
  int n94; // [xsp+90h] [xbp+90h]
  int n35; // [xsp+98h] [xbp+98h]
  int n32; // [xsp+9Ch] [xbp+9Ch]

  v4[0] = xmmword_4543B0;
  v4[1] = xmmword_4543C0;
  v4[2] = xmmword_4543D0;
  v4[3] = xmmword_4543E0;
  v4[4] = xmmword_4543F0;
  v4[5] = xmmword_454400;
  v4[6] = xmmword_454410;
  v4[7] = xmmword_454420;
  n94 = 94;
  n35 = 35;
  for ( n32 = 0; n32 <= 32; ++n32 )
    printf(&unk_4543A8, *(v4 + n32) ^ n35);//&unk_4543A8这里是%c的意思，居然还忘了！！！！
  return 0;
}
```

一个非常简单的异或，在arm架构下运行应该会直接输出flag。

## 第二题 [福建省数据安全 2023 初赛]RFID

RFID/NFC的问题。第一眼，给了一个bin文件和一个日志文件。日志文件得知是一个pm3工具捕获nfc卡的通信记录。由其中的hf 14a list（pm3命令），知道了hf（高频13.56MHz），14a（ISO14443A协议），list（列出通信记录）。然后去看bin文件，看名字应该是给密钥文件。搜索一下是任天堂用于解密Amiibo的密钥。那日志文件应该是与Amiibo卡片的通信记录！所以思路就是从log文件里面找出加密的数据，用密钥解密，最后得到原始数据。根据注释里面的 EV1 version知道这是一个MIFARE Ultralight EV1卡片，再从EV1的命令中知道 a2是写入的命令码（或者看注释WRITEBLOCK）， 再去搜索WRITEBLOCK命令（NFC/RFID的命令）的结构是{第一个字节是命令码 后一字节是block号 四字节是写入数据（由卡片存储结构来定） 最后两字节是crc校验}。

让ai帮忙写一个提取脚本。

```python
#!/usr/bin/env python3
"""
从sniff_log.log提取写入的加密数据
"""
import re

write_data = {}

with open('sniff_log.log', 'r', encoding='utf-8') as f:
    for line in f:
        # 查找WRITEBLOCK命令
        if 'WRITEBLOCK' in line and '| Rdr |' in line:
            try:
                # 使用正则提取数据部分
                # 格式: | Rdr |a2  04  a5  00  00  00  5d  5e|
                match = re.search(r'\| Rdr \|([a-fA-F0-9\s]+)\|', line)
                if match:
                    data_hex = match.group(1).strip()
                    bytes_list = data_hex.split()
                  
                    # 确保是a2命令且长度足够
                    if len(bytes_list) >= 6 and bytes_list[0].lower() == 'a2':
                        block_num = int(bytes_list[1], 16)
                        # 提取4字节数据 (第3-6个字节)
                        data_bytes = bytes([int(b, 16) for b in bytes_list[2:6]])
                        write_data[block_num] = data_bytes
                      
            except Exception as e:
                continue

print(f"[+] 提取到 {len(write_data)} 个block")

if write_data:
    # 按顺序拼接数据
    all_data = b''
    for i in sorted(write_data.keys()):
        all_data += write_data[i]
  
    print(f"[+] 总数据大小: {len(all_data)} 字节")
  
    # 保存到文件
    with open('encrypted_amiibo.bin', 'wb') as f:
        f.write(all_data)
  
    print(f"[+] 已保存到 encrypted_amiibo.bin")
  
    # 显示前64字节
    print(f"\n[+] 前64字节数据:")
    print(all_data[:64].hex())
  
    # 显示最后64字节
    print(f"\n[+] 最后64字节数据:")
    print(all_data[-64:].hex())
else:
    print("[-] 未提取到数据，请检查日志格式")

```

由此提取出加密数据还原为bin文件。 在网上搜到用amiibotools解密 `amiitool.exe -d -k key_retail.bin -i "amiibo.BIN" > flag.bin` 得到目标二进制文件，再用010查看发现flag。

这题对我一个初学者，也有好多知识。

PM3常用命令
help     显示帮助. hw help 与 hw 是等价的。
data     图形窗口/缓冲区数据操作等等
exit     退出Proxmark3的终端环境
hf     高频相关命令
hw     硬件检测相关命令
lf     低频相关命令
quit     退出Proxmark3的终端环境等同exit

hw tune 显示天线调谐
hw ver  显示硬件（固件）版本

高频类(HF)
hf 高频相关命令
help     显示帮助
14a     ISO14443A卡的相关命令...
14b     ISO14443B卡的相关命令...
15     ISO15693卡的相关命令...
epa     德国身份证的相关命令...
legic     LEGIC卡的相关命令...
iclass     ICLASS卡的相关命令...
mf     MIFARE卡的相关命令...
tune     连续测量高频天线的调谐

hf 14a 【ISO14443A卡的相关命令】
hf 14a help     显示帮助
hf 14a list     列出窃听到的ISO14443A类卡与读卡器的通信历史记录
hf 14a reader     读取ISO14443A类卡的UID等数据
hf 14a cuids     收集指定数目的随机UID，显示开始和结束时间。
hf 14a sim     <UID> -- 模拟ISO14443A类标签
hf 14a snoop     窃听ISO14443A类卡与读卡器的通信数据
hf 14a raw     使用RAW格式命令发送指令到标签
hf 14a help     显示帮助
hf 14a list     列出窃听到的ISO14443A类卡与读卡器的通信历史记录
hf 14a reader     读取ISO14443A类卡的UID等数据
hf 14a cuids     收集指定数目的随机UID，显示开始和结束时间。
hf 14a sim     <UID> -- 模拟ISO14443A类标签
hf 14a snoop     窃听ISO14443A类卡与读卡器的通信数据
hf 14a raw     使用RAW格式命令发送指令到标签

RFID (Radio Frequency Identification)
├─ 射频识别技术
├─ 无线通信
└─ 用于识别和追踪标签

NFC (Near Field Communication)
├─ 近场通信
├─ RFID的一个子集
├─ 通信距离 < 10cm
└─ 应用: 支付、门禁、公交卡

频段分类:
┌─────────┬───────────┬────────────┐
│ 低频    │ 125kHz    │ 老式门禁   │
├─────────┼───────────┼────────────┤
│ 高频    │ 13.56MHz  │ NFC、银行卡│ ← 本题
├─────────┼───────────┼────────────┤
│ 超高频  │ 860-960MHz│ 仓储物流   │
└─────────┴───────────┴────────────┘
所有ISO14443A卡片通用的命令:

命令名称      命令码    功能
───────────────────────────────
REQA          26       寻卡请求
WUPA          52       唤醒卡片
ANTICOLL      93 20    防冲突(获取UID)
SELECT        93 70    选择卡片
HALT          50 00    休眠

MIFARE Ultralight EV1扩展命令:

命令名称      命令码    功能
───────────────────────────────
READ          30       读block
WRITE         A2       写block     ← WRITEBLOCK
READ_RANGE    3A       读多个block
READ_SIG      3C       读签名
GET_VERSION   60       获取版本
