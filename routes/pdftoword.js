import express from "express";
import cors from "cors";
import multer from "multer";
import fs from 'fs'
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import {Powerpoint, Word} from 'pdf-officegen'


const router = express.Router()
router.use(cors({
    origin: '*',
    methods: ['GET','POST'],
    credentials: true
}))

const uploadf = multer({dest: 'uploads/' })

router.post('/', uploadf.single('file'), async(req,res)=>{
    if (path.extname(req.file.originalname) != '.pdf') {
            res.json('gadhe')
        }
        else {
    
            let ooo = path.dirname(fileURLToPath(import.meta.url))
            let oo = path.parse(ooo).dir
            // console.log(oo);
        
            let x = req.file.filename
            // let ok = path.extname(req.file.originalname)
            let file = req.file.originalname
            console.log(x);
            console.log(file);

            const p = new Word()

           

            
            
            
            
            
            // console.log(ok);
            // console.log(y);
            // console.log(z);
        
            const execPromise=async(libredoctopdfcomm1)=>{
                return new Promise((resolve, reject)=>{
                    exec(libredoctopdfcomm1,(err,stdout,stderr)=>{
                        if (err) {
                            reject('Conversion Error '+err);
                            return
                        }
                        if (stderr) {
                            reject('Error hogya bahut bhayankar :'+stderr)
                            return
                        }
                        resolve(stdout)
                    })
                })
            }
            
        
            const y = file.replace(/\s+/g, '_');
            fs.renameSync(`${oo}/uploads/${x}`,`${oo}/uploads/${y}`)
            // fs.renameSync(`${oo}/uploads/${file}`,`${oo}/uploads/${y}`)
            let z = path.parse(y).name
            console.log(z);

            
            
            
            let libredoctopdfcomm = `soffice --headless --convert-to docx --outdir ${oo}/convert ${oo}/uploads/${y}`
            
            await execPromise(libredoctopdfcomm)
                console.log(`Conversion Successful from: ${z}.pdf --> ${z}.word`)
        
            // res.download('Hogya bhai')
            // console.log(`${z}.pdf`);
            
                res.download(`D:/ReactSeries/filecompback/convert/${z}.docx`,`${z}.docx`,()=>{
                    try {
                        // console.log(`${oo}/uploads/${y}`);
                        // console.log(`${oo}/convert/${z}.pdf`);
                        fs.unlinkSync(`${oo}/uploads/${y}`)
                        fs.unlinkSync(`${oo}/convert/${z}.docx`)
                    } catch (error) {
                        console.log('Error Deleting File');
                    }
                })
                // res.download(`D:/ReactSeries/filecompback/convert/21.pdf`)
        }
})


export default router