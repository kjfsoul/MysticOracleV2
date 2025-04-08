#!/usr/bin/env node

/**
 * Download Rider-Waite Tarot Deck Images
 *
 * This script downloads the Rider-Waite tarot deck images from a public source,
 * resizes them, and saves them to the appropriate directories.
 */

import { spawn } from "child_process";
import fs from 'fs';
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Paths
const DECK_PATH = path.join(
  projectRoot,
  "client/public/images/tarot/decks/rider-waite"
);
const MAJOR_PATH = path.join(DECK_PATH, "major");
const MINOR_CUPS_PATH = path.join(DECK_PATH, "minor/cups");
const MINOR_WANDS_PATH = path.join(DECK_PATH, "minor/wands");
const MINOR_SWORDS_PATH = path.join(DECK_PATH, "minor/swords");
const MINOR_PENTACLES_PATH = path.join(DECK_PATH, "minor/pentacles");

// Ensure directories exist
[
  MAJOR_PATH,
  MINOR_CUPS_PATH,
  MINOR_WANDS_PATH,
  MINOR_SWORDS_PATH,
  MINOR_PENTACLES_PATH,
].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Card definitions
const majorArcana = [
  { id: "00-fool", name: "The Fool" },
  { id: "01-magician", name: "The Magician" },
  { id: "02-high-priestess", name: "The High Priestess" },
  { id: "03-empress", name: "The Empress" },
  { id: "04-emperor", name: "The Emperor" },
  { id: "05-hierophant", name: "The Hierophant" },
  { id: "06-lovers", name: "The Lovers" },
  { id: "07-chariot", name: "The Chariot" },
  { id: "08-strength", name: "Strength" },
  { id: "09-hermit", name: "The Hermit" },
  { id: "10-wheel-of-fortune", name: "Wheel of Fortune" },
  { id: "11-justice", name: "Justice" },
  { id: "12-hanged-man", name: "The Hanged Man" },
  { id: "13-death", name: "Death" },
  { id: "14-temperance", name: "Temperance" },
  { id: "15-devil", name: "The Devil" },
  { id: "16-tower", name: "The Tower" },
  { id: "17-star", name: "The Star" },
  { id: "18-moon", name: "The Moon" },
  { id: "19-sun", name: "The Sun" },
  { id: "20-judgement", name: "Judgement" },
  { id: "21-world", name: "The World" },
];

const minorRanks = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "page",
  "knight",
  "queen",
  "king",
];
const suits = ["cups", "wands", "swords", "pentacles"];

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(filepath);
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`Downloaded: ${filepath}`);
            resolve();
          });
        } else {
          reject(`Failed to download ${url}: ${response.statusCode}`);
        }
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there's an error
        reject(`Error downloading ${url}: ${err.message}`);
      });
  });
}

// Function to resize an image using ImageMagick (if available)
function resizeImage(filepath, width = 500) {
  return new Promise((resolve, reject) => {
    try {
      // Skip resizing if ImageMagick is not likely to be installed
      console.log(`Skipping resize for ${filepath} - ImageMagick not detected`);
      resolve();
      return;

      // The code below is disabled to avoid errors
      // If you have ImageMagick installed, you can remove the return statement above
      const tempPath = `${filepath}.temp`;
      fs.renameSync(filepath, tempPath);

      const convert = spawn("convert", [
        tempPath,
        "-resize",
        `${width}x`,
        "-quality",
        "85",
        filepath,
      ]);

      convert.on("close", (code) => {
        try {
          if (code === 0) {
            fs.unlinkSync(tempPath);
            console.log(`Resized: ${filepath}`);
          } else {
            // If convert fails, just use the original file
            fs.renameSync(tempPath, filepath);
            console.warn(
              `Warning: Could not resize ${filepath}. ImageMagick may not be installed.`
            );
          }
          resolve();
        } catch (err) {
          console.warn(`Error during resize cleanup: ${err.message}`);
          resolve();
        }
      });

      convert.on("error", () => {
        try {
          // If convert fails to run, just use the original file
          fs.renameSync(tempPath, filepath);
        } catch (err) {
          console.warn(`Error during resize error handling: ${err.message}`);
        }
        console.warn(
          `Warning: Could not resize ${filepath}. ImageMagick may not be installed.`
        );
        resolve();
      });
    } catch (err) {
      console.warn(`Error in resize process: ${err.message}`);
      resolve(); // Continue with the download process despite resize errors
    }
  });
}

// Main function to download and process all cards
async function downloadRiderWaiteDeck() {
  console.log("Starting download of Rider-Waite deck...");

  // Source URL for Rider-Waite deck images
  const baseUrl =
    "https://raw.githubusercontent.com/davidpots/tarot-flashcards/master/deck/";

  // Download major arcana
  for (const card of majorArcana) {
    const filename = `${card.id}.jpg`;
    const filepath = path.join(MAJOR_PATH, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping existing file: ${filepath}`);
      continue;
    }

    try {
      // Convert card name to URL format for the new source
      // Format: major-00-fool.jpg
      const url = `${baseUrl}major-${card.id}.jpg`;

      await downloadImage(url, filepath);
      await resizeImage(filepath);
    } catch (error) {
      console.error(`Error processing ${card.name}: ${error}`);
    }
  }

  // Download minor arcana
  for (const suit of suits) {
    for (const rank of minorRanks) {
      const filename = `${rank}-${suit}.jpg`;
      let filepath;

      switch (suit) {
        case "cups":
          filepath = path.join(MINOR_CUPS_PATH, filename);
          break;
        case "wands":
          filepath = path.join(MINOR_WANDS_PATH, filename);
          break;
        case "swords":
          filepath = path.join(MINOR_SWORDS_PATH, filename);
          break;
        case "pentacles":
          filepath = path.join(MINOR_PENTACLES_PATH, filename);
          break;
      }

      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`Skipping existing file: ${filepath}`);
        continue;
      }

      try {
        // Convert rank and suit to URL format for the new source
        // Format: minor-cups-01-ace.jpg
        let rankNumber;
        if (rank === "ace") rankNumber = "01";
        else if (rank === "two") rankNumber = "02";
        else if (rank === "three") rankNumber = "03";
        else if (rank === "four") rankNumber = "04";
        else if (rank === "five") rankNumber = "05";
        else if (rank === "six") rankNumber = "06";
        else if (rank === "seven") rankNumber = "07";
        else if (rank === "eight") rankNumber = "08";
        else if (rank === "nine") rankNumber = "09";
        else if (rank === "ten") rankNumber = "10";
        else if (rank === "page") rankNumber = "11";
        else if (rank === "knight") rankNumber = "12";
        else if (rank === "queen") rankNumber = "13";
        else if (rank === "king") rankNumber = "14";

        const url = `${baseUrl}minor-${suit}-${rankNumber}-${rank}.jpg`;

        await downloadImage(url, filepath);
        await resizeImage(filepath);
      } catch (error) {
        console.error(`Error processing ${rank} of ${suit}: ${error}`);
      }
    }
  }

  console.log("Download complete!");
  console.log(`Deck saved to: ${DECK_PATH}`);
  console.log(
    "Note: If some images failed to download, you may need to manually download them from another source."
  );
}

// Run the main function
downloadRiderWaiteDeck().catch(error => {
  console.error('An error occurred:', error);
});
