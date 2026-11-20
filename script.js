/* =====================================================================
   LỜI CHÚC TRÊN BẢNG GHIM
   Mỗi tờ ghim trên bảng là một mục dưới đây. Sửa nội dung tuỳ ý.
   style: note | pink | blue | paper | env
   ===================================================================== */
const WISHES = [
  { icon: "ic-search", style: "note", text: "Kính chúc R2Studio của thầy ngày càng có nhiều công trình hay về tìm kiếm và gợi ý, nhiều bài được nhận ở các hội nghị lớn." },
  { icon: "ic-rocket", style: "pink", text: "Kính chúc thầy sự nghiệp ngày càng vững vàng, mọi kế hoạch nghiên cứu và giảng dạy đều thuận lợi." },
  { icon: "ic-health", style: "paper", text: "Kính chúc thầy luôn dồi dào sức khoẻ. Mong thầy đừng vì bận việc mà quên chăm sóc bản thân." },
  { icon: "ic-family", style: "blue", text: "Kính chúc thầy và gia đình luôn bình an, hạnh phúc, có thật nhiều thời gian ấm áp bên nhau." },
  { icon: "ic-paper", style: "env", text: "Chúc mừng thầy với Top 10 Quả Cầu Vàng 2025. Chúc thầy có thêm nhiều công trình được ghi nhận xứng đáng." },
  { icon: "ic-leaf", style: "note", text: "Chúc IndoorCare và Living Lab sớm đưa được những không gian sống trong lành hơn đến với nhiều người." },
  { icon: "ic-bulb", style: "pink", text: "Chúc chương trình AI Thực Chiến và các lớp Khoa học Dữ liệu của thầy luôn có những học viên chăm chỉ và nhiều ý tưởng hay." },
  { icon: "ic-coffee", style: "blue", text: "Chúc thầy một ngày 20/11 thật vui vẻ, có những buổi chiều thong thả sau giờ làm việc." },
];

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Bảng ghim + đọc thư ---------- */
  const board = $("#boardPins");
  const reader = $("#reader");
  let lastFocus = null;
  WISHES.forEach((w, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `pin pin--${w.style || "note"}`;
    b.style.setProperty("--r", `${((i * 37) % 9) - 4}deg`);
    const peek = document.createElement("span"); peek.className = "pin__peek"; peek.textContent = w.text;
    const ic = document.createElement("img"); ic.className = "pin__icon"; ic.src = `assets/${w.icon}.png`; ic.alt = "";
    const open = document.createElement("span"); open.className = "pin__open"; open.textContent = "đọc";
    b.append(ic, peek, open);
    b.addEventListener("click", () => openReader(w, b));
    board.append(b);
  });
  function openReader(w, btn) {
    lastFocus = btn;
    $("#readerText").textContent = w.text;
    $("#readerFrom").textContent = "Học trò của thầy";
    $("#readerIcon").src = `assets/${w.icon}.png`;
    reader.hidden = false;
    btn.classList.add("read");
    $(".reader__close").focus();
    if (window.gsap && !reduce) {
      gsap.fromTo(".reader__paper", { y: 60, rotate: -4, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .5, ease: "power3.out" });
      gsap.fromTo(".reader__backdrop", { opacity: 0 }, { opacity: 1, duration: .3 });
    }
  }
  function closeReader() {
    reader.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  reader.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeReader(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !reader.hidden) closeReader(); });

  /* ---------- Biểu đồ trích dẫn (OpenAlex) ---------- */
  const CITES = [[2017, 1], [2018, 2], [2019, 5], [2020, 6], [2021, 24], [2022, 49], [2023, 138], [2024, 209], [2025, 270], [2026, 352]];
  const chart = $("#citeChart");
  if (chart) {
    const max = 420;
    chart.innerHTML = `<div class="chart__bars">${CITES.map(([y, c]) =>
      `<div class="chart__col"><span class="chart__v">${c}</span><span class="chart__bar" style="--h:${(c / max) * 100}%"></span><span class="chart__y">'${String(y).slice(2)}</span></div>`).join("")}</div>`;
  }

  /* ---------- Drone fleet ---------- */
  const FLEET = [
    { img: "drone-letter", x: 14, y: 30, from: [-1, -0.3] },
    { img: "drone-flowers", x: 76, y: 34, from: [1, -0.4] },
    { img: "drone-books", x: 8, y: 58, from: [-1, 0.2] },
    { img: "drone-heart", x: 80, y: 56, from: [1, 0.1] },
    { img: "drone-trophy", x: 60, y: 30, from: [0.4, -1] },
  ];
  const fleet = $("#fleet");
  FLEET.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "drone";
    el.dataset.img = d.img;
    const narrow = window.innerWidth < 640;
    el.style.left = (narrow ? Math.min(d.x, 74) : d.x) + "%";
    el.style.top = (narrow ? 12 + d.y * 0.55 : d.y) + "%";
    el.style.setProperty("--dl", `${-i * 0.37}s`);
    el.innerHTML = `<img src="assets/${d.img}.png" alt="" />` + (d.img === "drone-trophy" ? `<img class="empty" src="assets/drone.png" alt="" />` : "");
    fleet.append(el);
  });

  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  document.documentElement.classList.add("js");
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. Mở thư ---------- */
  gsap.set(".layer", { rotateX: -86, transformPerspective: 900, transformOrigin: "50% 100%" });
  gsap.set(".door", { transformPerspective: 2200 });
  gsap.set(".inside__text", { opacity: 0, y: 24 });
  const inside = $(".inside");
  gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: ".gate-scene", start: "top top", end: "+=170%", scrub: 0.6, pin: true, anticipatePin: 1 },
  })
    .to(".scroll-hint", { opacity: 0, duration: .08 }, 0)
    .to([".door__title", ".door__sub"], { backgroundPosition: "100% 0", duration: .5 }, 0)
    .to(".seal img", { rotation: 200, duration: .6 }, 0)
    .to(".door--l", { rotateY: -112, ease: "power1.inOut", duration: .5 }, .04)
    .to(".door--r", { rotateY: 112, ease: "power1.inOut", duration: .5 }, .04)
    .to(inside, { "--shade": 0, duration: .45 }, .1)
    .to(".layer--1", { rotateX: 0, ease: "power2.out", duration: .3 }, .24)
    .to(".layer--2", { rotateX: 0, ease: "power2.out", duration: .3 }, .31)
    .to(".layer--3", { rotateX: 0, ease: "power2.out", duration: .3 }, .38)
    .to(".inside__text", { opacity: 1, y: 0, ease: "power2.out", duration: .25 }, .5)
    .to(".gate", { scale: 1.03, duration: .3 }, .7);

  /* ---------- 2. Drone bay tới ---------- */
  const W = () => window.innerWidth, H = () => window.innerHeight;
  const sky = gsap.timeline({
    scrollTrigger: { trigger: ".sky-scene", start: "top top", end: "+=240%", scrub: 1, pin: true, anticipatePin: 1 },
  });
  sky.from(".fig-wrap", { y: 80, opacity: 0, duration: .3 }, 0);
  $$(".drone").forEach((el, i) => {
    const d = FLEET[i];
    sky.from(el, {
      x: () => d.from[0] * W() * 0.7,
      y: () => d.from[1] * H() * 0.7,
      rotation: d.from[0] * -14,
      ease: "power2.out", duration: .5,
    }, .15 + i * .18);
  });
  sky.from(".robots__line", { yPercent: 100, duration: .5, ease: "power2.out" }, .25);
  // drone cúp hạ xuống tay thầy rồi thầy giơ cúp
  const trophyDrone = $('.drone[data-img="drone-trophy"]');
  sky.to(trophyDrone, { x: () => -W() * 0.13, y: () => H() * 0.1, duration: .25, ease: "power1.inOut" }, 1.15)
    .to("#figWave", { opacity: 0, duration: .03 }, 1.4)
    .to("#figTrophy", { opacity: 1, duration: .03 }, 1.4)
    .to(trophyDrone.querySelector("img"), { opacity: 0, duration: .03 }, 1.4)
    .to(trophyDrone.querySelector(".empty"), { opacity: 1, duration: .03 }, 1.4)
    .to(trophyDrone, { y: () => -H() * 0.7, x: () => W() * 0.3, duration: .3, ease: "power2.in" }, 1.44)
    .to("#skyTitle", { opacity: 0, duration: .1 }, 1.45)
    .from("#banner", { y: () => -H() * 0.5, opacity: 0, duration: .35, ease: "power2.out" }, 1.55)
    .to({}, { duration: .3 });

  /* ---------- 3. Mốc thời gian ---------- */
  $$(".stop").forEach((stop) => {
    const items = $$(".stop__year, .stop__body > *", stop);
    gsap.from(items, { opacity: 0, y: 30, duration: .8, ease: "power3.out", stagger: .1,
      scrollTrigger: { trigger: stop, start: "top 78%", once: true } });
  });
  // sticker dán vào: hơi nhấc lên rồi ép xuống
  $$(".sticker").forEach((st) => {
    gsap.from(st, { scale: 1.25, rotation: "+=18", opacity: 0, duration: .6, ease: "back.out(1.6)",
      scrollTrigger: { trigger: st, start: "top 85%", once: true } });
  });
  $$(".stamp, .pstamp").forEach((st, i) => {
    gsap.from(st, { scale: 1.7, opacity: 0, duration: .35, ease: "power4.in", delay: (i % 6) * .1,
      scrollTrigger: { trigger: st, start: "top 85%", once: true } });
  });
  $$("[data-draw]").forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const host = path.closest(".clip") || path.closest(".exam");
    gsap.to(path, { strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: host, start: "top 70%", end: "center 45%", scrub: 0.6 } });
  });
  gsap.from(".clip__note", { opacity: 0, y: 10, scrollTrigger: { trigger: ".clip", start: "center 60%", end: "center 45%", scrub: .6 } });

  /* ---------- 4. Paper ---------- */
  gsap.from(".paper", { y: 60, opacity: 0, rotation: -1.5, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".paper-scene", start: "top 75%", once: true } });
  gsap.from(".chart__bar", { scaleY: 0, transformOrigin: "50% 100%", duration: .8, ease: "power2.out", stagger: .06,
    scrollTrigger: { trigger: "#citeChart", start: "top 80%", once: true } });

  /* ---------- 4b. Thư: mở ra như tờ giấy gấp ---------- */
  gsap.fromTo(".letter", { clipPath: "inset(0 0 88% 0)", y: 40 },
    { clipPath: "inset(0 0 0% 0)", y: 0, ease: "none",
      scrollTrigger: { trigger: ".letter-scene", start: "top 85%", end: "top 5%", scrub: .8 } });
  gsap.from(".letter__seal", { scale: 1.6, opacity: 0, rotation: -30, duration: .6, ease: "back.out(1.7)",
    scrollTrigger: { trigger: ".letter", start: "top 70%", once: true } });
  gsap.from(".letter__body p, .letter__sign", { opacity: 0, y: 18, duration: .8, ease: "power2.out", stagger: .12,
    scrollTrigger: { trigger: ".letter__body", start: "top 75%", once: true } });

  /* ---------- 5. Bảng ghim ---------- */
  gsap.from(".pin", { y: -40, opacity: 0, rotation: "+=10", duration: .5, ease: "back.out(1.8)", stagger: .08,
    scrollTrigger: { trigger: ".board", start: "top 75%", once: true } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
