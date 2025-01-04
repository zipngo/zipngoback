import express from "express";
import cors from "cors";
import multer from "multer";
import os from 'os'
import fs from 'fs'
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
// console.log(os.availableParallelism());

const router = express.Router()
router.use(cors({
    origin: '*',
    methods: ['GET','POST'],
    credentials: true
}))

const uploadf = multer({dest: 'uploads/' })

router.post('/', uploadf.single('file'), async(req,res)=>{
    let ooo = path.dirname(fileURLToPath(import.meta.url))
    let oo = path.parse(ooo).dir
    let x = req.file.filename
    if (path.extname(req.file.originalname) != '.xlsx') {
        res.send(`<h1 style='color:green; justify-content:center; height:100vh; display:flex;align-items:center'>Lund Buddhi ${path.extname(req.file.originalname).split('.')[1].toUpperCase()} kyo bhej rha</h1>`)
        fs.unlinkSync(`${oo}/uploads/${x}`)
    }
    else {

        // console.log(oo);
    
        // let ok = path.extname(req.file.originalname)
        let file = req.file.originalname

        
        
        // console.log(ok);
        // console.log(y);
        // console.log(z);
    
        const execPromise=async(libredoctopdfcomm1)=>{
            return new Promise((resolve, reject)=>{
                exec(libredoctopdfcomm1,()=>{
                    resolve('hogya')
                })
            })
        }
        
    
        const y = file.replace(/\s+/g, '_');
        fs.renameSync(`${oo}/uploads/${x}`,`${oo}/uploads/${y}`)
        // fs.renameSync(`${oo}/uploads/${file}`,`${oo}/uploads/${y}`)
        let z = path.parse(y).name
        
        
        let libredoctopdfcomm = `soffice --headless --convert-to pdf --outdir ${oo}/convert ${oo}/uploads/${y}`
        
        await execPromise(libredoctopdfcomm)
            console.log(`Conversion Successful from: ${z}.xlsx --> ${z}.pdf`)
    
        // res.download('Hogya bhai')
        // console.log(`${z}.pdf`);
        
            res.download(`D:/ReactSeries/filecompback/convert/${z}.pdf`,`${z}.pdf`,()=>{
                try {
                    // console.log(`${oo}/uploads/${y}`);
                    // console.log(`${oo}/convert/${z}.pdf`);
                    fs.unlinkSync(`${oo}/uploads/${y}`)
                    // fs.unlinkSync(`${oo}/convert/${z}.pdf`)
                } catch (error) {
                    console.log('Error Deleting File');
                }
            })
            // res.download(`D:/ReactSeries/filecompback/convert/21.pdf`)
    }

})


export default router