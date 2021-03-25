export const replaceAllSymbols = (input) => {
  input = input
    .replace(/Й/gi, "Q")
    .replace(/Ц/gi, "W")
    .replace(/У/gi, "E")
    .replace(/К/gi, "R")
    .replace(/Е/gi, "T")
    .replace(/Н/gi, "Y")
    .replace(/Г/gi, "U")
    .replace(/Ш/gi, "I")
    .replace(/Щ/gi, "O")
    .replace(/З/gi, "P")
    .replace(/Ф/gi, "A")
    .replace(/Ы/gi, "S")
    .replace(/В/gi, "D")
    .replace(/А/gi, "F")
    .replace(/П/gi, "G")
    .replace(/Р/gi, "H")
    .replace(/О/gi, "J")
    .replace(/Л/gi, "K")
    .replace(/Д/gi, "L")
    .replace(/Я/gi, "Z")
    .replace(/Ч/gi, "X")
    .replace(/С/gi, "C")
    .replace(/М/gi, "V")
    .replace(/И/gi, "B")
    .replace(/Т/gi, "N")
    .replace(/Ь/gi, "M");
  return input;
};

export const isAllowed = (input) => {
  return /^[\x00-\x7F]*$/.test(input);
};
