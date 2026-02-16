let noiseOffset = 0;
let noiseDetailValue = 8; // Number of octaves for Perlin noise
let noiseFalloff = 0.65; // How much each octave contributes

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100); // Use HSB for easier color manipulation
  noiseDetail(noiseDetailValue, noiseFalloff); // Set Perlin noise detail
  noStroke();
}

// Helper function to draw a simple tree
function drawTree(x, y, treeScale) {
  push(); // Isolate transformations for this tree
  translate(x, y); // Move origin to the tree's base
  scale(treeScale); // Scale the tree

  // Trunk
  fill(30, 60, 30); // Dark brown
  rect(-5, 0, 10, 20); // x, y, width, height

  // Canopy (triangle)
  fill(120, 80, 50); // Green
  triangle(0, -30, -15, 0, 15, 0); // tip, bottom-left, bottom-right
  pop(); // Restore original transformations
}

function draw() {
  // --- Sky Color (based on mouseY) ---
  let skyHue = map(mouseY, 0, height, 200, 270); // Blue to deep purple
  let skyBrightness = map(mouseY, 0, height, 90, 30); // Brighter at top, darker at bottom
  background(skyHue, 50, skyBrightness);

  let oceanHeight = height * 0.3; // 30% of the screen is ocean
  let mountainBaseY = height - oceanHeight; // Mountains sit on top of the ocean

  // Store mountain points to use for tree placement
  let mountainPoints = [];

  // --- Mountains ---
  fill(30, 20, 40); // Dark brown/gray mountain color

  beginShape();
  vertex(0, height); // Start at bottom-left for mountain base

  for (let x = 0; x <= width; x++) {
    let yNoise = noise((x / 100) + noiseOffset);
    let mountainHeight = map(yNoise, 0, 1, height * 0.1, height * 0.4);
    let y = mountainBaseY - mountainHeight;
    vertex(x, y);
    mountainPoints.push({ x: x, y: y });
  }

  vertex(width, height); // End at bottom-right for mountain base
  endShape(CLOSE);

  // --- Trees ---
  for (let i = 0; i < mountainPoints.length; i += 50) { // Place a tree every 50 pixels horizontally
    let p = mountainPoints[i];
    // Scale trees based on their y position (higher = smaller)
    let treeScale = map(
      p.y,
      mountainBaseY,
      mountainBaseY - height * 0.4,
      0.5,
      1.5,
      true
    );
    drawTree(p.x, p.y, treeScale);
  }

  // --- Ocean --- (Drawn last to appear on top of mountain base and trees)
  fill(210, 80, 70); // Deep blue ocean color
  rect(0, height - oceanHeight, width, oceanHeight);

  // Slowly move through the noise landscape to give a sense of movement
  noiseOffset += 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
