// Transforme un texte en fragment avec <a> si nécessaire
// function createLinksFromText(text, links, existingHrefs) {
//   let fragment = document.createDocumentFragment();
//   let remainingText = text;

//   while (remainingText.length > 0) {
//     let foundMatch = false;

//     for (const link of links) {
//       const href = link === "index" ? "/" : "/" + link;
//       const regex = new RegExp(`\\b${link}\\b`, "iu");

//       const match = remainingText.match(regex);
//       if (match) {
//         const matchIndex = match.index;
//         const foundWord = match[0];

//         if (matchIndex > 0) {
//           fragment.appendChild(document.createTextNode(remainingText.slice(0, matchIndex)));
//         }

//         if (!existingHrefs.some(hrefExist => hrefExist.toLowerCase() === href.toLowerCase())) {
//           const linkElement = document.createElement("a");
//           linkElement.href = href;
//           linkElement.textContent = foundWord;
//           fragment.appendChild(linkElement);
//         } else {
//           fragment.appendChild(document.createTextNode(foundWord));
//         }

//         remainingText = remainingText.slice(matchIndex + foundWord.length);
//         foundMatch = true;
//         break;
//       }
//     }

//     if (!foundMatch) {
//       fragment.appendChild(document.createTextNode(remainingText));
//       break;
//     }
//   }

//   return fragment;
// }
function createLinksFromText(text, links, existingHrefs) {
  const fragment = document.createDocumentFragment();

  if (!links.length) {
    fragment.appendChild(document.createTextNode(text));
    return fragment;
  }

  // Trier les mots par longueur décroissante pour matcher les plus longs d'abord
  links.sort((a, b) => b.length - a.length);

  // Construire une regex globale pour tous les mots
  const regex = new RegExp(`\\b(${links.join("|")})\\b`, "giu");

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchedWord = match[0];
    const startIndex = match.index;

    // Ajouter le texte avant le mot matché
    if (startIndex > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, startIndex)));
    }

    const href = matchedWord.toLowerCase() === "index" ? "/" : "/" + matchedWord.toLowerCase();

    // Ajouter le lien si non existant
    if (!existingHrefs.some(h => h.toLowerCase() === href)) {
      const linkElement = document.createElement("a");
      linkElement.href = href;
      linkElement.textContent = matchedWord;
      fragment.appendChild(linkElement);
    } else {
      fragment.appendChild(document.createTextNode(matchedWord));
    }

    lastIndex = startIndex + matchedWord.length;
  }

  // Ajouter le reste du texte après le dernier match
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  return fragment;
}



// Parcours récursif des nœuds du <pre>
function browseNodes(node, currentPathname, links, existingHrefs) {
  if (node.nodeType === Node.TEXT_NODE) {
    const textContent = node.textContent;
    const pathnameRegex = new RegExp(`\\b${currentPathname}\\b`, "iu");

    if (currentPathname && !node.parentNode.closest("a") && pathnameRegex.test(textContent)) {
      const textParts = textContent.split(pathnameRegex);
      for (let i = 0; i < textParts.length; i++) {
        if (textParts[i]) {
          node.parentNode.insertBefore(createLinksFromText(textParts[i], links, existingHrefs), node);
        }
        if (i < textParts.length - 1) {
          const italicElement = document.createElement("i");
          italicElement.textContent = currentPathname;
          node.parentNode.insertBefore(italicElement, node);
        }
      }
      node.parentNode.removeChild(node);
    } else {
      node.parentNode.replaceChild(createLinksFromText(textContent, links, existingHrefs), node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName !== "A" && node.tagName !== "I") {
      Array.from(node.childNodes).forEach(childNode =>
        browseNodes(childNode, currentPathname, links, existingHrefs)
      );
    }
  }
}


// Fonction principale
function linkifyPreElement(preElement, currentPathname, links) {
  console.log(links)
  if (!preElement) return;

  const preTextContent = preElement.textContent;

  // Extraire tous les mots avec accents
  const wordsInText = preTextContent.match(/[\p{L}-]+/gu) || [];

  // Récupération des href existants
  const existingHrefs = Array.from(preElement.querySelectorAll("a")).map(a =>
    a.getAttribute("href")
  );

  // Filtrage / normalisation des liens
  const linksSet = new Set(links.map(l => l.toLowerCase()));
  links = wordsInText
    .map(word => word.toLowerCase())
    .filter(word => word !== currentPathname.toLowerCase())
    .filter(word => linksSet.has(word));

  // Supprimer doublons + ajouter "index"
  links = Array.from(new Set([...links, "index"]));

  // Trier par longueur décroissante
  links.sort((a, b) => b.length - a.length);

  // Transformer récursivement
  browseNodes(preElement, currentPathname, links, existingHrefs);
}

// --- Gestion du toggle ---
export function initToggleClosed() {
  document.querySelectorAll("p, pre").forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("closed");
    });
  });
}


