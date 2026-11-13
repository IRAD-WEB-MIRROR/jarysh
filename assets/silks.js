/* Jarysh Silks: colours, pattern, a horse name checked by the studbook rules (Tukum's list, tukum.net/data/horses.js),
   and a printable Owners' Club card. Everything stays in the browser. */
(function () {
  "use strict";
  var root = document.getElementById("silks"); if (!root) return;
  var COL = [["Gold", "#f6b800"], ["Red", "#d8141c"], ["Black", "#151515"], ["White", "#f4f4f0"], ["Royal blue", "#1d3fa8"], ["Light blue", "#7fc3ec"],
    ["Emerald", "#0f8a4a"], ["Yellow", "#ffe23a"], ["Orange", "#ff6a00"], ["Pink", "#ff4f9a"], ["Purple", "#5b2a86"], ["Maroon", "#6e1023"], ["Grey", "#9a9a9a"], ["Brown", "#6b4423"]];
  var BODY = ["Plain", "Hoops", "Stripes", "Chevrons", "Cross-belts", "Sash", "Quartered", "Diamond", "Spots", "Star", "Braces", "Halved"];
  var SLV = ["Plain", "Hoops", "Armlets", "Stars", "Seams", "Cuffs", "Chevrons"];
  var CAP = ["Plain", "Quartered", "Hooped", "Star", "Spots", "Stripe", "Contrast peak"];
  var FAMOUS = ["jel-kayyk", "almanbet", "jaltyrak", "kara-kashka", "ak-sur", "kan-ter", "ak-tuyak", "jol-bashchy", "sary-ala", "boz-bee", "suuchu", "akbozat", "jaynak", "mor-chiy", "tulpar", "kambar-ata"];
  var BANNED = ["aigyr", "jarysh", "jackpot", "nurik", "lager", "beer", "pivo", "tulpar app", "talasbank", "attelkom", "torgoy", "loto", "iradloto", "kuble", "casino", "bet"];
  var S = { b: 0, bp: 0, b2: 1, s: 0, sp: 0, s2: 1, c: 1, cp: 0, c2: 0, name: "", owner: "" };
  try { var sv = JSON.parse(localStorage.getItem("jarysh-silks") || "null"); if (sv) for (var k in sv) S[k] = sv[k]; } catch (e) {}
  function save() { try { localStorage.setItem("jarysh-silks", JSON.stringify(S)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function c(i) { return COL[i][1]; }
  function star(cx, cy, r, f) { var p = []; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); } return '<polygon fill="' + f + '" points="' + p.join(" ") + '"/>'; }

  /* the drawing (img/silks/base.webp) is coloured by masks, one per panel (img/silks/m-*.png), with the line art
     multiplied over the colours so its outlines, folds and shading stay. Coordinates are the 800 x 800 drawing's. */
  var IMG = "img/silks/";
  function svg(id, w) {
    var B = c(S.b), B2 = c(S.b2), Sl = c(S.s), Sl2 = c(S.s2), C = c(S.c), C2 = c(S.c2), o = "", i, y;
    var M = ["body", "sleeveL", "sleeveR", "cuffL", "cuffR", "collar", "dome", "peak"];
    o += '<svg viewBox="160 28 480 716" width="' + w + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Racing silks: ' + esc(describe()) + '" style="display:block"><defs>';
    M.forEach(function (k) { o += '<mask id="' + id + k + '" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="800"><image href="' + IMG + "m-" + k + '.png" xlink:href="' + IMG + "m-" + k + '.png" x="0" y="0" width="800" height="800"/></mask>'; });
    o += '</defs><image href="' + IMG + 'base.webp" xlink:href="' + IMG + 'base.webp" x="0" y="0" width="800" height="800"/><g style="mix-blend-mode:multiply">';
    function panel(k, fill, inner) { return '<g mask="url(#' + id + k + ')"><rect x="0" y="0" width="800" height="800" fill="' + fill + '"/>' + (inner || "") + "</g>"; }

    /* body */
    var bp = BODY[S.bp], b = "";
    if (bp === "Hoops") for (y = 286; y < 730; y += 58) b += '<path d="M240 ' + y + ' Q413 ' + (y + 14) + ' 600 ' + y + ' L600 ' + (y + 28) + ' Q413 ' + (y + 42) + ' 240 ' + (y + 28) + ' Z" fill="' + B2 + '"/>';
    if (bp === "Stripes") for (i = 283; i < 560; i += 42) b += '<rect x="' + i + '" y="200" width="21" height="560" fill="' + B2 + '"/>';
    if (bp === "Chevrons") for (y = 290; y < 740; y += 84) b += '<path d="M240 ' + y + ' L413 ' + (y + 66) + ' L600 ' + y + '" fill="none" stroke="' + B2 + '" stroke-width="26"/>';
    if (bp === "Cross-belts") b += '<path d="M292 262 L548 716 M534 262 L280 716" stroke="' + B2 + '" stroke-width="36"/>';
    if (bp === "Sash") b += '<path d="M300 258 L552 712" stroke="' + B2 + '" stroke-width="50"/>';
    if (bp === "Quartered") b += '<rect x="413" y="200" width="200" height="280" fill="' + B2 + '"/><rect x="200" y="480" width="213" height="280" fill="' + B2 + '"/>';
    if (bp === "Halved") b += '<rect x="413" y="200" width="200" height="560" fill="' + B2 + '"/>';
    if (bp === "Braces") b += '<path d="M352 250 L350 730 M480 250 L484 730" stroke="' + B2 + '" stroke-width="24"/>';
    if (bp === "Diamond") b += '<polygon points="413,372 485,470 413,568 341,470" fill="' + B2 + '"/>';
    if (bp === "Spots") for (i = 0; i < 15; i++) b += '<circle cx="' + (330 + (i % 3) * 82 + (Math.floor(i / 3) % 2) * 0) + '" cy="' + (318 + Math.floor(i / 3) * 92) + '" r="17" fill="' + B2 + '"/>';
    if (bp === "Star") b += star(413, 470, 92, B2);
    o += panel("body", B, b) + panel("collar", B);

    /* sleeves: patterns run across each sleeve's own axis */
    var sp = SLV[S.sp];
    [["sleeveL", 248, 500, 10.4, "cuffL"], ["sleeveR", 566, 500, -5.7, "cuffR"]].forEach(function (a) {
      var cx = a[1], cy = a[2], s = '<g transform="rotate(' + a[3] + " " + cx + " " + cy + ')">';
      if (sp === "Hoops") for (y = 318; y < 720; y += 46) s += '<rect x="' + (cx - 120) + '" y="' + y + '" width="240" height="22" fill="' + Sl2 + '"/>';
      if (sp === "Armlets") s += '<rect x="' + (cx - 120) + '" y="' + (cy + 10) + '" width="240" height="34" fill="' + Sl2 + '"/>';
      if (sp === "Stars") s += star(cx, cy - 70, 22, Sl2) + star(cx, cy + 60, 22, Sl2);
      if (sp === "Seams") s += '<rect x="' + (cx - 8) + '" y="280" width="16" height="460" fill="' + Sl2 + '"/>';
      if (sp === "Chevrons") for (y = 340; y < 680; y += 62) s += '<path d="M' + (cx - 80) + " " + y + " L" + cx + " " + (y + 34) + " L" + (cx + 80) + " " + y + '" fill="none" stroke="' + Sl2 + '" stroke-width="16"/>';
      s += "</g>";
      o += panel(a[0], Sl, s) + panel(a[4], sp === "Cuffs" ? Sl2 : Sl);
    });

    /* cap */
    var cp = CAP[S.cp], k2 = "";
    if (cp === "Quartered") k2 += '<path d="M410 30 L520 30 L520 112 L410 112 Z M300 112 L410 112 L410 200 L300 200 Z" fill="' + C2 + '"/>';
    if (cp === "Hooped") for (y = 62; y < 190; y += 28) k2 += '<rect x="290" y="' + y + '" width="230" height="13" fill="' + C2 + '"/>';
    if (cp === "Star") k2 += star(424, 112, 30, C2);
    if (cp === "Spots") k2 += '<circle cx="390" cy="90" r="11" fill="' + C2 + '"/><circle cx="450" cy="92" r="11" fill="' + C2 + '"/><circle cx="420" cy="140" r="11" fill="' + C2 + '"/><circle cx="465" cy="140" r="11" fill="' + C2 + '"/><circle cx="360" cy="135" r="11" fill="' + C2 + '"/>';
    if (cp === "Stripe") k2 += '<path d="M392 40 L428 40 L446 190 L404 190 Z" fill="' + C2 + '"/>';
    o += panel("dome", C, k2) + panel("peak", cp === "Contrast peak" ? C2 : C);
    o += "</g></svg>";
    return o;
  }
  function describe() {
    var t = COL[S.b][0] + (BODY[S.bp] === "Plain" ? "" : ", " + COL[S.b2][0].toLowerCase() + " " + BODY[S.bp].toLowerCase());
    t += "; " + (S.s === S.b && SLV[S.sp] === "Plain" ? "" : COL[S.s][0].toLowerCase() + " sleeves" + (SLV[S.sp] === "Plain" ? "" : ", " + COL[S.s2][0].toLowerCase() + " " + SLV[S.sp].toLowerCase()) + "; ");
    t += COL[S.c][0].toLowerCase() + " cap" + (CAP[S.cp] === "Plain" ? "" : ", " + COL[S.c2][0].toLowerCase() + " " + CAP[S.cp].toLowerCase().replace("star", "star").replace("hooped", "hoops"));
    return t.replace("; ; ", "; ").replace(/; $/, "");
  }

  /* the name rules, as Tukum gives them (tukum.net/names.html) */
  var TAKEN = null;
  function taken() {
    if (TAKEN) return TAKEN; TAKEN = {};
    var H = window.TK_H, C = window.TK_COLS; if (!H || !C) return TAKEN;
    var n = C.indexOf("n"), y = C.indexOf("y");
    for (var i = 0; i < H.length; i++) TAKEN[norm(H[i][n])] = H[i][y];
    return TAKEN;
  }
  function norm(s) { return String(s || "").toLowerCase().replace(/ö/g, "o").replace(/ü/g, "u").replace(/ı/g, "i").replace(/ñ/g, "n").replace(/[\s-]+/g, "-"); }
  function check(name) {
    var s = name.trim().replace(/\s*-\s*/g, "-").replace(/\s+/g, " ");
    if (!s) return { ok: false, msg: "Your horse needs a name." };
    if (/[0-9]/.test(s) || /\b[IVX]+$/.test(s)) return { ok: false, msg: "Letters only: no figures and no Roman numerals." };
    if (!/^[A-Za-zÖÜöüıIİñÑ' -]+$/.test(s) || /['.]/.test(s)) return { ok: false, msg: "Letters only, in the Iradi alphabet (ö, ü, ı and ñ allowed). No apostrophes or full stops." };
    var words = s.split(/[ -]/).filter(Boolean);
    if (words.length > 2) return { ok: false, msg: "One or two words at most." };
    if (s.replace(/[ -]/g, "").length > 18) return { ok: false, msg: "18 letters at most." };
    var n = norm(s), low = s.toLowerCase();
    for (var i = 0; i < BANNED.length; i++) if (low.indexOf(BANNED[i]) >= 0 && (BANNED[i].length > 3 || words.some(function (w) { return w.toLowerCase() === BANNED[i]; })))
      return { ok: false, msg: "No names of people, firms or products. The Chongtor Registry turned down \"Aigyr\" in 2019, and Nurik is not giving his consent." };
    if (words.length === 2 && s.indexOf(" ") >= 0) return { ok: false, fix: words.map(cap1).join("-"), msg: "Two words that make one name are joined with a hyphen." };
    if (FAMOUS.indexOf(n) >= 0) return { ok: false, msg: "That name is closed for good: it is on Tukum's famous horses list." };
    var T = taken(), yr = T[n];
    if (yr && yr >= new Date().getFullYear() - 25) return { ok: false, msg: "Taken: a horse called " + s + " was foaled in " + yr + " and is in the studbook. Names come free 25 years after." };
    var proper = words.map(cap1).join(words.length === 2 ? "-" : "");
    return { ok: true, name: proper, old: yr || null, checked: !!window.TK_H };
  }
  function cap1(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

  function sel(id, list, v, colours) {
    return '<select id="' + id + '">' + list.map(function (x, i) { var t = colours ? x[0] : x; return '<option value="' + i + '"' + (i === v ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select>";
  }
  function row(label, a, b, c2) { return '<div class="sk-row"><b>' + label + "</b>" + a + b + c2 + "</div>"; }
  var css = document.createElement("style");
  css.textContent = ".sk{display:grid;grid-template-columns:240px minmax(0,1fr);gap:18px;align-items:start}.sk-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 10px}.sk-row b{width:70px;font:700 14px Oswald,sans-serif;color:var(--gold)}" +
    ".sk select,.sk input{background:#0c0a12;color:#fff;border:1px solid #4a3d5c;padding:6px 8px;font:14px 'Roboto Condensed',Arial,sans-serif}.sk input{width:100%;max-width:320px}.sk-msg{margin:8px 0;min-height:1.4em}.sk-msg.bad{color:#ff6b6b}.sk-msg.ok{color:#7dff9a}" +
    ".sk-card{margin-top:16px;background:#fdf8e6;color:#1a1100;border:3px double #b88a00;padding:16px;display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px;position:relative;font:14px/1.35 Georgia,serif}" +
    ".sk-card h3{color:#7a0c10;text-shadow:none;font-size:20px;margin:0 0 6px}.sk-card dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:2px 10px;margin:0}.sk-card dt{color:#6d5a2a}.sk-card dd{margin:0;font-weight:700}" +
    ".sk-stamp{position:absolute;right:12px;bottom:10px;border:2px dashed #7a0c10;padding:4px 7px;text-align:center;font:700 10px/1.25 Consolas,monospace;color:#7a0c10;transform:rotate(-6deg);background:#fff6d8}" +
    "@media(max-width:620px){.sk,.sk-card{grid-template-columns:1fr}}@media print{body *{visibility:hidden}.sk-card,.sk-card *{visibility:visible}.sk-card{position:absolute;left:0;top:0;width:640px}}";
  document.head.appendChild(css);

  function draw() {
    root.innerHTML = '<div class="box"><div class="sk"><div id="sk-pic">' + svg("pv", 240) + '</div><div>' +
      row("BODY", sel("b", COL, S.b, 1), sel("bp", BODY, S.bp), sel("b2", COL, S.b2, 1)) +
      row("SLEEVES", sel("s", COL, S.s, 1), sel("sp", SLV, S.sp), sel("s2", COL, S.s2, 1)) +
      row("CAP", sel("c", COL, S.c, 1), sel("cp", CAP, S.cp), sel("c2", COL, S.c2, 1)) +
      '<p id="sk-desc" class="tiny"></p>' +
      '<div class="sk-row"><b>HORSE</b><input id="sk-n" maxlength="24" placeholder="e.g. Kök-Jel" value="' + esc(S.name) + '"></div>' +
      '<div class="sk-row"><b>OWNER</b><input id="sk-o" maxlength="40" placeholder="Your name, or a temporary slip No. from e-Irad" value="' + esc(S.owner) + '"></div>' +
      '<p id="sk-msg" class="sk-msg"></p><p><a class="btn-gold" href="#" id="sk-go">CHECK THE NAME &amp; MAKE MY CARD</a></p></div></div></div><div id="sk-out"></div>';
    ["b", "bp", "b2", "s", "sp", "s2", "c", "cp", "c2"].forEach(function (k) {
      document.getElementById(k).addEventListener("change", function (e) { S[k] = +e.target.value; save(); document.getElementById("sk-pic").innerHTML = svg("pv", 240); document.getElementById("sk-desc").textContent = describe(); document.getElementById("sk-out").innerHTML = ""; });
    });
    document.getElementById("sk-desc").textContent = describe();
    document.getElementById("sk-go").addEventListener("click", function (e) { e.preventDefault(); card(); });
  }
  function owner(v) {
    v = v.trim();
    if (window.IradSlip) { var s = window.IradSlip.parse(v); if (s.ok) { var p = window.IradSlip.person(s); return p.full + " (slip " + s.no + ")"; } }
    return v || "Anonymous owner";
  }
  function card() {
    S.name = document.getElementById("sk-n").value; S.owner = document.getElementById("sk-o").value; save();
    var r = check(S.name), m = document.getElementById("sk-msg");
    if (!r.ok) { m.className = "sk-msg bad"; m.textContent = r.msg + (r.fix ? " Try: " + r.fix : ""); document.getElementById("sk-out").innerHTML = ""; return; }
    m.className = "sk-msg ok";
    m.textContent = r.name + " passes the rules" + (r.checked ? " and is free in the Tukum studbook" + (r.old ? " (the last " + r.name + " was foaled in " + r.old + ")" : "") : " (the studbook list did not load, so we could not check it is free)") + ".";
    var no = "JOC-" + String(1000 + hash(r.name + describe()) % 9000) + "/" + String(new Date().getFullYear()).slice(2);
    document.getElementById("sk-out").innerHTML = '<div class="sk-card"><div>' + svg("cd", 150) + '</div><div><h3>Jarysh Owners\' Club</h3><dl>' +
      "<dt>Horse</dt><dd>" + esc(r.name) + "</dd><dt>Owner</dt><dd>" + esc(owner(S.owner)) + "</dd><dt>Colours</dt><dd>" + esc(describe()) + "</dd><dt>Card No.</dt><dd>" + no + "</dd><dt>Issued</dt><dd>" + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + "</dd></dl>" +
      '<p style="font-size:11px;margin:10px 90px 0 0">Fan card. Not valid at the Irad State Hippodrome. Racing colours are registered with the National Equestrian Sports Directorate.</p></div>' +
      '<span class="sk-stamp">OWNERS\' CLUB<br>stamp paid<br>control No.<br>3E9-YFR9</span></div><p style="margin-top:10px"><a class="btn-red" href="#" id="sk-pr">PRINT MY CARD</a></p>';
    document.getElementById("sk-pr").addEventListener("click", function (e) { e.preventDefault(); window.print(); });
  }
  draw();
})();
