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

  /* jacket and cap, drawn in a 240 x 250 box: cap at the top, jacket below; patterns are clipped to each panel and a
     light-from-the-left shading and a few folds go over them */
  function svg(id, w) {
    var B = c(S.b), B2 = c(S.b2), Sl = c(S.s), Sl2 = c(S.s2), C = c(S.c), C2 = c(S.c2), o = "", i;
    var LINE = "#1b1420";
    var torso = "M80 64 C90 60 98 57 105 54 C110 64 130 64 135 54 C142 57 150 60 160 64 C164 92 167 120 164 150 C163 172 164 190 166 204 C136 213 104 213 74 204 C76 190 77 172 76 150 C73 120 76 92 80 64 Z";
    var slL = "M80 64 C66 68 56 76 50 90 C42 110 36 140 30 172 C38 178 50 180 58 178 C62 154 68 132 76 112 C77 96 78 80 80 64 Z";
    var slR = "M160 64 C174 68 184 76 190 90 C198 110 204 140 210 172 C202 178 190 180 182 178 C178 154 172 132 164 112 C163 96 162 80 160 64 Z";
    var collar = "M105 54 C110 64 130 64 135 54 C133 52 131 51 129 50 C126 57 114 57 111 50 C109 51 107 52 105 54 Z";
    var dome = "M84 52 C84 22 100 8 120 8 C140 8 156 22 156 52 C140 56 100 56 84 52 Z";
    var peak = "M112 50 C128 49 150 49 170 54 C175 56 175 60 169 61 C152 63 132 60 112 57 C109 55 109 51 112 50 Z";
    function shade(path, gid) { return '<path d="' + path + '" fill="url(#' + id + gid + ')"/>'; }
    o += '<svg viewBox="0 0 240 272" width="' + w + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Racing silks: ' + esc(describe()) + '"><defs>' +
      '<clipPath id="' + id + 'b"><path d="' + torso + '"/></clipPath>' +
      '<clipPath id="' + id + 'l"><path d="' + slL + '"/></clipPath><clipPath id="' + id + 'r"><path d="' + slR + '"/></clipPath>' +
      '<clipPath id="' + id + 'c"><path d="' + dome + '"/></clipPath>' +
      '<linearGradient id="' + id + 'gb" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".18" stop-color="#000" stop-opacity=".06"/><stop offset=".38" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity=".04"/><stop offset=".85" stop-color="#000" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>' +
      '<linearGradient id="' + id + 'gs" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".45" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".30"/></linearGradient>' +
      '<radialGradient id="' + id + 'gc" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>' +
      '<linearGradient id="' + id + 'gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity=".40"/></linearGradient>' +
      '<filter id="' + id + 'ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".35"/></filter></defs>';

    o += '<g transform="translate(0 24)">';
    /* sleeves */
    var sp = SLV[S.sp];
    [["l", slL, 54, 1], ["r", slR, 186, -1]].forEach(function (a) {
      var k = a[0], cx = a[2];
      o += '<g clip-path="url(#' + id + k + ')"><rect width="240" height="250" fill="' + Sl + '"/>';
      if (sp === "Hoops") for (var y = 82; y < 182; y += 18) o += '<path d="M0 ' + y + ' L240 ' + (y + 10 * a[3] * -0.3) + ' L240 ' + (y + 9) + ' L0 ' + (y + 9) + ' Z" fill="' + Sl2 + '"/>';
      if (sp === "Armlets") o += '<path d="M0 128 L240 128 L240 142 L0 142 Z" fill="' + Sl2 + '" transform="rotate(' + (-10 * a[3]) + ' ' + cx + ' 135)"/>';
      if (sp === "Stars") { o += star(cx + 2 * a[3], 110, 8, Sl2) + star(cx - 4 * a[3], 146, 8, Sl2); }
      if (sp === "Seams") o += '<path d="M' + (cx + 12 * a[3]) + ' 70 C' + (cx + 4 * a[3]) + ' 110 ' + (cx - 6 * a[3]) + ' 140 ' + (cx - 10 * a[3]) + ' 180" fill="none" stroke="' + Sl2 + '" stroke-width="7"/>';
            if (sp === "Cuffs") o += '<rect x="0" y="160" width="240" height="30" fill="' + Sl2 + '"/>';
      if (sp === "Chevrons") for (var y2 = 92; y2 < 180; y2 += 26) o += '<path d="M' + (cx - 30) + ' ' + y2 + ' L' + cx + ' ' + (y2 + 14) + ' L' + (cx + 30) + ' ' + y2 + '" fill="none" stroke="' + Sl2 + '" stroke-width="7"/>';
      o += shade(a[1], "gs");
      o += '<path d="M' + (cx - 22 * a[3]) + ' 166 C' + (cx - 10 * a[3]) + ' 168 ' + (cx + 2 * a[3]) + ' 168 ' + (cx + 10 * a[3]) + ' 166" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2"/>';
      o += '<path d="M' + (cx + 8 * a[3]) + ' 96 C' + (cx + 2 * a[3]) + ' 120 ' + (cx - 2 * a[3]) + ' 136 ' + (cx - 4 * a[3]) + ' 150" fill="none" stroke="rgba(0,0,0,.16)" stroke-width="3" stroke-linecap="round"/>';
      o += "</g>";
    });
    o += '<path d="' + slL + '" fill="none" stroke="' + LINE + '" stroke-width="2" stroke-linejoin="round"/><path d="' + slR + '" fill="none" stroke="' + LINE + '" stroke-width="2" stroke-linejoin="round"/>';

    /* body */
    o += '<g clip-path="url(#' + id + 'b)"><rect width="240" height="250" fill="' + B + '"/>';
    var bp = BODY[S.bp];
    if (bp === "Hoops") for (i = 76; i < 214; i += 28) o += '<path d="M60 ' + i + ' Q120 ' + (i + 5) + ' 180 ' + i + ' L180 ' + (i + 14) + ' Q120 ' + (i + 19) + ' 60 ' + (i + 14) + ' Z" fill="' + B2 + '"/>';
    if (bp === "Stripes") for (i = 81; i < 170; i += 20) o += '<rect x="' + i + '" y="40" width="10" height="180" fill="' + B2 + '"/>';
    if (bp === "Chevrons") for (i = 84; i < 214; i += 32) o += '<path d="M64 ' + i + ' L120 ' + (i + 28) + ' L176 ' + i + '" fill="none" stroke="' + B2 + '" stroke-width="11"/>';
    if (bp === "Cross-belts") o += '<path d="M84 60 L162 208 M156 60 L78 208" stroke="' + B2 + '" stroke-width="15"/>';
    if (bp === "Sash") o += '<path d="M86 58 L164 210" stroke="' + B2 + '" stroke-width="20"/>';
    if (bp === "Quartered") o += '<rect x="120" y="40" width="70" height="92" fill="' + B2 + '"/><rect x="50" y="132" width="70" height="90" fill="' + B2 + '"/>';
    if (bp === "Diamond") o += '<polygon points="120,98 148,134 120,170 92,134" fill="' + B2 + '"/>';
    if (bp === "Spots") for (i = 0; i < 12; i++) o += '<circle cx="' + (92 + (i % 3) * 28 + (Math.floor(i / 3) % 2) * 0) + '" cy="' + (88 + Math.floor(i / 3) * 32) + '" r="7" fill="' + B2 + '"/>';
    if (bp === "Star") o += star(120, 132, 30, B2);
    if (bp === "Braces") o += '<path d="M96 56 L94 210 M144 56 L146 210" stroke="' + B2 + '" stroke-width="10"/>';
    if (bp === "Halved") o += '<rect x="120" y="40" width="70" height="190" fill="' + B2 + '"/>';
    o += shade(torso, "gb");
    o += '<path d="M90 176 C96 188 96 198 92 208 M150 176 C144 188 144 198 148 208 M82 92 C88 102 88 112 84 124 M158 92 C152 102 152 112 156 124 M110 70 C116 74 124 74 130 70" fill="none" stroke="rgba(0,0,0,.16)" stroke-width="3" stroke-linecap="round"/>';
    o += '<path d="M104 196 C114 200 126 200 136 196" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>';
    o += "</g>";
    o += '<path d="' + collar + '" fill="' + B + '" stroke="' + LINE + '" stroke-width="1.5"/><path d="' + collar + '" fill="url(#' + id + 'gp)"/>';
    o += '<path d="' + torso + '" fill="none" stroke="' + LINE + '" stroke-width="2.2" stroke-linejoin="round"/>';
    o += '<path d="M76 196 C104 203 136 203 164 196" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-dasharray="3 3"/>';

    o += '</g>';
    /* cap: dome, button, seams, peak */
    var cg = '<g transform="translate(0 -2)">';
    cg += '<g clip-path="url(#' + id + 'c)"><rect width="240" height="70" fill="' + C + '"/>';
    var cp = CAP[S.cp];
    if (cp === "Quartered") cg += '<path d="M120 0 L170 0 L170 30 L120 30 Z M70 30 L120 30 L120 60 L70 60 Z" fill="' + C2 + '"/>';
    if (cp === "Hooped") for (i = 18; i < 56; i += 12) cg += '<rect x="60" y="' + i + '" width="120" height="6" fill="' + C2 + '"/>';
    if (cp === "Star") cg += star(120, 33, 12, C2);
    if (cp === "Spots") cg += '<circle cx="104" cy="30" r="5" fill="' + C2 + '"/><circle cx="136" cy="30" r="5" fill="' + C2 + '"/><circle cx="120" cy="44" r="5" fill="' + C2 + '"/><circle cx="120" cy="20" r="4" fill="' + C2 + '"/>';
    if (cp === "Stripe") cg += '<rect x="112" y="0" width="16" height="60" fill="' + C2 + '"/>';
    cg += '<path d="M120 8 C112 24 108 38 107 54 M120 8 C128 24 132 38 133 54 M120 8 C100 16 90 32 88 52 M120 8 C140 16 150 32 152 52" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1.2"/>';
    cg += shade(dome, "gc") + "</g>";
    cg += '<path d="' + dome + '" fill="none" stroke="' + LINE + '" stroke-width="2" stroke-linejoin="round"/>';
    var pc = cp === "Contrast peak" ? C2 : C;
    cg += '<path d="' + peak + '" fill="' + pc + '" stroke="' + LINE + '" stroke-width="2" stroke-linejoin="round"/><path d="' + peak + '" fill="url(#' + id + 'gp)"/>';
    cg += '<path d="M116 54 C134 54 152 55 168 58" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="1.2" stroke-dasharray="2.5 2.5"/>';
    cg += '<ellipse cx="120" cy="9" rx="5" ry="3.2" fill="' + (cp === "Plain" || cp === "Contrast peak" ? C : C2) + '" stroke="' + LINE + '" stroke-width="1.5"/></g>';
    o += '<g filter="url(#' + id + 'ds)">' + cg + "</g>";
    o += "</svg>";
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