// --- Analyse des <pre> ---
export function analyzePreElements() {
  document.querySelectorAll("pre").forEach(el => {
    const str = el.textContent.toLowerCase().replace(/\s+/g, "");
    const symbols = Array.from(str);
    console.log(str)

    console.log(el.textContent, formula(str));

    const counted = countOddLetters(symbols);
    console.log(counted);

    const extraSymbols = counted.map(obj => obj.sign);
    console.log(extraSymbols.join(""));
  });
}


// --- Lien automatique dans <pre> ---
export function initPreLinkification() {
  const currentPathname = decodeURI(window.location.pathname.replace("/", ""));
  const preElement = document.querySelector("pre");

  let links = JSON.parse(
    document.querySelector("script[data-links]")?.getAttribute("data-links") || "[]"
  ).map(link => link.replace("/", ""));

  linkifyPreElement(preElement, currentPathname, links);
}


// Retourne la "formule brute" d'un mot. Exemple : "toupie" -> "e¹i¹o¹p¹t¹u¹"
const superscript = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
}

const formula = (word) => {
  let f = ''
  Object.entries(countAllLetters(Array.from(word))).forEach(([k, v]) => {
    const vStr = String(v).split('').map(d => superscript[d] || d).join('')
    f += `${k}${vStr}`
  })
  return f
}

// Compte les lettres et retourne un objet trié
const countAllLetters = (letters) => {
  const result = {}
  letters.forEach((elem) => {
    result[elem] = (result[elem] || 0) + 1
  })
  return ordered(result)
}

// Trie : lettres normales d'abord, puis les lettres avec accent, puis le reste
const ordered = (unordered) => {
  return Object.keys(unordered)
    .sort((a, b) => {
      const isLetter = (c) => c.toLowerCase() !== c.toUpperCase()
      const aHasAccent = a.normalize("NFD").length > 1 && isLetter(a)
      const bHasAccent = b.normalize("NFD").length > 1 && isLetter(b)
      const aIsPlain = isLetter(a) && !aHasAccent
      const bIsPlain = isLetter(b) && !bHasAccent

      // lettres normales d'abord
      if (aIsPlain && !bIsPlain) return -1
      if (!aIsPlain && bIsPlain) return 1

      // lettres accentuées ensuite
      if (aHasAccent && !bHasAccent) return -1
      if (!aHasAccent && bHasAccent) return 1

      // le reste à la fin
      return a.localeCompare(b, 'fr')
    })
    .reduce((obj, key) => {
      obj[key] = unordered[key]
      return obj
    }, {})
}

// Count characters with odd occurrences
function countOddLetters(tab) {
  const result = {};
  const sortedResult = [];

  tab.forEach(elem => {
    result[elem] = (result[elem] || 0) + 1;
  });

  for (const [key, value] of Object.entries(result)) {
    if (value % 2 !== 0) {
      sortedResult.push({ sign: key, count: value });
    }
  }

  return sortedResult;
}

// Generate random string from characters in str
function aleatoire(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  console.log(result);
  return result;
}

// Capitalize first letter
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Reverse string (recursive)
function reverseString(str) {
  return str === '' ? '' : reverseString(str.substr(1)) + str.charAt(0);
}

// Shuffle array
function shuffleArray(arr) {
  return arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);
}

