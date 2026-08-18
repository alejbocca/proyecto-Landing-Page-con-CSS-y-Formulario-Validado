"use strict";
(function () {
    "use strict";
    function esEmailValido(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }
    const validadoresPorCampo = {
        nombre: function (valor) {
            return valor.trim().length === 0 ? "El nombre es requerido" : "";
        },
        email: function (valor) {
            return !esEmailValido(valor) ? "Email inválido" : "";
        },
        mensaje: function (valor) {
            return valor.trim().length < 10 ? "El mensaje es muy corto" : "";
        }
    };
    function validarFormulario(datos) {
        const errores = [];
        Object.keys(validadoresPorCampo).forEach(function (campo) {
            const mensaje = validadoresPorCampo[campo](datos[campo]);
            if (mensaje)
                errores.push(mensaje);
        });
        return errores;
    }
    const form = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const mensajeInput = document.getElementById("mensaje");
    if (!form || !formStatus || !nombreInput || !emailInput || !mensajeInput)
        return;
    function isContactField(name) {
        return Object.prototype.hasOwnProperty.call(validadoresPorCampo, name);
    }
    function isValidatableField(el) {
        return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    }
    function esHTMLElement(el) {
        return el instanceof HTMLElement;
    }
    function mostrarFeedback(errores) {
        const caja = document.querySelector(".form-feedback");
        if (!esHTMLElement(caja))
            return;
        caja.classList.remove("error", "exito");
        caja.classList.add(errores.length > 0 ? "error" : "exito");
        caja.textContent = errores.length > 0 ? errores.join(", ") : "¡Mensaje enviado!";
    }
    function validarCampo(field) {
        if (!isContactField(field.name))
            return true;
        const errorEl = document.getElementById(field.id + "-error");
        const msg = validadoresPorCampo[field.name](field.value);
        if (errorEl)
            errorEl.textContent = msg;
        field.setAttribute("aria-invalid", msg ? "true" : "false");
        return !msg;
    }
    form.querySelectorAll("input, textarea").forEach(function (el) {
        if (!isValidatableField(el))
            return;
        const field = el;
        field.addEventListener("blur", function () {
            validarCampo(field);
        });
        field.addEventListener("input", function () {
            if (field.getAttribute("aria-invalid") === "true")
                validarCampo(field);
        });
    });
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        formStatus.textContent = "";
        formStatus.removeAttribute("role");
        const datos = {
            nombre: nombreInput.value,
            email: emailInput.value,
            mensaje: mensajeInput.value
        };
        const errores = validarFormulario(datos);
        mostrarFeedback(errores);
        form.querySelectorAll("input, textarea").forEach(function (el) {
            if (!isValidatableField(el))
                return;
            validarCampo(el);
        });
        if (errores.length > 0) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid)
                firstInvalid.focus();
            return;
        }
        formStatus.setAttribute("role", "alert");
        formStatus.textContent = "¡Mensaje enviado! Nos pondremos en contacto contigo pronto.";
        form.reset();
        form.querySelectorAll("input, textarea").forEach(function (el) {
            el.removeAttribute("aria-invalid");
        });
    });
})();
