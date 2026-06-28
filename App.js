(function () {
  const WHATSAPP_NUMBER = "27730882155";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const drawer = $("#site-menu");
  const drawerScrim = $(".drawer-scrim");
  const openMenuButton = $("[data-open-menu]");
  const modal = $("[data-modal]");
  let lastFocusedElement = null;

  function openMenu() {
    if (!drawer || !drawerScrim) return;
    lastFocusedElement = document.activeElement;
    drawer.classList.add("is-open");
    drawerScrim.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (openMenuButton) openMenuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    const close = $("[data-close-menu]", drawer);
    if (close) close.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!drawer || !drawerScrim) return;
    drawer.classList.remove("is-open");
    drawerScrim.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (openMenuButton) openMenuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  function setEventType(value) {
    if (!value) return;
    $$("select[name='eventType']").forEach((select) => {
      const hasOption = Array.from(select.options).some((option) => option.value === value || option.text === value);
      if (hasOption) select.value = value;
    });
  }

  function openQuote(eventType) {
    setEventType(eventType);
    if (!modal) {
      const target = eventType ? quote.html?event=${encodeURIComponent(eventType)} : "quote.html";
      window.location.href = target;
      return;
    }
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      const firstInput = $("select, input, textarea, button", modal);
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
  }

  function closeQuote() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      modal.hidden = true;
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }, 230);
  }

  function minDateString() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 10);
  }

  function selectedNeeds(form) {
    const needs = $$("input[name='needs']:checked", form).map((input) => input.value);
    return needs.length ? needs.join(", ") : "Not sure yet";
  }

  function readForm(form) {
    const formData = new FormData(form);
    return {
      eventType: String(formData.get("eventType") || "Not chosen"),
      eventDate: String(formData.get("eventDate") || "Not chosen"),
      location: String(formData.get("location") || "Not provided"),
      guests: String(formData.get("guests") || "Not provided"),
      needs: selectedNeeds(form),
      name: String(formData.get("name") || "Not provided"),
      phone: String(formData.get("phone") || "Not provided"),
      notes: String(formData.get("notes") || "None")
    };
  }

  function makeWhatsAppMessage(data) {
    return [
      "Hi HandlT, I need help with an event quote.",
      "",
      Event type: ${data.eventType},
      Event date: ${data.eventDate},
      Area / venue: ${data.location},
      Guests: ${data.guests},
      What I need: ${data.needs},
      Name: ${data.name},
      WhatsApp number: ${data.phone},
      Notes: ${data.notes}
    ].join("\n");
  }

  function whatsappUrlFromForm(form) {
    const data = readForm(form);
    const message = makeWhatsAppMessage(data);
    try {
      localStorage.setItem("handlt:lastQuote", JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
    } catch (error) {
      // Local storage can fail in private browsing. The WhatsApp flow still works.
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  if (openMenuButton) openMenuButton.addEventListener("click", openMenu);
  $$('[data-close-menu]').forEach((button) => button.addEventListener("click", closeMenu));
  $$(".menu-item").forEach((link) => link.addEventListener("click", closeMenu));

  $$('[data-open-quote]').forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openQuote(trigger.getAttribute("data-event") || "");
    });
  });

  $$('[data-close-quote]').forEach((button) => button.addEventListener("click", closeQuote));
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeQuote();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeQuote();
    }
  });

  $$("input[type='date']").forEach((input) => {
    if (!input.min) input.min = minDateString();
  });

  const params = new URLSearchParams(window.location.search);
  const urlEvent = params.get("event");
  if (urlEvent) setEventType(urlEvent);

  $$('[data-quote-form]').forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = whatsappUrlFromForm(form);
      const panel = form.closest(".quote-panel") || form.closest(".quote-page-card") || document;
      const success = $("[data-success]", panel) || $("[data-success]");
      const link = $("[data-whatsapp-summary]", panel) || $("[data-whatsapp-summary]");
      if (link) link.href = url;
      if (success) success.classList.add("is-visible");
      window.open(url, "_blank", "noopener");
    });
  });
})();
