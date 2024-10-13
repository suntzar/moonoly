const galeryid = document.getElementById("galery");
const search = document.getElementById("search");
const editor = document.getElementById("markdown");
const preview = document.getElementById("preview");
let show_edit = true;
let show_galery = false;

function markdownToHtml(markdown) {
  // Converte cabeçalhos
  markdown = markdown.replace(/^#### (.*$)/gim, "<h4>$1</h3>");
  markdown = markdown.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  markdown = markdown.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  markdown = markdown.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Converte negrito e itálico
  markdown = markdown.replace(/\*\*(.*)\*\*/gim, "<b>$1</b>");
  markdown = markdown.replace(/\*(.*)\*/gim, "<i>$1</i>");

  // Converte texto tachado
  markdown = markdown.replace(/~~(.*?)~~/gim, "<del>$1</del>");

  // Converte imagens
  markdown = markdown.replace(
    /!\[(.*?)\]\((.*?)\)/gim,
    '<img src="$2" alt="$1" class="mkmedia" />'
  );

  // Converte links
  markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Converte listas não ordenadas
  markdown = markdown.replace(/^\s*[-+*] (.*$)/gim, "<ul><li>$1</li></ul>");
  markdown = markdown.replace(/<\/ul>\s*<ul>/gim, "");

  // Converte listas ordenadas
  markdown = markdown.replace(/^\s*\d+\. (.*$)/gim, "<ol><li>$1</li></ol>");
  markdown = markdown.replace(/<\/ol>\s*<ol>/gim, "");

  // Converte listas aninhadas
  markdown = markdown.replace(/^\s*[-+*] (.*$)/gim, "<li>$1</li>");
  markdown = markdown.replace(/<\/li>\s*<li>/gim, "");

  // Converte blocos de código
  markdown = markdown.replace(/```([^`]+)```/gim, "<pre><code>$1</code></pre>");

  // Converte código inline
  markdown = markdown.replace(/`([^`]+)`/gim, "<code>$1</code>");

  // Converte citações
  markdown = markdown.replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>");

  // Converte tabelas
  markdown = markdown.replace(/^\|(.+)\|$/gim, "<tr><td>$1</td></tr>");
  markdown = markdown.replace(/<\/tr>\s*<tr>/gim, "");

  // Converte linhas horizontais
  markdown = markdown.replace(/^---$/gim, "<div class='hr'></div>");

  // Converte quebras de linha explícitas
  markdown = markdown.replace(/\\\\/gim, "<br />");

  // Converte quebras de linha padrões
  markdown = markdown.replace(/\n/gim, "<p/><p>");

  console.log(markdown.trim());
  return markdown.trim();
}

editor.addEventListener("input", () => {
  const markdownText = editor.value;
  preview.innerHTML = markdownToHtml(markdownText);
});

function edit() {
  show_edit = !show_edit;
  if (show_edit) {
    editor.style.display = "block"; // Mostra o editor
  } else {
    editor.style.display = "none"; // Oculta o editor
  }
}

function galery() {
  show_galery = !show_galery;
  if (show_galery) {
    galeryid.style.display = "block"; // Mostra o editor
    editor.style.display = "none"; // Mostra o editor
    preview.style.display = "none"; // Mostra o editor
  } else {
    galeryid.style.display = "none"; // Oculta o editor
    editor.style.display = "none"; // Oculta o editor
    preview.style.display = "block"; // Oculta o editor
  }
}

function updatePreview() {
  const markdownText = editor.value;
  preview.innerHTML = markdownToHtml(markdownText);
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

search.value = "derpixon";

search.addEventListener("input", () => {
  fetch(
    "https://api.rule34.xxx/index.php?page=dapi&json=1&s=post&q=index&tags=" +
      search.value.replace(/[\s,]/g, "+")
  )
    .then((response) => response.json())
    .then((data) => {
      let media = "";

      for (let i = 0; i < 3; i++) {
        let fileUrl = data[Math.floor(Math.random() * data.length)].file_url;
        let fileExtension = fileUrl.split(".").pop().toLowerCase();

        if (["mp4", "webm", "ogg"].includes(fileExtension)) {
          media += `<video class="mkmedia" controls>
                <source src="${data[i].file_url}" type="video/${fileExtension}">
              </video>\n`;
        } else {
          media += `<img class="mkmedia" src="${data[i].file_url}" />\n`;
        }
      }

      console.log(media);
      galeryid.innerHTML = media;
    });
});

window.addEventListener("load", loadContent);
window.addEventListener("load", edit);
