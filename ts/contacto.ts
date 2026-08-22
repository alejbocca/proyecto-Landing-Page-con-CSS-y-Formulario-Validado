(function () {
  "use strict";

  interface ContactForm {
    nombre: string;
    email: string;
    mensaje: string;
  }

  type ContactField = keyof ContactForm;

  function esEmailValido(valor: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  type ContactValidator = (valor: string) => string;

  const validadoresPorCampo: Record<ContactField, ContactValidator> = {
    nombre: function (valor): string {
      return valor.trim().length === 0 ? "El nombre es requerido" : "";
    },
    email: function (valor): string {
      return !esEmailValido(valor) ? "Email inválido" : "";
    },
    mensaje: function (valor): string {
      return valor.trim().length < 10 ? "El mensaje es muy corto" : "";
    }
  };

  function validarFormulario(datos: ContactForm): string[] {
    const errores: string[] = [];
    (Object.keys(validadoresPorCampo) as ContactField[]).forEach(function (campo): void {
      const mensaje = validadoresPorCampo[campo](datos[campo]);
      if (mensaje) errores.push(mensaje);
    });
    return errores;
  }

  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const formStatus = document.getElementById("form-status") as HTMLElement | null;
  const nombreInput = document.getElementById("nombre") as HTMLInputElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const mensajeInput = document.getElementById("mensaje") as HTMLTextAreaElement | null;

  if (!form || !formStatus || !nombreInput || !emailInput || !mensajeInput) return;

  function isContactField(name: string): name is ContactField {
    return Object.prototype.hasOwnProperty.call(validadoresPorCampo, name);
  }

  function isValidatableField(el: Element): el is HTMLInputElement | HTMLTextAreaElement {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  }

  function esHTMLElement(el: Element | null): el is HTMLElement {
    return el instanceof HTMLElement;
  }

  function mostrarFeedback(errores: string[]): void {
    const caja = document.querySelector(".form-feedback");
    if (!esHTMLElement(caja)) return;
    caja.classList.remove("error", "exito");
    caja.classList.add(errores.length > 0 ? "error" : "exito");
    caja.textContent = errores.length > 0 ? errores.join(", ") : "¡Mensaje enviado!";
  }

  function validarCampo(field: HTMLInputElement | HTMLTextAreaElement): boolean {
    if (!isContactField(field.name)) return true;

    const errorEl = document.getElementById(field.id + "-error");
    const msg = validadoresPorCampo[field.name](field.value);
    if (errorEl) errorEl.textContent = msg;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.querySelectorAll("input, textarea").forEach(function (el): void {
    if (!isValidatableField(el)) return;
    const field = el;

    field.addEventListener("blur", function (): void {
      validarCampo(field);
    });

    field.addEventListener("input", function (): void {
      if (field.getAttribute("aria-invalid") === "true") validarCampo(field);
    });
  });

  form.addEventListener("submit", function (e): void {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.removeAttribute("role");

    const datos: ContactForm = {
      nombre: nombreInput.value,
      email: emailInput.value,
      mensaje: mensajeInput.value
    };

    const errores = validarFormulario(datos);
    mostrarFeedback(errores);

    form.querySelectorAll("input, textarea").forEach(function (el): void {
      if (!isValidatableField(el)) return;
      validarCampo(el);
    });

    if (errores.length > 0) {
      const firstInvalid = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    formStatus.setAttribute("role", "alert");
    formStatus.textContent = "¡Mensaje enviado! Nos pondremos en contacto contigo pronto.";
    form.reset();
    form.querySelectorAll("input, textarea").forEach(function (el): void {
      el.removeAttribute("aria-invalid");
    });
  });
})();
