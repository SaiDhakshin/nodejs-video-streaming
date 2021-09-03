const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded());

//VIDEO
app.get("/",(req,res) => {
    res.render("video");
})

app.get('/video',(req,res)=>{
    console.log(req.headers.range);
    const range = req.headers.range;
    console.log(range);
    if(!range){
        res.status(400).send('Required header not found');
    }
    const videoPath = ("./videos/buggy.mp4");
    const videoSize = fs.statSync("./videos/buggy.mp4").size;

    const CHUNK_SIZE = 10 ** 6;//1mb
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start} - ${end} / ${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4",
    };

    res.writeHead(206,headers);

    const videoStream = fs.createReadStream(videoPath,{start,end});

    videoStream.pipe(res);
});

app.listen(port , ()=>{
    console.log("Server started listening at" + port);
})