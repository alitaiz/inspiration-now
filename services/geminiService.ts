import type { InspirationData } from "../types";
import { localQuotes } from "../data/quotes";

let lastQuoteIndex = -1;

// Base URLs for external services
const IMAGE_BASE_URL = "https://picsum.photos/800/1200";

// Fallback data in case of API failures - Corrected URL
const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80";

/**
 * Fetches a random image from Picsum Photos and pairs it with a local quote.
 * This function is designed to be resilient. If the image fetch fails, it uses a fallback image.
 * @returns A Promise that resolves to an InspirationData object.
 */
export const fetchNewInspiration = async (): Promise<InspirationData> => {
  // 1. Get a random local quote, ensuring it's not the same as the last one.
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * localQuotes.length);
  } while (localQuotes.length > 1 && randomIndex === lastQuoteIndex);
  lastQuoteIndex = randomIndex;
  const { quote, author } = localQuotes[randomIndex];

  // 2. Try to fetch a new random image.
  try {
    const imageResponse = await fetch(IMAGE_BASE_URL, { cache: "no-cache" });
    if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBlob = await imageResponse.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    return { quote, author, imageUrl };
  } catch (error) {
    // 3. If fetch fails, return the quote with a safe fallback image.
    console.warn("Could not fetch new random image, using fallback.", error);
    return {
        quote,
        author,
        imageUrl: FALLBACK_IMAGE_URL,
    };
  }
};