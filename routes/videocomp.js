import express from "express";
import cors from "cors";
import multer from "multer";
import os from 'os'
import fs from 'fs'
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import Ffmpeg from "fluent-ffmpeg";
import { rejects } from "assert";
import exp from "constants";
// console.log(os.availableParallelism());
import EventEmitter from 'events'
const emitter = new EventEmitter()

const router = express.Router()
router.use(cors({
    origin: '*',
    methods: ['GET','POST'],
    credentials: true
}))
let progress1;
let uploaded

// router.use((req,res,next)=>{
//     console.log('Headers :',req.headers);
//     console.log('Content-Length :',req.headers['content-length']*1024*1024);
//     next()
    
// })

        const uploadf = multer({dest: 'uploads/',limits: {
            fileSize: 500 * 1024 * 1024*1024, // 500 MB limit
        }, })

    router.post('/',  async(req,res)=>{
        // req.io.emit('progress',88)
        // req.io.emit('message','Bhadwe kaisa h')
        const size1 = parseInt(req.headers['content-length'],10)
        if (size1<10*1024*1024) {
            res.send('Bhadwe Badi file bhej')
            console.log('gandu');
            
        }
        let upbytes = 0
       req.on('data',(chunk)=>{
        upbytes +=chunk.length
        // console.log(`Downloaded : ${((upbytes*100)/size1).toFixed(1)} %`);
        // if (upbytes == chunk.length) {
        //     req.off('data')
        // }
        uploaded = ((upbytes*100)/size1).toFixed(1)
        emitter.emit('kom1Updated', uploaded);
        // req.io.emit('uploaded',uploaded)
       })
    //    req.on('end',async()=>{
    //     console.log('finished');

    //    })
    
    const dofile = async()=>{

        let ooo = path.dirname(fileURLToPath(import.meta.url))
        let oo = path.parse(ooo).dir
        let x = req.file.filename
        let ko = path.extname(req.file.originalname)
        let file = req.file.originalname
        console.log(x);
        console.log(file);
 
        
        
        // req.file.size()
        if (ko=='.mp4'||ko=='.mov'||ko=='.wav'||ko=='.mkv'||ko=='.avi') {
                
    
                const y = file.replace(/\s+/g, '_');
                fs.renameSync(`${oo}/uploads/${x}`,`${oo}/uploads/${y}`)
                // fs.renameSync(`${oo}/uploads/${file}`,`${oo}/uploads/${y}`)
                let z = path.parse(y).name
                console.log(`${oo}/uploads/${z}`)
                
                
                const compress = async()=>{
                    return new Promise((resolve, reject)=>{
                        Ffmpeg(`${oo}/uploads/${y}`)
                        .videoCodec('libx264') // Use H.264 codec
                        .audioCodec('aac')     // Use AAC codec for audio
                        .size('1280x720')      // Resize video to 720p
                        .outputOptions('-crf', '23') // Set CRF for quality (lower = better)
                        .on('progress', (progress) => {
                            progress1 = progress.percent.toFixed(2)
                            console.log(`Processing: ${progress1}% done`);
                            emitter.emit('progress',progress1)
                            // req.io.emit('progress',progress1)
                        })
                        .on('end', () => {
                            console.log('Compression finished!');
                            resolve('done')
                          
                            // res.download(`convert/${z+ko}`)
                        })
                        .on('error', (err) => {
                            console.error('An error occurred:', err.message);
                        })
                        .save(`convert/${z+ko}`);
                    })
                }
                await compress()
                res.download(`${oo}/convert/${z+ko}`,`${z+ko}`,()=>{
                    console.log('video send');
                    console.log(`${oo}/convert/${z+ko}`);
                    console.log(`${oo}/uploads/${y}`);
                    
                    fs.unlinkSync(`${oo}/convert/${z+ko}`)
                    fs.unlinkSync(`${oo}/uploads/${y}`)
                })
                
                
                
            }
            else {
                res.send(`<h1 style='color:green; justify-content:center; height:100vh; display:flex;align-items:center'>Lund Buddhi ${path.extname(req.file.originalname).split('.')[1].toUpperCase()} kyo bhej rha</h1>`)
                fs.unlinkSync(`${oo}/uploads/${x}`)
                
                
                // res.download(`D:/ReactSeries/filecompback/convert/21.pdf`)
            }
    }
    const upload=async()=>{
        await new Promise((resolve,reject)=>{
            uploadf.single('file')(req,res,(err)=>{
                if(err) return console.log(err)

                resolve('done')

            })
        }).then(()=>dofile())
    }
    upload()
      
            
       
  
       })
       
    
    




export default router
export {emitter}