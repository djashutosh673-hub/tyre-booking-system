const vehicles = [
  "Alto", "Audi", "Activa", "Apache",
  "Baleno", "BMW", "Bullet",
  "Creta", "Ciaz",
  "Duke", "Duster"
];

const input = document.getElementById("vehicleSearch");
const suggestions = document.getElementById("suggestions");

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!value) {
    suggestions.style.display = "none";
    return;
  }

  const filtered = vehicles.filter(v =>
    v.toLowerCase().startsWith(value)
  );

  filtered.forEach(v => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.innerText = v;

    div.onclick = () => {
      window.location.href = `/shop?vehicle=${v}`;
    };
suggestions.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion-item")) {
    const selectedVehicle = e.target.innerText;

    // 🔥 redirect with vehicle
    window.location.href = `/shop?vehicle=${selectedVehicle}`;
  }
});
    suggestions.appendChild(div);
  });

  suggestions.style.display = "block";
});

/* 👇 PASTE HERE (BOTTOM) */
document.addEventListener("click", (e) => {
  if (!document.querySelector(".search-container").contains(e.target)) {
    suggestions.style.display = "none";
  }
});