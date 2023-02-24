const flagModal = new bootstrap.Modal(document.getElementById("flag"), {});
const gameOverModal = new bootstrap.Modal(
  document.getElementById("gameOver"),
  {}
);

const options = [
  {
    id: 0,
    name: "Create",
    hint:
      "It includes the newly created data and data that is being freshly imported from other data sources.",
  },
  {
    id: 1,
    name: "Store",
    hint: "Data is processed based on its form (structured or unstructured).",
  },
  { id: 2, name: "Use", hint: "Encrypted data is decrypted in this stage for optimal usage." },
  { id: 3, name: "Share", hint: "Data is shared within or outside the cloud infra." },
  {
    id: 4,
    name: "Archive",
    hint: "Long term storage of data and applications.",
  },
  {
    id: 5,
    name: "Destroy",
    hint: "Undesired data is shredded/removed.",
  },
];

let seconds = 120;
let finish = false;
let lose = false;

const selectStep = (question, answer) => {
  if (question !== answer) {
    $(".current").addClass("wrong");
    return;
  }

  // mark as correct
  $(".current").addClass("correct");
  $(".current").removeClass("wrong current");
  $(`#dropdown-${question}`).remove();
  $(`#step-${question}`).removeClass("hidden");
  $(`#step-${question}`).text(options[question].name);

  if (question === 5) {
    // last question
    if (lose) return;
    const flag = atob("VEhNe0NMT1VEXzExMTAxfQ==");
    $("#flag-text").text(flag);
    flagModal.toggle();
    finish = true;
    return;
  }

  // change step
  $(".disabled")
    .slice(0, 4)
    .addClass("current");
  $(".disabled")
    .slice(0, 4)
    .removeClass("disabled");
};

const createToggle = (id, cls) => {
  const itemClass =
    "dropdown-item text-white cursor-pointer hover:rounded hover:transition hover:ease-in hover:duration-300";
  let content = `<div class="dropdown mb-3" id="dropdown-${id}">
    <button class="btn neutral text-white w-100 dropdown-toggle ${cls}"
      type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Select Step
    </button>
    <ul class="dropdown-menu w-100 neutral text-white py-0">`;
  const items = [...options].sort(() => Math.random() - 0.5);
  content += items
    .map(option => {
      return `<li><p class="${itemClass}" onClick="selectStep(${id},${option.id})">${option.name}</p></li>`;
    })
    .join("");
  content += `</ul></div>`;

  return content;
};

const createTemplate = (index, ping = true) => {
  const item = options[index];
  const status = index === 0 ? "current" : "disabled";
  const className = `${ping ? "" : "flex-row-reverse"}`;
  return `
    <div class="relative flex justify-between ${className} items-center w-full">
      <div class="order-1 w-5/12"></div>
      <div class="border-2-2 left-1/2 absolute border-opacity-20 h-full border ${status}"></div>
      <div class="circle z-20 flex items-center order-1 bg-gray-500 shadow-xl w-8 h-8 rounded-full ${status} 
      flex items-center justify-center">
        <h1 class="mx-auto font-semibold text-lg text-white">${index + 1}</h1>
      </div>
      <div class="template order-1 rounded-lg shadow-xl w-5/12 px-6 py-4 ${status}">
        ${createToggle(index, status)}
        <h3 
          class="mb-3 font-bold text-gray-800 text-xl hidden" 
          id="step-${index}">${item.name}</h3>
        <p class="leading-snug tracking-wide text-gray-900 text-opacity-100">
        ${item.hint}
        </p>
      </div>
    </div>`;
};

$(function() {
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map(t => new bootstrap.Tooltip(t));

  const content = $("#content");
  const templates = options
    .map((option, index) => createTemplate(index, (index + 1) % 2 !== 0))
    .join("");
  content.append(templates);
});

const copyText = (label = "flag-text", container = "flag-container") => {
  const text = $(`#${label}`).text();
  navigator.clipboard.writeText(text);

  const tooltip = bootstrap.Tooltip.getInstance(`#${container}`);
  tooltip.setContent({ ".tooltip-inner": "Copied!" });
  setTimeout(() => {
    tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
  }, 2000);
};

setInterval(function() {
  if (finish || lose) return;

  if (seconds > 0) {
    seconds = seconds - 1;
    if (seconds <= 10) {
      $("#clock").addClass("text-danger");
    }
    $("#timer").text(`${seconds}s`);
    return;
  }

  $("#timer").text("Time Up!");
  if (seconds == 0) {
    gameOverModal.toggle();
    lose = true;
  }
}, 1000);
