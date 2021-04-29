// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  const dimensions = getDimensions(canvas.width, canvas.height, img.width, img.height);

  // Clear canvas context
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fill canvas context with black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw uploaded image onto canvas
  ctx.drawImage(img, dimensions.startX, dimensions.startY);

  // Toggle buttons to default state
  const submit = document.querySelector('button[type=submit]');
  submit.disabled = false;
  const reset = document.querySelector('button[type=reset]');
  reset.disabled = true;
  const button = document.querySelector('button[type=button]');
  button.disabled = true;
});

const newImage = document.getElementById('image-input'); // used to add the uploaded image

// Fires when image is changed
newImage.addEventListener('change', () => {
  // Load uploaded image into img src
  const objectURL = URL.createObjectURL(newImage);
  img.src = objectURL;

  // Set img alt as object file name
  const imgName = objectURL.split('/').pop().split('.').slice(0, -1).join('.');
  img.alt = imgName;
});

const form = document.getElementById('generate-meme'); // used to add form text to image

// Fires when Generate button is clicked
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  const topText = form.elements[1].value;
  const bottomText = form.elements[2].value;

  // Add grabbed text to canvas
  ctx.fillText(topText, canvas.width / 2, 0);
  ctx.fillText(bottomText, canvas.width / 2, canvas.height);

  // Toggle buttons
  const submit = document.querySelector('button[type=submit]');
  submit.disabled = true;
  const reset = document.querySelector('button[type=reset]');
  reset.disabled = false;
  const button = document.querySelector('button[type=button]');
  button.disabled = false;
});

const reset = document.querySelector('button[type=reset]'); // used to clear the canvas

// Fires when clear button is clicked
reset.addEventListener('click', () => {
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');

  // Clear canvas and text
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Toggle buttons back to default state
  const submit = document.querySelector('button[type=submit]');
  submit.disabled = false;
  const reset = document.querySelector('button[type=reset]');
  reset.disabled = true;
  const button = document.querySelector('button[type=button]');
  button.disabled = true;
});

const button = document.querySelector('button[type=button]'); // used to read text aloud

// Fires when Read Text button is clicked
button.addEventListener('click', () => {
  const topText = form.elements[1].value;
  const bottomText = form.elements[2].value;
  const utterance = new SpeechSynthesisUtterance(topText + ' ' + bottomText);

  // Speak the text added to the canvas
  speechSynthesis.speak(utterance);
});

const volume = document.querySelector('input[type=range]'); // used by volume slider action

// Fires when volume slider is updated
volume.addEventListener('input', () => {
  // Update volume level
  const volumeLevel = volume.value;
  const volumeImg = document.querySelector('#volume-group img');

  // Update speaker image according to new volume level
  if (volumeLevel >= 67) {
    volumeImg.src = 'icons/volume-level-3.svg';
    volumeImg.alt = 'Volume Level 3';
  } else if (volumeLevel >= 34) {
    volumeImg.src = 'icons/volume-level-2.svg';
    volumeImg.alt = 'Volume Level 2';
  } else if (volumeLevel >= 1) {
    volumeImg.src = 'icons/volume-level-1.svg';
    volumeImg.alt = 'Volume Level 1';
  } else {
    volumeImg.src = 'icons/volume-level-0.svg';
    volumeImg.alt = 'Volume Level 0';
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
