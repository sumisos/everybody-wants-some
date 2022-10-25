class MahjongParser {
  dict = {
    // 假装是静态属性 因为 ES6 明确规定 class 内部只有静态方法 没有静态属性
    zh: {
      dora: "宝牌",
      hand: "手牌",
      want: "进张",
      wait: "听牌",
      count_error: "数量错误",
      parse_error: "解析错误",
    },
    en: {
      dora: "Dora",
      hand: "Hand",
      want: "Want",
      wait: "Wait",
      count_error: "count error",
      parse_error: "parse error",
    },
  };
  constructor(lang = "zh") {
    this.lang = lang;
  }
  tr(keyword) {
    let result = "";
    switch (keyword) {
      case "dora":
        result = this.dict[this.lang].dora;
        break;
      case "want":
        result = this.dict[this.lang].want;
        break;
      case "hand":
        result = this.dict[this.lang].hand;
        break;
      case "wait":
        result = this.dict[this.lang].wait;
        break;
      case "count_error":
        result = this.dict[this.lang].count_error;
        break;
      case "mp.parse_error":
        result = this.dict[this.lang].mp.parse_error;
        break;
      default:
        break;
    }
    return result;
  }
  parse(input) {
    let tiles = [];
    const pattern = /\d+[mpsz]/gi;
    let result;
    while ((result = pattern.exec(input))) {
      if (result[0].length == 2) {
        tiles.push(result[0]);
      } else {
        let temp = result[0].split("");
        let suit = temp.pop();
        tiles = tiles.concat(temp.map((rank) => `${rank}${suit}`));
      }
    }
    return tiles;
  }
  sort_tiles(tiles) {
    function quick_sort(list) {
      const get_value = (tile_code) => {
        let rank = parseInt(tile_code.substr(0, 1));
        return rank === 0 ? 5.5 : rank;
      };
      if (list.length < 2) return list;
      let p = list[0];
      let L = [];
      let E = [];
      let R = [];
      while (list.length > 0) {
        if (get_value(list[list.length - 1]) < get_value(p)) {
          L.push(list.pop());
        } else if (get_value(list[list.length - 1]) == get_value(p)) {
          E.push(list.pop());
        } else {
          R.push(list.pop());
        }
      }
      L = quick_sort(L);
      R = quick_sort(R);
      list = list.concat(L);
      list = list.concat(E);
      list = list.concat(R);
      return list;
    }
    let classified_tiles = {
      man: [],
      pin: [],
      sou: [],
      zi: [],
    };
    tiles.map((tile) => {
      switch (tile.substr(-1)) {
        case "m":
          classified_tiles.man.push(tile);
          break;
        case "p":
          classified_tiles.pin.push(tile);
          break;
        case "s":
          classified_tiles.sou.push(tile);
          break;
        case "z":
          classified_tiles.zi.push(tile);
          break;
        default:
          console.log("Unknown Mahjong Tile:", tile);
          break;
      }
    });
    let sorted_tiles = [];
    for (let suit in classified_tiles) {
      sorted_tiles = sorted_tiles.concat(quick_sort(classified_tiles[suit]));
    }
    return sorted_tiles;
  }
  unique(tiles) {
    let unique_tiles = [];
    unique_tiles = [...new Set(tiles)];
    return unique_tiles;
  }
}

