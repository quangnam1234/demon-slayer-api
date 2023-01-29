const express = require('express')// tao api
const cors= require('cors')
const axios = require('axios')// gui req
const cheerio= require('cheerio')// thuc hien cao web 
const bodyParser = require('body-parser')// parser json 
const dotenv= require('dotenv')// deploy co the su dung dotenv
// set up project 
const app= express()
app.use(bodyParser.json({limit:"50mb"}))
app.use(cors())
dotenv.config()
app.use(
    bodyParser.urlencoded({
        limit:"50mb",
        extended:true,
        parameterLimit:50000,
    })
)
// routes 
// get all characters
app.get("/v1",(req,resp)=>{
    const thumbnails=[];
    // url tra ve luon o dang string
    const limit=Number(req.query.limit)
  try{
        axios('https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki')
        .then((res)=>{
            const html= res.data;
            const $= cheerio.load(html);
            $(".portal",html).each(function(){// portal bao bọc bên ngoài 
                const name= $(this).find("a").attr("title");
                const url = $(this).find("a").attr("href");
                const image= $(this).find("a > img ").attr("data-src")
               // console.log(`name: ${name}, url: ${url}, image: ${image}`);
                thumbnails.push({
                    name: name, 
                    url: "http://localhost:8000/v1"+ url.split("/wiki")[1], 
                    image: image
                })
            })
            if(limit && limit > 0) {
                resp.status(200).json(thumbnails.splice(0,limit))
            }
            resp.status(200).json(thumbnails)
        })
  }catch(err){
    resp.status(500).json(err)
  }
})
// get a character
const characterUrl = "https://kimetsu-no-yaiba.fandom.com/wiki/";
app.get("/v1/:character",(req,resp)=>{
    let url= characterUrl+ req.params.character;
    const titles=[]
    const details=[]
    const characterObj= {}// put key and value 
    const characters=[]
    const galleries=[] 
    try{
        axios(url).then((res)=>{
            const html= res.data;
            const $= cheerio.load(html);
            // get galary
            $(".wikia-gallery-item",html).each(function(){
               const gallery=  $(this).find("a > img").attr("data-src");
               galleries.push(gallery)
            })
            $("aside", html).each(function(){// lay tat ca cac element 
                const image= $(this).find("img").attr("src");
                 $(this).find("section > div > h3").each(function(){// lay ra tung element 
                    titles.push($(this).text())
                   // titles.push($(this).text())
                })
                // get character details
                // thêm myinfor.email = ""
                // myinfor['email'] tìm email trong object - sử dụng dấu ''
            $(this).find("section > div > div").each(function(){
                details.push($(this).text())
            });
            if(image !== undefined){

            for(let i=0; i<titles.length;i++){
                characterObj[titles[i].toLowerCase()]= details[i]// key là title và value là details
                // sử dung [] dưới dạng biến nếu muốn định nghĩa, tương tác với object bên ngoài 
            }
                characters.push({
                    name:req.params.character,
                    gallery:galleries,
                    image,
                    ...characterObj,
                })
            }
        })
        resp.status(200).json(characters)
        })
    }catch(err){
        resp.status(500).json(err)
    }
})

app.listen(process.env.PORT || 8000,()=>{
    console.log("server is running")
})


