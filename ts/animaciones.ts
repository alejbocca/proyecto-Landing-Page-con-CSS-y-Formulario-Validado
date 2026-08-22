function esHTMLElement(el: Element | null): el is HTMLElement {
    return el !== null && el instanceof HTMLElement;
  }

  function resaltarNavActivo(): void {
    const rutaActual = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav a").forEach(function (link): void {
      if (!esHTMLElement(link)) return;
      if (link.getAttribute("href") === rutaActual) {
        link.classList.add("active");
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", resaltarNavActivo);