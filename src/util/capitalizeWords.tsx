export function capitalizeWords(sentence: string) {
  return sentence
    .split(" ") // Split the sentence into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}
