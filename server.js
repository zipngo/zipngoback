import express from "express";
import cors from "cors";
import {Server} from 'socket.io'
import {createServer} from 'http'
import bodyParser from "body-parser";
// import multer from "multer";
// import { PDFDocument } from "pdf-lib";
// import fs from 'fs'
// import path, { resolve } from "path";
// import { fileURLToPath } from "url";
// import { exec } from "child_process";
// import { stdout } from "process";
import wtp from './routes/wordtopdf.js'
import ptw from './routes/pdftoword.js'
import pptxtp from './routes/pptxtopdf.js'
import xtp from './routes/xlsxtopdf.js'
import vidc,{emitter} from './routes/videocomp.js'



const app = express()
const port = 5000
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET','POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true

    }
})
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));

app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET','POST'],
    // credentials: true
}))
let socketid;
io.on('connection',(socket)=>{
   
    console.log(socket.id)
    // console.log(io[1]);
    
    // setInterval(() => {
    //     const progress = Math.floor(Math.random() * 100);
    //     socket.emit("progress", progress);
    // },1000);
    emitter.on('progress',(data)=>{
        socket.emit('progress',data)
    })
    // socket.emit('progress',progress1)
    emitter.on('kom1Updated',(data)=>{
        socket.emit('uploaded',data)
    })
})

app.use((req,res,next)=>{
        req.io = io
        // console.log(io);
        // console.log(req.headers);
        
        console.log(req.headers.origin)
        next()
    })
    app.use('/word-to-pdf',wtp)
    app.use('/pdf-to-word',ptw)
    app.use('/pptx-to-pdf',pptxtp)
    app.use('/xlsx-to-pdf',xtp)
    app.use('/vidcomp',vidc)
    
    
    
    
    // let ooo = `${path.parse(oo).dir}/uploads`
    // console.log(path.parse(ooo));
    
    app.get('/',(req,res)=>{
        res.send('Connection')
        console.log('hjdg');
        
    })
    



server.listen(port,'0.0.0.0', ()=>{
    console.log('Server is responding '+ port)
})