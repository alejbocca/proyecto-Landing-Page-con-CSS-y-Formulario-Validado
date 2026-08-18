"use strict";
(function () {
    "use strict";
    const form = document.getElementById("inscripcion-form");
    const formStatus = document.getElementById("form-status");
    if (!form || !formStatus)
        return;
    function preselectPrograma() {
        const params = new URLSearchParams(window.location.search);
        const programa = params.get("programa");
        if (!programa)
            return;
        const select = document.getElementById("programa");
        if (!(select instanceof HTMLSelectElement))
            return;
        const hasOption = Array.from(select.options).some(function (option) {
            return option.value === programa;
        });
        if (hasOption)
            select.value = programa;
    }
    preselectPrograma();
    const validators = {
        nombre: function (v) {
            if (!v.trim())
                return "El nombre es obligatorio.";
            if (v.trim().length < 2)
                return "Ingresa al menos 2 caracteres.";
            return "";
        },
        email: function (v) {
            if (!v.trim())
                return "El correo electrónico es obligatorio.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                return "Ingresa un correo electrónico válido.";
            return "";
        },
        whatsapp: function (v) {
            if (!v.trim())
                return "El número de WhatsApp es obligatorio.";
            if (!/^[0-9+\s\-()]{8,20}$/.test(v))
                return "Ingresa un número válido con código de país.";
            return "";
        },
        programa: function (v) {
            if (!v)
                return "Selecciona un programa.";
            return "";
        }
    };
    function isFieldName(name) {
        return Object.prototype.hasOwnProperty.call(validators, name);
    }
    function isValidatableField(el) {
        return el instanceof HTMLInputElement || el instanceof HTMLSelectElement;
    }
    function validateField(field) {
        if (!isFieldName(field.name))
            return true;
        const errorEl = document.getElementById(field.id + "-error");
        const msg = validators[field.name](field.value);
        if (errorEl)
            errorEl.textContent = msg;
        field.setAttribute("aria-invalid", msg ? "true" : "false");
        return !msg;
    }
    form.querySelectorAll("input, select").forEach(function (el) {
        if (!isValidatableField(el))
            return;
        const field = el;
        field.addEventListener("blur", function () {
            validateField(field);
        });
        field.addEventListener("input", function () {
            if (field.getAttribute("aria-invalid") === "true")
                validateField(field);
        });
        field.addEventListener("change", function () {
            if (field.getAttribute("aria-invalid") === "true")
                validateField(field);
        });
    });
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        formStatus.textContent = "";
        formStatus.removeAttribute("role");
        let valid = true;
        form.querySelectorAll("input[required], select[required]").forEach(function (el) {
            if (!isValidatableField(el))
                return;
            if (!validateField(el))
                valid = false;
        });
        if (!valid) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid)
                firstInvalid.focus();
            return;
        }
        formStatus.setAttribute("role", "alert");
        formStatus.textContent = "¡Inscripción recibida! Un asesor se pondrá en contacto contigo pronto.";
        form.reset();
        form.querySelectorAll("input, select").forEach(function (el) {
            el.removeAttribute("aria-invalid");
        });
    });
})();
