/* Jarysh Tipping League. Everything stays in this browser (localStorage "jarysh_tips"); nothing is sent anywhere. */
(function () {
  "use strict";
  var KEY = "jarysh_tips", ROOT = document.getElementById("tips");
  if (!ROOT) return;
  var PO_PTS = 20, BANK_LOSS = 0;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function load() { var o = null; try { o = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {} if (!o || typeof o !== "object") o = {}; if (!o.picks) o.picks = {}; if (!o.banker) o.banker = {}; return o; }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { var a = hash(s); return function () { a = (a + 0x6D2B79F5) | 0; var x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
  function slug(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function kickoff(date, time) { var p = date.split("-"), h = (time || "00:00").split(":"); return Date.UTC(+p[0], +p[1] - 1, +p[2], +h[0] - 6, +h[1]); }
  var MONTHS = "January February March April May June July August September October November December".split(" ");
  var DAYS = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
  function nice(d) { var p = d.split("-"), x = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); return DAYS[x.getUTCDay()] + " " + (+p[2]) + " " + MONTHS[+p[1] - 1]; }
  /* the regulars of our Tulpar channel Jarysh VIP Tips, plus the Boss. Their tips are fixed per match. */
  var CREW = [{ n: "NURIK (THE BOSS)", s: "boss" }, { n: "TalasToteKing", s: "chalk" }, { n: "Chongtor77", s: "normal" }, { n: "AigyrDeckRegular", s: "punter" },
    { n: "UlakUncle", s: "normal" }, { n: "HippodromeRow12", s: "chalk" }, { n: "KymyzKing", s: "punter" }, { n: "Kokjal4ever", s: "normal" },
    { n: "AsphaltCowboy_Bek", s: "punter" }, { n: "MoiynkumMarat", s: "normal" }];
  var SIDE = ["H", "D", "A"];

  function rounds(U) {
    var out = [];
    U.rounds.forEach(function (r) {
      out.push({ label: "ROUND " + r.round, date: r.date, boost: r.boost, matches: r.matches.map(function (m) {
        return { key: "r" + r.round + "-" + slug(m.home) + "-" + slug(m.away), conf: m.conf, home: m.home, away: m.away, venue: m.venue, time: m.time, score: m.score, odds: m.odds };
      }) });
    });
    var po = U.playoff || {};
    (po.rounds || []).forEach(function (r) {
      out.push({ label: "PLAY-OFF " + r.name.toUpperCase(), date: r.date, po: true, matches: r.matches.map(function (m) {
        return { key: "po-" + U.season + "-" + m.id, home: m.home, away: m.away, venue: po.venue, time: m.time, score: m.score, po: true };
      }) });
    });
    return out;
  }
  function tippable(m) { return m.home && m.away && (m.po || (m.odds && m.odds.length === 3)); }
  function outcome(sc) { return sc[0] > sc[1] ? "H" : sc[0] < sc[1] ? "A" : "D"; }
  function value(m, pick) { return m.po ? PO_PTS : Math.round(m.odds[SIDE.indexOf(pick)] * 10); }
  function score(m, pick, banker) {
    if (!pick || !m.score || !tippable(m)) return null;
    var won = outcome(m.score) === pick;   /* a play-off score includes the golden goal */
    if (!won) return banker ? -BANK_LOSS : 0;
    return value(m, pick) * (banker ? 2 : 1);
  }
  function crewPick(c, m) {
    var r = rng(c.n + "|" + m.key);
    if (m.po) return r() < 0.5 ? "H" : "A";
    var p = m.odds.map(function (o) { return 1 / o; });
    if (c.s === "boss" || (c.s === "chalk" && r() < 0.7)) return SIDE[p.indexOf(Math.max.apply(null, p))];
    var k = c.s === "punter" ? 0.35 : c.s === "chalk" ? 2 : 1;
    p = p.map(function (x) { return Math.pow(x, k); });
    var tot = p[0] + p[1] + p[2], u = r() * tot;
    for (var i = 0; i < 3; i++) { u -= p[i]; if (u < 0) return SIDE[i]; }
    return "A";
  }
  function crewBanker(c, rd) {
    var ms = rd.matches.filter(tippable);
    if (!ms.length) return null;
    if (c.s === "boss" && rd.boost) { var b = ms.filter(function (m) { return m.home === rd.boost.home && m.away === rd.boost.away; })[0]; if (b) return b.key; }
    var best = null, bv = null;
    ms.forEach(function (m) { var v = m.po ? 0 : value(m, crewPick(c, m)); var key = c.s === "punter" ? -v : v; if (bv == null || key < bv) { bv = key; best = m.key; } });
    return best;
  }
  function table(rd, S) {
    var rows = CREW.map(function (c) { return { n: c.n, boss: c.s === "boss", pts: 0, ok: 0, n_: 0 }; });
    var you = { n: S.name || "YOU", you: true, pts: 0, ok: 0, n_: 0 };
    var banks = CREW.map(function (c) { return crewBanker(c, rd); });
    rd.matches.forEach(function (m) {
      if (!m.score || !tippable(m)) return;
      CREW.forEach(function (c, i) { var x = score(m, crewPick(c, m), banks[i] === m.key); rows[i].pts += x; rows[i].n_++; if (x > 0) rows[i].ok++; });
      var p = S.picks[m.key]; if (p) { var y = score(m, p, S.banker[rd.label] === m.key); you.pts += y; you.n_++; if (y > 0) you.ok++; }
    });
    rows.push(you);
    rows.sort(function (a, b) { return b.pts - a.pts || b.ok - a.ok || (a.you ? -1 : b.you ? 1 : a.n < b.n ? -1 : 1); });
    return rows;
  }
  function tableHtml(rows) {
    return '<table class="t"><tr><th>#</th><th>TIPSTER</th><th>RIGHT</th><th>JP</th></tr>' + rows.map(function (r, i) {
      return '<tr class="' + (r.you ? "top" : "") + '"><td>' + (i + 1) + "</td><td>" + (r.you ? "<b>" + esc(r.n) + "</b> &#9733;" : esc(r.n)) + "</td><td>" + r.ok + '</td><td class="pts">' + r.pts + "</td></tr>";
    }).join("") + "</table>";
  }

  function render(U) {
    var S = load(), now = Date.now(), RD = rounds(U), h = "";
    var open = RD.filter(function (rd) { return rd.matches.some(function (m) { return tippable(m) && !m.score && kickoff(rd.date, m.time) > now; }); }).slice(0, 2);
    var mine = RD.filter(function (rd) { return rd.matches.some(function (m) { return m.score && S.picks[m.key]; }); });
    h += '<div class="box"><h2>YOUR TIPS</h2><p><label for="tname">Your name in the table:</label> <input id="tname" class="tip-name" maxlength="20" value="' + esc(S.name || "") + '" placeholder="YOU"></p>';
    if (!open.length) h += '<p>No tips open right now. Jarysh Odds for the next round go up two days before the games; the play-off opens when the seeds are known. Come back then!</p>';
    open.forEach(function (rd) {
      h += "<h3>" + esc(rd.label) + " &middot; " + esc(nice(rd.date)) + "</h3>";
      var bank = S.banker[rd.label];
      h += '<table class="t tips"><tr><th>TIME</th><th>MATCH</th><th>' + (rd.po ? "WINNER" : "HOME &middot; DRAW &middot; AWAY") + '</th><th title="Banker: double JP on one tip per round">BANK</th></tr>' +
        rd.matches.filter(tippable).sort(function (a, b) { return a.time < b.time ? -1 : 1; }).map(function (m) {
          var lock = m.score || kickoff(rd.date, m.time) <= now, p = S.picks[m.key];
          var opts = m.po ? [["H", m.home], ["A", m.away]] : [["H", m.odds[0].toFixed(2)], ["D", m.odds[1].toFixed(2)], ["A", m.odds[2].toFixed(2)]];
          var btns = opts.map(function (o) {
            return '<button type="button" class="odds tip' + (p === o[0] ? " on" : "") + '" data-k="' + m.key + '" data-p="' + o[0] + '"' + (lock ? " disabled" : "") + ' aria-pressed="' + (p === o[0]) + '">' + esc(o[1]) + "</button>";
          }).join(" ");
          return "<tr><td>" + esc(m.time) + "</td><td>" + esc(m.home) + ' <span style="color:var(--muted)">v</span> ' + esc(m.away) + '<br><span class="tiny">' + esc(m.venue) + (lock ? " &middot; LOCKED" : "") + "</span></td><td>" + btns +
            '</td><td><input type="radio" class="tip-bank" name="bank-' + slug(rd.label) + '" data-r="' + esc(rd.label) + '" data-k="' + m.key + '"' + (bank === m.key ? " checked" : "") + (lock || !p ? " disabled" : "") + ' aria-label="Banker"></td></tr>';
        }).join("") + "</table>";
      if (rd.boost) h += '<p class="tiny">&#128293; Nurik bankers the Boost game: ' + esc(rd.boost.home) + " v " + esc(rd.boost.away) + ". Beat the Boss!</p>";
    });
    if (open.length) h += '<p class="tiny" id="tsaved">Tips are kept in this browser only and lock at kick-off. A right tip scores the odds &times; 10 in Jarysh Points (JP).</p>';
    h += "</div>";

    var played = RD.filter(function (rd) { return rd.matches.some(function (m) { return m.score && tippable(m); }); });
    var last = mine.length ? mine[mine.length - 1] : played[played.length - 1];
    if (last) {
      var rows = table(last, S), me = rows.filter(function (r) { return r.you; })[0], rank = rows.indexOf(me) + 1;
      h += '<div class="box red"><h2>WEEKLY TABLE &middot; ' + esc(last.label) + "</h2>" + tableHtml(rows) + '<ul class="res">' +
        last.matches.filter(function (m) { return m.score && tippable(m); }).map(function (m) {
          var p = S.picks[m.key], x = score(m, p, S.banker[last.label] === m.key);
          return '<li><span class="h">' + esc(m.home) + '</span><span class="sc">' + m.score[0] + " – " + m.score[1] + "</span><span>" + esc(m.away) +
            '<br><span class="tiny">' + (p ? "You: " + (p === "H" ? "HOME" : p === "A" ? "AWAY" : "DRAW") + (S.banker[last.label] === m.key ? " (BANKER)" : "") + " &middot; " + (x > 0 ? "+" + x + " JP" : "0") : "No tip") + "</span></span></li>";
        }).join("") + "</ul>";
      if (mine.length && mine[mine.length - 1] === last) {
        var txt = "JARYSH TIPPING LEAGUE, " + last.label + ": " + me.pts + " JP, " + me.ok + "/" + me.n_ + " right. " + (rank === 1 ? "TOP OF THE TABLE! " : "") + "#" + rank + " of " + rows.length +
          (rows.filter(function (r) { return r.boss; })[0].pts < me.pts ? ". Beat the Boss!" : ".") + " https://jarysh.com/tipping.html";
        h += '<p><label for="tshare"><b>SHARE YOUR WEEK:</b></label><textarea id="tshare" class="tip-share" rows="3" readonly>' + esc(txt) + '</textarea><button type="button" class="btn-gold" id="tcopy">COPY</button> <a class="btn-tulpar" href="https://tulparapp.com/app/#sub=jarysh" rel="noopener">POST IT ON TULPAR</a></p>';
      } else h += '<p class="tiny">You had no tips in this round. Tip the next one before kick-off to get in the table.</p>';
      h += "</div>";
    }
    if (mine.length > 1) {
      var tot = {}, list = [];
      mine.forEach(function (rd) { table(rd, S).forEach(function (r) { var k = r.you ? "\u0000" : r.n; if (!tot[k]) { tot[k] = { n: r.n, you: r.you, pts: 0, ok: 0 }; list.push(tot[k]); } tot[k].pts += r.pts; tot[k].ok += r.ok; }); });
      list.sort(function (a, b) { return b.pts - a.pts || b.ok - a.ok || (a.you ? -1 : b.you ? 1 : a.n < b.n ? -1 : 1); });
      h += '<div class="box"><h2>YOUR SEASON &middot; ' + mine.length + " ROUNDS</h2>" + tableHtml(list) + '<p class="tiny">Counted over the rounds you tipped.</p></div>';
    }
    if (Object.keys(S.picks).length) h += '<p class="tiny"><button type="button" class="tip-clear" id="tclear">Clear my tips</button></p>';
    ROOT.innerHTML = h;

    function store() { var ok = save(S), el = document.getElementById("tsaved"); if (el) el.textContent = ok ? "Saved in this browser. Tips lock at kick-off." : "This browser is not keeping data (private window?), so your tips will be lost when you leave."; }
    Array.prototype.forEach.call(ROOT.querySelectorAll("button.tip"), function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-k"), p = b.getAttribute("data-p");
        if (S.picks[k] === p) { delete S.picks[k]; Object.keys(S.banker).forEach(function (r) { if (S.banker[r] === k) delete S.banker[r]; }); } else S.picks[k] = p;
        store(); render(U);
      });
    });
    Array.prototype.forEach.call(ROOT.querySelectorAll("input.tip-bank"), function (x) {
      x.addEventListener("change", function () { S.banker[x.getAttribute("data-r")] = x.getAttribute("data-k"); store(); });
    });
    var nm = document.getElementById("tname");
    nm.addEventListener("change", function () { S.name = nm.value.replace(/\s+/g, " ").trim().slice(0, 20); store(); render(U); });
    var cp = document.getElementById("tcopy");
    if (cp) cp.addEventListener("click", function () {
      var ta = document.getElementById("tshare"); ta.select();
      var done = function () { cp.textContent = "COPIED!"; };
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, function () { try { document.execCommand("copy"); done(); } catch (e) {} });
      else { try { document.execCommand("copy"); done(); } catch (e) {} }
    });
    var cl = document.getElementById("tclear");
    if (cl) cl.addEventListener("click", function () {
      if (!cl._armed) { cl._armed = true; cl.textContent = "Sure? Click again to clear every tip"; return; }
      try { localStorage.removeItem(KEY); } catch (e) {} render(U);
    });
  }
  fetch("data/ulak-2026.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(render)
    .catch(function () { ROOT.innerHTML = '<div class="box"><p>The tipping sheet could not be loaded. Refresh, or blame Attelkom.</p></div>'; });
})();
