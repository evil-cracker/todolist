import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config';


var port =process.env.PORT || 3000; 

var app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));


var date = new Date();
var update = date.toLocaleDateString("de-DE");
var day = date.getDay();
var title = "Daily ToDo";
var tit;

switch (day) {
    case 0:
        day = "sunday"
        break;

    case 1:
        day = "Monday";


        break;

    case 2:
        day = "Tuesday";

        break;

    case 3:
        day = "Wednesday"
        break;

    case 4:
        day = "Thursday";
        break;

    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
        break;

    default:

        break;
}


day = day.toUpperCase();


var api_key=`mongodb+srv://${process.env.my_id}:${process.env.my_pass}@evil-cracker.gn4bjhq.mongodb.net/todolist`;



mongoose.connect(api_key);

const todoschema = new mongoose.Schema({
    name: String,
});


const todo = mongoose.model("TODOLIST", todoschema);
const todowork = mongoose.model("TODOLISTWORK", todoschema);

const t1 = new todo({

    name: "welcome!",
});



const newschema=new mongoose.Schema({
    name:String,
    it:[todoschema],
});


const customlist=mongoose.model("LIST",newschema);
async function add1(it) {
    await todo.insertMany([it]);

}




async function add2(it) {
    await todowork.insertMany([it]);

}


async function add3(it) {
    await customlist.insertMany([it]);

}
app.get("/", (req, res) => {
    title = "Daily ToDo";
    let items;





    (async () => {


        items = await todo.find();

        if ((items.length) === 0) {

            add1(t1);

            res.redirect("/");

        }
        else {

            res.render("index.ejs", {
                daily: items,
                update: update,
                day: day,
                title: title,
            });


        }

    })();
});

app.post("/submit", async (req, res) => {



    var inn = req.body["dailywork"];
    var listname =req.body["listname"];


    const t2 = ({
        name: inn,
    });

    if (title == "Daily ToDo") {
        await add1(t2);
        
        res.redirect("/");
    }
    if(title=="Working ToDo") {
        await add2(t2);
        
        res.redirect("/work");
    }
   if(title=="extra"){
    
        // const l2 = ({
        //     name:tit ,
        //     it:t2,
           
        // });
        await customlist.updateOne({name:listname},{$push:{it:t2}});
  
        var s=`/extra/${listname}/`;
       
       res.redirect(s);   
    }


});

app.post("/delete",async(req,res)=>{

var del=req.body.check_name;

if(title=="Daily ToDo"){

    await todo.deleteOne({_id:del});
    res.redirect("/");
}
if(title=="Working ToDo") {

    await todowork.deleteOne({_id:del});
    res.redirect("/work");

}

if(title=="extra"){
await customlist.findOneAndUpdate({name:tit},{$pull: {it:{_id:del} }});
    await res.redirect(`/extra/${tit}`);

}



});


app.get("/work", async(req, res) => {

var item= await todowork.find();

if(item.length==0){
    await add2(t1);
    res.redirect("/work");
}
else{

        title = "Working ToDo";
    res.render("index.ejs", {
        daily: item,
        update: update,
        day: day,
        title: title,
    });

}



});



app.get("/extra/:title",async(req,res)=>{

   

 tit=req.params.title;
 title="extra";


var le= await customlist.find({name:tit});



 if(le.length==0){
const l1=new customlist({
    name:tit,
    it:t1,
});
customlist.insertMany([l1]);
 }
 le= await customlist.findOne({name:tit});;

  res.render("index.ejs",{
      daily: le.it,
     
      title: tit,
  })


});


app.listen(port, () => {
    console.log("server is running @ port number 3000         http://localhost:3000/");
});
