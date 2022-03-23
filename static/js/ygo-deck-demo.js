/******************************** 通用工具函数 ********************************/

/**
 * reduceDuplicate() 去重 & 计数 生成新的二维数组
 * @param {array} duplicate 含有重复元素的一维数组
 * @returns
 */
const reduceDuplicate = (duplicate) => {
  let de_weight = [];
  for (let i = 0; i < duplicate.length; ) {
    let count = 0;
    for (let j = i; j < duplicate.length; j++) {
      if (duplicate[i] == duplicate[j]) {
        count++;
      }
    }
    de_weight.push([duplicate[i], count]);
    i += count;
  }
  return de_weight;
};

/**
 * int2bin() 将十进制转换为二进制 并自动补充前导零到指定位数
 * @param {int} num 输入的十进制数
 * @param {int} bit 指定输出二进制数的位数
 * @returns
 */
const int2bin = (num, bit) => {
  const num_bin = parseInt(num).toString(2);
  return num_bin.length === bit
    ? num_bin
    : "0".repeat(bit - num_bin.length) + num_bin;
};

// 懒得写 [A-Za-z0-9] 了 临时用自动生成顶顶
// TODO 生产环境应该写死 以免每次运行都要遍历一遍(重新生成)
const base64 = [
  ...[...new Array(26).keys()].map((i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  ),
  ...[...new Array(26).keys()].map((i) =>
    String.fromCharCode("a".charCodeAt(0) + i)
  ),
  ...[...new Array(10).keys()].map((i) =>
    String.fromCharCode("0".charCodeAt(0) + i)
  ),
  "-",
  "_",
];

/**
 * bin2base64() 将二进制数转换为 base64 编码
 * @param {string} binary 字符串类型的二进制数
 * @returns
 */
const bin2base64 = (binary) => {
  // 补零 由于是二进制数直接转成 base64 编码 不存在进一步的冗余 所以不会出现 = 等号
  if (binary.length % 12 !== 0) binary += "0".repeat(12 - (binary.length % 12));
  let base64_code = "";
  for (let i = 0; i < binary.length; i += 6) {
    base64_code += base64[parseInt(binary.slice(i, i + 6), 2)];
  }
  return base64_code;
};

/******************************** YGO 相关 ********************************/

/**
 * 将 ydk 格式的卡组信息代码转换为 JS 可操作的对象
 * @param {string} ydk 格式为 .ydk 的卡组分享码文本
 * @returns
 */
const ydk2deck = (ydk) => {
  const ydk_array = ydk.trim().split("\n");
  let deck = { main: [], extra: [], side: [] };
  let step = 0;
  for (let i = 0; i < ydk_array.length; i++) {
    if (ydk_array[i].trim() !== "") {
      switch (step) {
        case 1:
          if (ydk_array[i].trim().toLowerCase() === "#extra") {
            step = 2;
          } else {
            deck.main.push(ydk_array[i]);
          }
          break;
        case 2:
          if (ydk_array[i].trim().toLowerCase() === "!side") {
            step = 3;
          } else {
            deck.extra.push(ydk_array[i]);
          }
          break;
        case 3:
          deck.side.push(ydk_array[i]);
          break;
        default:
          if (ydk_array[i].trim().toLowerCase() === "#main") step = 1;
      }
    }
  }
  return {
    main: reduceDuplicate(deck.main),
    extra: reduceDuplicate(deck.extra),
    side: reduceDuplicate(deck.side),
  };
};

const countDeck = (cards) => [
  cards.reduce((sum, card) => (sum += parseInt(card[1])), 0),
];

/**
 * deck2ydk() 将卡组信息转换为 ydk 格式的卡组信息代码
 * @param {object} deck 卡组信息对象
 * @returns
 */
const deck2ydk = (deck) => {
  const cards2code = (cards) => {
    let cards_code = "";
    for (let i = 0; i < cards.length; i++) {
      cards_code += `${cards[i][0]}\n`.repeat(cards[i][1]);
    }
    return cards_code;
  };
  console.log(
    `[INFO] Got deck {main=${countDeck(deck.main)} extra=${countDeck(
      deck.extra
    )} side=${countDeck(
      deck.side
    )}} from object, ready to turn into ydk format, processing...`
  );
  return `# created by time2beat's YGO deck toolkit\n#main\n${cards2code(
    deck.main
  )}#extra\n${cards2code(deck.extra)}!side\n${cards2code(deck.side)}`;
};

/**
 * deck2code() 将卡组信息转换为 base64 代码
 * @param {object} deck 卡组信息对象
 * @returns
 */
const deck2code = (deck) => {
  const card2bin = (pwd, count) => int2bin(count, 2) + int2bin(pwd, 27);
  console.log(
    `[INFO] Got deck {main=${countDeck(deck.main)} extra=${countDeck(
      deck.extra
    )} side=${countDeck(
      deck.side
    )}} from object, ready to turn into base64 format, processing...`
  );
  const array2bin = (cards) => cards.map((card) => card2bin(...card)).join("");
  const deck_binaryary =
    int2bin(deck.main.length, 8) +
    int2bin(deck.extra.length, 4) +
    int2bin(deck.side.length, 4) +
    array2bin(deck.main) +
    array2bin(deck.extra) +
    array2bin(deck.side);
  return bin2base64(deck_binaryary);
};

/**
 * base64toDeck() 将 base64 格式的卡组代码还原成 JS 可操作的对象
 * @param {string} deck_base64 卡组信息的 base64 编码
 * @returns
 */
const base64toDeck = (deck_base64) => {
  const bin2card = (binary) => [
    parseInt(binary.slice(2), 2),
    parseInt(binary.slice(0, 2), 2),
  ];
  console.log(
    `[INFO] Got deck from base64, ready to turn into JavaScript object, processing...`
  );
  const bin_array = deck_base64
    .split("")
    .map((i) => int2bin(base64.indexOf(i), 6))
    .join(""); //.replace(new RegExp("0+$", "g"), "");
  const species_count = {
    main: parseInt(bin_array.slice(0, 8), 2),
    extra: parseInt(bin_array.slice(8, 12), 2),
    side: parseInt(bin_array.slice(12, 16), 2),
  };
  const deck_binary = bin_array.slice(16);
  let cards_binary = [];
  for (let i = 0; i < deck_binary.length; i += 29) {
    cards_binary.push(bin2card(deck_binary.slice(i, i + 29)));
  }
  return {
    main: cards_binary.slice(0, species_count.main),
    extra: cards_binary.slice(
      species_count.main,
      species_count.main + species_count.extra
    ),
    side: cards_binary.slice(
      species_count.main + species_count.extra,
      species_count.main + species_count.extra + species_count.side
    ),
  };
};

const deck2url = (deck) => {
  console.log(`[INFO] Ready to generated URL from base64 ...`);
  return "http://deck.ourygo.top?ygotype=deck&v=1&d=" + deck2code(deck);
};

/**
 * deck2ygm() 将卡组对象转换为 ygm 格式的卡组分享码文本
 * 已废弃
 * @param {object} deck 卡组信息对象
 * @returns
 */
const deck2ygm = (deck) => {
  const card2ygm = (cards) =>
    cards
      .map((card) => (card[1] > 1 ? `${card[0]}*${card[1]}` : `${card[0]}`))
      .join("_");
  const ygm = `ygo://deck?main=${card2ygm(deck.main)}_&extra=${card2ygm(
    deck.extra
  )}_&side=${card2ygm(deck.side)}_`;
  return ygm;
};

/******************************** 单元测试 ********************************/

const example_ydk_code =
  "#main\n71039903\n71039903\n71039903\n45467446\n89631139\n89631139\n89631139\n38517737\n22804410\n55410871\n21082832\n#extra\n2129638\n56532353\n59822133\n59822133\n40908371\n40908371\n!side\n20654247\n43228023";
const example_deck = ydk2deck(example_ydk_code);
console.info(deck2ydk(example_deck));
console.info(deck2url(example_deck));
