(function () {
  "use strict";

  /* —— Quiz —— */
  const quizQuestions = [
    {
      q: "Wat is je hoofdreden om naar Madeira te gaan?",
      opts: [
        { text: "Wandelen door levadas en bergen", scores: { levada: 3, west: 1, funchal: 0 } },
        { text: "Natuur, kliffen en natuurlijke zwembaden", scores: { levada: 1, west: 3, funchal: 1 } },
        { text: "Stad, sightseeing en relaxte dagtrips", scores: { levada: 0, west: 1, funchal: 3 } },
        { text: "Een mix — beetje van alles", scores: { levada: 2, west: 2, funchal: 2 } },
      ],
    },
    {
      q: "Hoe wil je je verplaatsen?",
      opts: [
        { text: "Huurauto — volle vrijheid op bergwegen", scores: { levada: 2, west: 3, funchal: 0 } },
        { text: "Funchal-base + tours / taxi’s waar nodig", scores: { levada: 1, west: 0, funchal: 3 } },
        { text: "Mix: paar dagen auto, rest bus of te voet", scores: { levada: 2, west: 2, funchal: 2 } },
      ],
    },
    {
      q: "Hoe intensief mag een wandeldag zijn?",
      opts: [
        { text: "Lang en pittig (6+ uur, hoogteverschil)", scores: { levada: 3, west: 1, funchal: 0 } },
        { text: "Matig — mooie routes, geen marathon", scores: { levada: 2, west: 2, funchal: 1 } },
        { text: "Liever korte wandelingen of uitzichtpunten", scores: { levada: 0, west: 1, funchal: 3 } },
      ],
    },
    {
      q: "Waar wil je slapen?",
      opts: [
        { text: "Dicht bij de trails (Santana / São Vicente)", scores: { levada: 3, west: 2, funchal: 0 } },
        { text: "Westkust of noordwest (pools & zonsondergang)", scores: { levada: 1, west: 3, funchal: 0 } },
        { text: "Funchal — restaurants, kabelbaan, avondleven", scores: { levada: 0, west: 0, funchal: 3 } },
      ],
    },
  ];

  const itineraryNames = {
    levada: {
      id: "levada",
      title: "Klassieke levada-week",
      blurb: "Jij wilt laurisilva, tunnels en bergkammen. Deze week zet wandelen centraal, met Funchal als aankomstbuffer.",
    },
    west: {
      id: "west",
      title: "Westkust & natuurpools",
      blurb: "Kliffen, Porto Moniz, westelijke dorpjes en zonsondergangen. Minder pieken, meer Atlantische drift.",
    },
    funchal: {
      id: "funchal",
      title: "Funchal-base & dagtrips",
      blurb: "Comfortabele basis in de hoofdstad, met sightseeing, eten en selecte uitstapjes — ideaal zonder fulltime huurauto.",
    },
  };

  let quizStep = 0;
  const scores = { levada: 0, west: 0, funchal: 0 };

  const quizEl = document.getElementById("quiz");
  const progressEl = document.getElementById("quiz-progress");
  const questionEl = document.getElementById("quiz-question");
  const optsEl = document.getElementById("quiz-opts");
  const resultEl = document.getElementById("quiz-result");
  const resultTextEl = document.getElementById("quiz-result-text");
  const resultTitleEl = document.getElementById("quiz-result-title");

  function renderProgress() {
    progressEl.innerHTML = quizQuestions
      .map((_, i) => {
        let cls = "quiz-dot";
        if (i < quizStep) cls += " done";
        if (i === quizStep) cls += " active";
        return `<div class="${cls}" aria-hidden="true"></div>`;
      })
      .join("");
  }

  function renderQuestion() {
    const item = quizQuestions[quizStep];
    questionEl.textContent = item.q;
    optsEl.innerHTML = item.opts
      .map(
        (o, i) =>
          `<button type="button" class="quiz-opt" data-idx="${i}">${o.text}</button>`
      )
      .join("");
    optsEl.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const opt = item.opts[Number(btn.dataset.idx)];
        Object.keys(opt.scores).forEach((k) => {
          scores[k] += opt.scores[k];
        });
        quizStep += 1;
        if (quizStep >= quizQuestions.length) showResult();
        else {
          renderProgress();
          renderQuestion();
        }
      });
    });
  }

  function showResult() {
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const info = itineraryNames[winner];
    quizEl.querySelector(".quiz-body").style.display = "none";
    resultEl.classList.add("show");
    resultTitleEl.textContent = info.title;
    resultTextEl.textContent = info.blurb;
    document.querySelectorAll(".itin-card").forEach((c) => {
      c.classList.toggle("recommended", c.dataset.itin === winner);
    });
    resultEl.querySelector("[data-goto]").onclick = () => {
      selectItinerary(winner);
      document.getElementById("reizen").scrollIntoView({ behavior: "smooth" });
    };
  }

  document.getElementById("quiz-reset")?.addEventListener("click", () => {
    quizStep = 0;
    scores.levada = scores.west = scores.funchal = 0;
    resultEl.classList.remove("show");
    quizEl.querySelector(".quiz-body").style.display = "block";
    document.querySelectorAll(".itin-card").forEach((c) => c.classList.remove("recommended"));
    renderProgress();
    renderQuestion();
  });

  if (quizEl) {
    renderProgress();
    renderQuestion();
  }

  /* —— Itinerary tabs —— */
  function selectItinerary(id) {
    document.querySelectorAll(".itin-card").forEach((c) => {
      c.classList.toggle("active", c.dataset.itin === id);
      c.setAttribute("aria-selected", c.dataset.itin === id ? "true" : "false");
    });
    document.querySelectorAll(".blog-panel").forEach((p) => {
      p.classList.toggle("active", p.id === "blog-" + id);
    });
    applyFilter(currentFilter);
  }

  document.querySelectorAll(".itin-card").forEach((card) => {
    card.addEventListener("click", () => selectItinerary(card.dataset.itin));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectItinerary(card.dataset.itin);
      }
    });
  });

  /* —— Day expand —— */
  document.querySelectorAll(".day-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".day-card");
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* —— Filters —— */
  let currentFilter = "all";

  function applyFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("active", c.dataset.filter === filter);
    });
    const activePanel = document.querySelector(".blog-panel.active");
    if (!activePanel) return;
    activePanel.querySelectorAll(".day-card").forEach((day) => {
      if (filter === "all") {
        day.classList.remove("hidden-filter");
        return;
      }
      const tags = (day.dataset.tags || "").split(/\s+/);
      day.classList.toggle("hidden-filter", !tags.includes(filter));
    });
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
  });

  /* init */
  selectItinerary("levada");
})();
