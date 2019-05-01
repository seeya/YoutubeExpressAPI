const PORT = 1337;
const express = require("express");
const cors = require("cors");
const youtubedl = require("@microlink/youtube-dl");

const app = new express();

function extractor(raw, dlLink) {
  return {
    info: {
      videoId: raw.id,
      title: raw.title,
      length: raw._duration_raw,
      description: raw.description,
      author: raw.uploader,
      viewCount: raw.view_count,
      thumbnail: raw.thumbnail
    },
    link: dlLink
  };
}

app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/link", (req, res) => {
  console.log(`Processing ${req.query.path}`);

  let video = youtubedl(
    req.query.path,
    // Optional arguments passed to youtube-dl.
    ["--format=mp4,720p"],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname }
  );

  // Will be called when the download starts.
  video.on("info", function(info) {
    const best = info.formats[info.formats.length - 1];
    res.json(extractor(info, best.url));
  });
});

app.listen(PORT);

console.log(`Listening on port: ${PORT}`);
