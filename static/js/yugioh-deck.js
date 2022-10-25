const renderYGODeck = (ydk_code) => {
  const lines = ydk_code.trim().split("\n");
  const sub_title = {
    main: "主卡组",
    extra: "额外卡组",
    side: "副卡组",
  };
  let deck_meta = "";
  let deck = {
    main: [],
    extra: [],
    side: [],
  };
  let cursor = undefined;
  const numberPattern = /^\d+$/;
  for (let i = 0; i < lines.length; i++) {
    if (i === 0 && lines[i].startsWith("#")) {
      deck_meta = lines[i].substr(1);
      continue;
    }
    switch (lines[i]) {
      case "#main":
        cursor = "main";
        break;
      case "#extra":
        cursor = "extra";
        break;
      case "!side":
        cursor = "side";
        break;
      default:
        if (!numberPattern.test(lines[i])) cursor = undefined;
        break;
    }
    if (cursor !== undefined && numberPattern.test(lines[i])) {
      deck[cursor].push(parseInt(lines[i]));
    }
  }
  let html = ``;
  if (deck_meta !== "") {
    let [title, url] = [null, null];
    const urlPattern = /(https?:\/\/[^!@$^*\s-]+)/;
    const result = urlPattern.exec(deck_meta);
    if (result === null) {
      title = deck_meta;
    } else {
      url = result[0];
      title = deck_meta.replace(url, "");
    }
    if (url !== null) {
      html += `<h2><a href="${url}" target="_blank">${title}</a></h2>`;
    } else {
      html += `<h2>${title}</h2>`;
    }
  }
  for (const key in deck) {
    if (Object.hasOwnProperty.call(deck, key)) {
      const deck_count = deck[key].length;
      if (deck_count > 0) {
        const line_count = Math.ceil(deck_count / 10);
        let height = line_count * 58;
        if (line_count > 1) height += (line_count - 1) * 5;
        html += `<h4>${sub_title[key]}</h4><svg width="100%" viewBox="0 0 445 ${height}">`;
        for (let i = 0; i < deck[key].length; i++) {
          const card = deck[key][i];
          html += `<image x="${(i % 10) * 45}" y="${
            parseInt(i / 10) * 63
          }" height="58px" width="40px" xlink:href=`;
          if (card === 0) {
            html += `"/img/card_sample.png" class="unclickable"/>`;
          } else {
            html += `"https://cdn.233.momobako.com/ygopro/pics/${card}.jpg!half" onerror="this.setAttribute('xlink:href','/img/card_fallback.png');this.setAttribute('class','unclickable');this.onclick=''" src="/img/card_fallback.png" onclick="window.open('https://www.ygocdb.com/card/${card}')"/>`;
          }
        }
        html += `</svg>`;
      }
    }
  }
  return html;
};

console.info("yugioh-deck.js v0.1.4 loaded.");
let ydkContainers = document.querySelectorAll(".ygo-deck");
for (let i = 0; i < ydkContainers.length; i++) {
  ydkContainers[i].innerHTML = renderYGODeck(ydkContainers[i].innerHTML);
}
