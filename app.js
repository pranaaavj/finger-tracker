let fingerX, fingerY;
let previousX, previousY;
let hands;

function setup() {
  createCanvas(1040, 680);
  background(200);

  stroke('magenta');
  strokeWeight(5);

  const videoElement = document.getElementById('video');

  hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

function onResults(results) {
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      const indexFingerTip = landmarks[8];

      // Reverse the X coordinate
      const reversedX = width - indexFingerTip.x * width;

      fingerX = reversedX;
      fingerY = indexFingerTip.y * height;

      if (previousX !== undefined && previousY !== undefined) {
        line(fingerX, fingerY, previousX, previousY);
      }

      previousX = fingerX;
      previousY = fingerY;
    }
  }
}
