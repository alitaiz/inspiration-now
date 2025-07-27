import type { InspirationData } from "../types.ts";
import { localQuotes } from "../data/quotes.ts";
import { localImages } from "../data/images.ts";

/**
 * Fetches a new inspiration, consisting of a quote and a background image.
 * The image is fetched from Picsum Photos, with a local fallback if the fetch fails.
 * @returns A promise that resolves to an InspirationData object.
 */
export const fetchNewInspiration = async (): Promise<InspirationData> => {
  // Get a random quote from the local array
  const randomQuoteIndex = Math.floor(Math.random() * localQuotes.length);
  const { quote, author } = localQuotes[randomQuoteIndex];

  let imageUrl: string;

  try {
    // Fetch a random image from Picsum Photos.
    // The dimensions 800x1280 match the card's aspect ratio.
    // A random parameter is added to prevent the browser from caching the image request.
    const response = await fetch(`https://picsum.photos/800/1280?random=${Math.random()}`);
    if (!response.ok) {
        // If the response is not ok (e.g., 404, 500), throw an error to trigger the catch block.
        throw new Error(`Picsum Photos request failed with status ${response.status}`);
    }
    // The final URL after any redirects is the actual image URL we want to use.
    imageUrl = response.url;
  } catch (error) {
    console.warn("Failed to fetch image from Picsum Photos, using local fallback:", error);
    // Fallback to a random local image if the fetch fails.
    const randomImageIndex = Math.floor(Math.random() * localImages.length);
    imageUrl = localImages[randomImageIndex];
  }

  return {
    quote,
    author,
    imageUrl,
  };
};
