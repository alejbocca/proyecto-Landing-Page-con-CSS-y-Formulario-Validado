interface Window {
  intlTelInputGlobals?: {
    getInstance(input: HTMLInputElement): { isValidNumber(): boolean } | undefined;
  };
}

(function () {
  "use strict";

  const form = document.getElementById("inscripcion-form") as HTMLFormElement | null;
  const formStatus = document.getElementById("form-status") as HTMLElement | null;

  if (!form || !formStatus) return;

  function preselectPrograma(): void {
    const params = new URLSearchParams(window.location.search);
    const programa = params.get("programa");
    if (!programa) return;

    const select = document.getElementById("programa");
    if (!(select instanceof HTMLSelectElement)) return;

    const hasOption = Array.from(select.options).some(function (option): boolean {
      return option.value === programa;
    });
    if (hasOption) select.value = programa;
  }

  preselectPrograma();

  type FieldName = "nombre" | "email" | "whatsapp" | "programa";
  type Validator = (value: string, field?: HTMLInputElement | HTMLSelectElement) => string;

  const validators: Record<FieldName, Validator> = {
    nombre: function (v): string {
      if (!v.trim()) return "El nombre es obligatorio.";
      if (v.trim().length < 2) return "Ingresa al menos 2 caracteres.";
      return "";
    },
    email: function (v): string {
      if (!v.trim()) return "El correo electrónico es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ingresa un correo electrónico válido.";
      return "";
    },
    whatsapp: function (v, field): string {
      if (!v.trim()) return "El número de WhatsApp es obligatorio.";
      const iti = field instanceof HTMLInputElement && window.intlTelInputGlobals
        ? window.intlTelInputGlobals.getInstance(field)
        : undefined;
      if (iti) return iti.isValidNumber() ? "" : "Ingresa un número de WhatsApp válido para el país seleccionado.";
      return /^[0-9+\s\-()]{8,20}$/.test(v) ? "" : "Ingresa un número válido con código de país.";
    },
    programa: function (v): string {
      if (!v) return "Selecciona un programa.";
      return "";
    }
  };

  function isFieldName(name: string): name is FieldName {
    return Object.prototype.hasOwnProperty.call(validators, name);
  }

  function isValidatableField(el: Element): el is HTMLInputElement | HTMLSelectElement {
    return el instanceof HTMLInputElement || el instanceof HTMLSelectElement;
  }

  function validateField(field: HTMLInputElement | HTMLSelectElement): boolean {
    if (!isFieldName(field.name)) return true;

    const errorEl = document.getElementById(field.id + "-error");
    const msg = validators[field.name](field.value, field);
    if (errorEl) errorEl.textContent = msg;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.querySelectorAll("input, select").forEach(function (el): void {
    if (!isValidatableField(el)) return;
    const field = el;

    field.addEventListener("blur", function (): void {
      validateField(field);
    });

    field.addEventListener("input", function (): void {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });

    field.addEventListener("change", function (): void {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", function (e): void {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.removeAttribute("role");

    let valid = true;
    form.querySelectorAll("input[required], select[required]").forEach(function (el): void {
      if (!isValidatableField(el)) return;
      if (!validateField(el)) valid = false;
    });

    if (!valid) {
      const firstInvalid = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    formStatus.setAttribute("role", "alert");
    formStatus.textContent = "¡Inscripción recibida! Un asesor se pondrá en contacto contigo pronto.";
    form.reset();
    form.querySelectorAll("input, select").forEach(function (el): void {
      el.removeAttribute("aria-invalid");
    });
  });
})();
