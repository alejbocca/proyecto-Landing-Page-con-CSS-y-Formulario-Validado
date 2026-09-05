(function (): void {
  "use strict";

  /* ── Theme toggle ── */
  function inicializarThemeToggle(): void {
    const themeToggleEl = document.getElementById("theme-toggle");
    const iconSunEl = document.getElementById("icon-sun");
    const iconMoonEl = document.getElementById("icon-moon");

    if (!(themeToggleEl instanceof HTMLButtonElement)) return;
    if (!(iconSunEl instanceof SVGElement)) return;
    if (!(iconMoonEl instanceof SVGElement)) return;

    const themeToggle: HTMLButtonElement = themeToggleEl;
    const iconSun: SVGElement = iconSunEl;
    const iconMoon: SVGElement = iconMoonEl;

    function syncThemeUI(theme: string | null): void {
      const isLight = theme === "light";
      iconSun.toggleAttribute("hidden", isLight);
      iconMoon.toggleAttribute("hidden", !isLight);
      themeToggle.setAttribute("aria-label", isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    }

    syncThemeUI(document.documentElement.getAttribute("data-theme"));

    themeToggle.addEventListener("click", function (): void {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      syncThemeUI(next);
    });
  }

  /* ── Dialogs ── */
  function inicializarDialogoEliminar(): void {
    const btnAbrir = document.getElementById("btn-abrir-dialog");
    const dialogo = document.getElementById("dialog-eliminar");
    const btnCancelar = document.getElementById("btn-cancelar-dialog");
    const btnConfirmar = document.getElementById("btn-confirmar-eliminar");

    if (!(btnAbrir instanceof HTMLButtonElement)) return;
    if (!(dialogo instanceof HTMLDialogElement)) return;
    if (!(btnCancelar instanceof HTMLButtonElement)) return;
    if (!(btnConfirmar instanceof HTMLButtonElement)) return;

    btnAbrir.addEventListener("click", function (): void {
      dialogo.showModal();
    });

    btnCancelar.addEventListener("click", function (): void {
      dialogo.close();
    });

    btnConfirmar.addEventListener("click", function (): void {
      dialogo.close();
    });

    dialogo.addEventListener("close", function (): void {
      btnAbrir.focus();
    });
  }

  /* ── Menús desplegables ── */
  function inicializarMenu(idTrigger: string, idMenu: string): void {
    const triggerEl = document.getElementById(idTrigger);
    const menuEl = document.getElementById(idMenu);

    if (!(triggerEl instanceof HTMLButtonElement)) return;
    if (!(menuEl instanceof HTMLUListElement)) return;

    const trigger: HTMLButtonElement = triggerEl;
    const menu: HTMLUListElement = menuEl;

    function obtenerItems(): HTMLElement[] {
      return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    }

    function abrirMenu(): void {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      const items = obtenerItems();
      if (items.length > 0) items[0].focus();
    }

    function cerrarMenu(devolverFocoAlTrigger: boolean): void {
      if (menu.hidden) return;
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (devolverFocoAlTrigger) trigger.focus();
    }

    trigger.addEventListener("click", function (): void {
      if (menu.hidden) {
        abrirMenu();
      } else {
        cerrarMenu(false);
      }
    });

    menu.addEventListener("keydown", function (e: KeyboardEvent): void {
      const items = obtenerItems();
      const indiceActual = items.indexOf(document.activeElement as HTMLElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const siguiente = items[(indiceActual + 1) % items.length];
        if (siguiente) siguiente.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const anterior = items[(indiceActual - 1 + items.length) % items.length];
        if (anterior) anterior.focus();
      }
    });

    menu.addEventListener("focusout", function (e: FocusEvent): void {
      const siguienteFoco = e.relatedTarget;
      const sigueDentro = siguienteFoco instanceof Node && (menu.contains(siguienteFoco) || trigger.contains(siguienteFoco));
      if (!sigueDentro) cerrarMenu(false);
    });

    document.addEventListener("keydown", function (e: KeyboardEvent): void {
      if (menu.hidden) return;
      if (e.key === "Escape") cerrarMenu(true);
    });

    document.addEventListener("click", function (e: MouseEvent): void {
      if (menu.hidden) return;
      const objetivo = e.target;
      if (objetivo instanceof Node && !menu.contains(objetivo) && !trigger.contains(objetivo)) {
        cerrarMenu(false);
      }
    });
  }

  /* ── Toasts ── */
  const TOAST_MAX_VISIBLE = 3;
  const TOAST_DURATION_MS = 5000;

  function limitarToastsVisibles(contenedor: HTMLElement): void {
    const toasts = Array.from(contenedor.querySelectorAll<HTMLElement>(".c-toast"));
    const exceso = toasts.length - TOAST_MAX_VISIBLE;
    for (let i = 0; i < exceso; i++) {
      toasts[i].remove();
    }
  }

  function programarAutoDescarte(toast: HTMLElement): void {
    window.setTimeout(function (): void {
      toast.remove();
    }, TOAST_DURATION_MS);
  }

  function inicializarToasts(): void {
    const contenedor = document.querySelector<HTMLElement>(".c-toast-container");
    if (!contenedor) return;

    limitarToastsVisibles(contenedor);
    contenedor.querySelectorAll<HTMLElement>(".c-toast").forEach(programarAutoDescarte);
  }

  inicializarThemeToggle();
  inicializarDialogoEliminar();
  inicializarMenu("menu-toggle-texto", "menu-lista-texto");
  inicializarMenu("menu-toggle-icono", "menu-lista-icono");
  inicializarToasts();
})();
