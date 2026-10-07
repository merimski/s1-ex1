(function () {
  const STORAGE_KEY = "free-events-user";
  const $ = (id) => document.getElementById(id);

  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const parseDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };

  function loadUserEvents() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }
  function saveUserEvents(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* private mode */ }
  }

  // Turn relative sample dates into real dates.
  function normalize(e) {
    let date = e.date;
    if (!date) {
      const d = startOfToday();
      d.setDate(d.getDate() + (e.daysFromNow || 0));
      date = toISO(d);
    }
    return { ...e, date };
  }

  let userEvents = loadUserEvents();
  const allEvents = () =>
    [...window.EVENTS, ...userEvents].map(normalize).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Fill selects
  function fillSelect(select, items) {
    for (const item of items) select.append(new Option(item, item));
  }
  fillSelect($("region"), window.REGIONS);
  fillSelect($("category"), window.CATEGORIES);
  fillSelect($("formRegion"), window.REGIONS);
  fillSelect($("formCategory"), window.CATEGORIES);

  function inRange(dateISO, when) {
    const today = startOfToday();
    const d = parseDate(dateISO);
    const diff = Math.round((d - today) / 86400000);
    if (diff < 0) return false; // past events are hidden
    switch (when) {
      case "today": return diff === 0;
      case "week": return diff < 7;
      case "month": return diff < 30;
      case "weekend": {
        // Israeli weekend: Friday (5) and Saturday (6) of the current week
        const untilFri = (5 - today.getDay() + 7) % 7;
        const start = today.getDay() === 6 ? -1 : untilFri;
        return diff >= Math.max(start, 0) && diff <= start + 1;
      }
      default: return true;
    }
  }

  const dateFmt = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long" });

  function icsLink(e) {
    const [h, m] = e.time.split(":").map(Number);
    const start = parseDate(e.date); start.setHours(h, m);
    const end = new Date(start.getTime() + 2 * 3600000);
    const stamp = (d) => `${toISO(d).replace(/-/g, "")}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//free-events-israel//HE", "BEGIN:VEVENT",
      `UID:${stamp(start)}-${encodeURIComponent(e.title)}@free-events-israel`,
      `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${e.title}`, `LOCATION:${e.venue}, ${e.city}`,
      `DESCRIPTION:${(e.description || "").replace(/\n/g, " ")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  }

  function card(e) {
    const el = document.createElement("article");
    el.className = "card";

    const tags = document.createElement("div");
    tags.className = "tags";
    for (const [text, cls] of [["חינם", "tag free"], [e.category, "tag"], [e.region, "tag"]].concat(e.kids ? [["👨‍👩‍👧 לילדים", "tag"]] : [])) {
      const t = document.createElement("span"); t.className = cls; t.textContent = text; tags.append(t);
    }

    const h = document.createElement("h3"); h.textContent = e.title;
    const p = document.createElement("p"); p.textContent = e.description || "";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = "<span></span><span></span>";
    meta.children[0].textContent = `📅 ${dateFmt.format(parseDate(e.date))} · ${e.time}`;
    meta.children[1].textContent = `📍 ${e.venue}, ${e.city}`;

    const links = document.createElement("div");
    links.className = "links";
    const map = document.createElement("a");
    map.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${e.venue} ${e.city}`);
    map.target = "_blank"; map.rel = "noopener"; map.textContent = "🗺️ מפה";
    const cal = document.createElement("a");
    cal.href = icsLink(e); cal.download = "event.ics"; cal.textContent = "🗓️ ליומן";
    links.append(map, cal);
    if (e.link && /^https?:\/\//.test(e.link)) {
      const more = document.createElement("a");
      more.href = e.link; more.target = "_blank"; more.rel = "noopener"; more.textContent = "🔗 פרטים";
      links.append(more);
    }
    if (e.userId) {
      const del = document.createElement("button");
      del.textContent = "🗑️ מחיקה";
      del.onclick = () => {
        userEvents = userEvents.filter((u) => u.userId !== e.userId);
        saveUserEvents(userEvents);
        render();
      };
      links.append(del);
    }

    el.append(tags, h, p, meta, links);
    return el;
  }

  function render() {
    const q = $("search").value.trim().toLowerCase();
    const region = $("region").value;
    const category = $("category").value;
    const when = $("when").value;
    const kids = $("kids").checked;

    const list = allEvents().filter((e) =>
      inRange(e.date, when) &&
      (!region || e.region === region) &&
      (!category || e.category === category) &&
      (!kids || e.kids) &&
      (!q || [e.title, e.description, e.city, e.venue].join(" ").toLowerCase().includes(q))
    );

    $("list").replaceChildren(...list.map(card));
    $("empty").hidden = list.length > 0;
    $("count").textContent = list.length === 1 ? "נמצא אירוע אחד" : `נמצאו ${list.length} אירועים`;
  }

  ["search", "region", "category", "when", "kids"].forEach((id) => $(id).addEventListener("input", render));

  // Add-event dialog
  const dialog = $("addDialog");
  const form = $("addForm");
  $("addBtn").addEventListener("click", () => {
    form.reset();
    form.date.value = toISO(startOfToday());
    dialog.returnValue = "";
    dialog.showModal();
  });
  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") return;
    const data = Object.fromEntries(new FormData(form));
    userEvents.push({ ...data, kids: data.kids === "on", userId: Date.now() });
    saveUserEvents(userEvents);
    render();
  });

  render();
})();
