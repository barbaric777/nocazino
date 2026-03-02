const symbols = ["🍏", "🥭", "🍇", "🍐", "🍓", "🍋"];
let balance = parseInt(localStorage.getItem("userBalance")) || 0;

const btn = document.getElementById("spin-btn");
const balanceText = document.getElementById("balance");
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
];
const message = document.getElementById("message");

updateUI();

btn.addEventListener("click", () => {
  if (balance < 10) return alert("Недостаточно средств!");

  balance -= 10;
  updateUI();
  btn.disabled = true;
  message.innerText = "Удачи...";

  let results = [];

  reels.forEach((reel, i) => {
    // Создаем длинный список символов для эффекта прокрутки
    const container =
      reel.querySelector(".symbol-container") || document.createElement("div");
    container.className = "symbol-container";
    container.style.transition = "none"; // Сброс анимации
    container.style.transform = "translateY(0)";

    // Генерируем случайный набор символов (например, 20 штук)
    let strip = "";
    for (let j = 0; j < 20; j++) {
      strip += `<div class="symbol">${symbols[Math.floor(Math.random() * symbols.length)]}</div>`;
    }

    // Финальный символ (тот, что выпадет)
    const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    strip += `<div class="symbol">${winSymbol}</div>`;
    results[i] = winSymbol;

    container.innerHTML = strip;
    reel.appendChild(container);

    // Запускаем анимацию с задержкой, чтобы браузер успел отрисовать сброс
    setTimeout(() => {
      container.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.1, 0, 0.1, 1)`;
      const height = reel.clientHeight;
      container.style.transform = `translateY(-${(container.children.length - 1) * height}px)`;
    }, 50);
  });

  // Ждем окончания самой долгой анимации (2.0 + 2*0.5 = 3 сек)
  setTimeout(() => {
    checkWin(results);
    btn.disabled = false;
  }, 3100);
});

function checkWin(res) {
  if (res[0] === res[1] && res[1] === res[2]) {
    let prize = 100;
    balance += prize;
    message.innerText = `ВЫИГРЫШ: +${prize} ₽!`;
  } else {
    message.innerText = "Попробуй еще раз";
  }
  updateUI();
}

function updateUI() {
  balanceText.innerText = balance;
  localStorage.setItem("userBalance", balance);
}

