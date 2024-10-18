const galeryid = document.getElementById("galery");
const search = document.getElementById("search");
const editor = document.getElementById("markdown");
const preview = document.getElementById("preview");
let show_edit = true;
let show_galery = false;

function MKFunc(markdown) {
  // Alinha elementos no centro
  markdown = markdown.replace(/××(.*?)××/gim, "<center>$1</center>");

  // Pie
  markdown = markdown.replace(/%(\d+)%/gim, '<div id="pie" class="pie" style="--p:$1;"><p style="color: var(--color-p); z-index:1; -webkit-text-stroke-color: var(--color-y); -webkit-text-stroke-width: 1.5px;">$1%</p></div>');

  return markdown.trim();
}

editor.addEventListener("input", () => {
  const markdownText = editor.value;
  preview.innerHTML = marked.parse(MKFunc(markdownText));
});

function edit() {
  if (!show_galery) {
    show_edit = !show_edit;
  }
  if (show_edit && !show_galery) {
    editor.style.display = "block"; // Mostra o editor
  } else {
    editor.style.display = "none"; // Oculta o editor
  }
  if (show_galery) {
    galeryid.style.display = "none"; // Oculta o galeria
    editor.style.display = "none"; // Oculta o editor
    preview.style.display = "block"; // Mostra o preview
    show_galery = false;
    show_edit = false;
  }
}

function galery() {
  show_galery = !show_galery;
  if (show_galery) {
    galeryid.style.display = "block"; // Mostra a galeria
    editor.style.display = "none"; // Oculta o editor
    preview.style.display = "none"; // Oculta o preview
    show_edit = false;
  } else {
    galeryid.style.display = "none"; // Oculta o galeria
    editor.style.display = "none"; // Oculta o editor
    preview.style.display = "block"; // Mostra o preview
    show_edit = false;
  }
}

function updatePreview() {
  const markdownText = editor.value;
  preview.innerHTML = marked.parse(MKFunc(markdownText));
  document.getElementById("card").innerHTML = marked.parse(MKFunc(markdownText));
  console.log(marked.parse(MKFunc(markdownText)));
  hljs.highlightAll();
}

function loadContent() {
  const savedContent = localStorage.getItem("markdownContent");
  if (savedContent) {
    editor.value = savedContent;
    updatePreview();
  }
}

function saveContent() {
  const markdownText = editor.value;
  localStorage.setItem("markdownContent", markdownText);
}

editor.addEventListener("input", () => {
  saveContent();
  updatePreview();
});

window.addEventListener("load", loadContent);
window.addEventListener("load", hljs.highlightAll);
window.addEventListener("load", edit);
