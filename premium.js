(() => {
  const links = [
    ["HOME","index.html"],
    ["TRAINING","training.html"],
    ["3D STUDIO","3d-studio.html"],
    ["SESSIONS","session-library.html"],
    ["PLAYER","player.html"],
    ["LOG","training-log.html"],
    ["RECOVERY","recovery.html"],
    ["GALLERY","gallery.html"]
  ];

  const current = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.className = "premium-nav";
  nav.setAttribute("aria-label","Main navigation");

  nav.innerHTML =
    '<a class="nav-brand" href="index.html">SHANU OS</a>' +
    links.map(([name,url]) =>
      `<a href="${url}" class="${current===url?'active':''}">${name}</a>`
    ).join("");

  const header = document.querySelector("header");
  if(header) header.insertAdjacentElement("afterend",nav);
  else document.body.prepend(nav);
})();
