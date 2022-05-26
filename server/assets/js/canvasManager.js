async function getAllCodeSubmissions() {
  const roomId = document.querySelector("#room-id").value;

  if (roomId === "") {
    return;
  }

  const response = await fetch(`http://127.0.0.1:8080/api/rooms/${roomId}/submissions`, 
    { method: "GET" }
  );

  if (!response.ok) {
    return;
  }

  const submissions = await response.json();
  const codeSubmissions = Object.values(submissions).map((userCodePair) => userCodePair.codeSrc);
  const alphaPerSubmission = 1 / codeSubmissions.length;

  const canvasContainer = document.querySelector("#code-canvas-container");
  const canvas = document.querySelector("#code-canvas");
  const ctx = canvas.getContext("2d");

  const fontSize = 15;
  const lineHeight = fontSize + 4;

  canvas.width = canvasContainer.clientWidth;
  canvas.height = codeSubmissions.reduce((height, codeSubmission) => {
    const totalLines = codeSubmission.split("\n").length;
    const totalHeight = totalLines * lineHeight + lineHeight;
    
    return Math.max(height, totalHeight)
  }, canvasContainer.clientHeight - 4);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = `rgba(0, 0, 0, ${alphaPerSubmission})`;

  codeSubmissions.forEach((codeSubmission) => {
    const codeLines = codeSubmission.split("\n");

    codeLines.forEach((line, index) => {
      const lineY = lineHeight + index * lineHeight
      ctx.fillText(line, 10, lineY);
    })
  })
}

// Call it, and set our internal to keep calling B)
getAllCodeSubmissions();
setInterval(getAllCodeSubmissions, 1000)