const renderMahjong = (text) => {
  const lines = text.trim().toLowerCase().split("\n");
  let params = {
    dora: [], // 宝牌指示器
    want: [], // 进张 自动去重 TODO 重复次数或许可以显示出来？
    melds: null, // 想办法兼容全大明杠的四杠子长度
    hand: [], // 手牌
    discard: "undefined", // 舍张
    wait: [], // 听牌 自动去重
  };
  const mp = new MahjongParser();
  for (let i = 0; i < lines.length; i++) {
    let space_idx = lines[i].indexOf(" ");
    if (space_idx > 0 && space_idx + 1 < lines[i].length) {
      let key = lines[i].slice(0, space_idx);
      if (key === "lang") {
        mp.lang = lines[i].substr(space_idx + 1);
      } else if (params.hasOwnProperty(key)) {
        switch (key) {
          case "dora":
            params[key] = mp.parse(lines[i].substr(space_idx + 1));
            break;
          case "want":
            params[key] = mp.sort_tiles(
              mp.unique(mp.parse(lines[i].substr(space_idx + 1)))
            );
            break;
          case "melds":
            // TODO 处理副露
            break;
          case "hand":
            let temp_hand = mp.parse(lines[i].substr(space_idx + 1));
            if (temp_hand.length % 3 === 2) {
              let pick = temp_hand.pop();
              temp_hand = mp.sort_tiles(temp_hand);
              temp_hand.push(pick);
            } else {
              temp_hand = mp.sort_tiles(temp_hand);
            }
            params.hand = temp_hand;
            break;
          case "discard":
            params.discard = mp.parse(lines[i].substr(space_idx + 1))[0];
            break;
          case "wait":
            params[key] = mp.sort_tiles(
              mp.unique(mp.parse(lines[i].substr(space_idx + 1)))
            );
            break;
          default:
            console.log("已经用 hasOwnProperty 预检查过了 不可能出现这种情况");
            break;
        }
      }
    }
  }
  if (!params.hand) {
    return `<span>${mp.tr("hand")}${mp.tr("mp.parse_error")}</span>`;
  } else if (params.hand.length > 14 || params.hand.length % 3 == 0) {
    return `<span>${mp.tr("hand")}${mp.tr("count_error")}</span>`;
  }
  if (!params.dora) {
    return `<span>${mp.tr("dora")}${mp.tr("mp.parse_error")}</span>`;
  } else if (params.dora.length > 5) {
    return `<span>${mp.tr("dora")}${mp.tr("count_error")}</span>`;
  }
  console.log("handled =", params);
  let html = "";
  if (params.dora.length > 0) {
    html += `<div class="dora"><span>${mp.tr("dora")}</span>`;
    for (let i = 0; i < params.dora.length; i++) {
      html += `<svg class="tile"><use class="face" xlink:href="#mj-${params.dora[i]}"></use></svg>`;
    }
    for (let i = params.dora.length; i < 5; i++) {
      html += `<svg class="tile"><use class="face" xlink:href="#mj-0z"></use></svg>`;
    }
    html += "</div>";
  }
  if (params.want.length > 0) {
    html += `<div class="want"><span>${mp.tr("want")}</span>`;
    for (let i = 0; i < params.want.length; i++) {
      html += `<svg class="tile"><use class="face" xlink:href="#mj-${params.want[i]}"></use></svg>`;
    }
    html += "</div>";
  }
  html += '<div class="hand">';
  for (let i = 0; i < params.hand.length; i++) {
    if (i + 1 === params.hand.length && i % 3 === 1) {
      html += '<div style="display: inline; margin: 0 0.5rem;"></div>';
    }
    if (params.hand[i] === params.discard) {
      params.discard = "discard marked";
      html += `<svg class="tile" style="margin-bottom: 2rem;"><use class="face" xlink:href="#mj-${params.hand[i]}"></use></svg>`;
    } else {
      html += `<svg class="tile"><use class="face" xlink:href="#mj-${params.hand[i]}"></use></svg>`;
    }
  }
  html += "</div>";
  if (params.wait.length > 0) {
    html += `<div class="wait"><span>${mp.tr("wait")}</span>`;
    for (let i = 0; i < params.wait.length; i++) {
      html += `<svg class="tile"><use class="face" xlink:href="#mj-${params.wait[i]}"></use></svg>`;
    }
    html += "</div>";
  }
  return html;
};

console.info("mahjong.js v0.1.3 loaded.");
let mahjongContainers = document.querySelectorAll(".mahjong-detail");
for (let i = 0; i < mahjongContainers.length; i++) {
  mahjongContainers[i].innerHTML = renderMahjong(
    mahjongContainers[i].innerHTML
  );
}

// html2canvas(document.querySelector("#capture")).then((canvas) => {
//   document.body.appendChild(canvas);
// });
