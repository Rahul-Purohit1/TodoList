const bodyParser = require("body-parser");
const express = require("express");
const  app = express()

app.set("view engine","ejs")

app.use("/",bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

const _ = require("lodash")
//Own Module
const date = require(__dirname+"/date.js")
const Currentday = date.getDay()


//Mongoose code
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://rahul1851:rahul1851@cluster0.mnolrk5.mongodb.net/todoListDB")

// item Schema % Model
const itemSchema ={
  name : String
}
const ItemModel = mongoose.model("Item",itemSchema)

const item1 = new ItemModel({
  name : "Welcome to your ToDo List"
})
const item2 = new ItemModel({
  name : "<-- Hit this box to delete this task"
})
const item3 = new ItemModel({
  name : "Hit + button to add a new task"
})


//Dynamic List Schema & Model
const defaultItem = [item1,item2,item3]

const  customSchemaList = {
  name : String,
  item : [itemSchema]
}

const listModel = mongoose.model("list",customSchemaList)

 


// APP code

app.get("/",function(req,res){

//find give us array in result(but not findOne)
  ItemModel.find({},function(err,foundItem){

    if(foundItem.length == 0){ItemModel.insertMany(defaultItem,function(err){
      if(err){
      console.log(err)
    }
    else{
      console.log("successfully added to the database")}
    } 
    )}
    else{
      
      res.render("list",{ listTitle : Currentday,
       itemadd:foundItem})
    }
 
  })

})

//For Dynamic list access 
app.get("/:customListName",function(req,res){
  
  //using lodash capital
  const customList =_.capitalize(req.params.customListName)

  
  listModel.findOne({name:customList},function(err,foundList){
if(!err){
          if(!foundList){
          //creating a new list
         const list = new listModel({
          name : customList,
          item : defaultItem
         });
          list.save();
      
          res.redirect("/"+customList)
         }
      else{ 
      //showing existing list
      res.render("list",{listTitle :foundList.name,
        itemadd:foundList.item})
    }

}
  
  })
      
})


//Adding route
app.post("/",function(req,res){

 const newItem = req.body.itemname;
 const listName = req.body.list;
 

   const enterItem = new ItemModel({
    name : newItem
   });
   //to save directly to collection
  
   if(listName === Currentday){
    enterItem.save();
    res.redirect("/");
   }
   else{
     listModel.findOne({name:listName},function(err,result){
          result.item.push(enterItem)
          result.save();
          res.redirect("/"+listName)
     })
   }

})


//Deleting Route
app.post("/delete",function(req,res){

         const checkedItem = req.body.checkBox
    const listName = req.body.listName

    if(listName === Currentday){ 
        //deleting on root page  
        ItemModel.findByIdAndRemove(checkedItem,function(err){
          if(!err){res.redirect("/")} 
         })
       
    }
    else{
      listModel.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkedItem}}},function(err,result){
            if(!err){ res.redirect("/"+listName)}
    })
     }
})




let port = process.env.PORT;
if(port == null || port ==""){
  port= 3000;
}


app.listen(port,function(){
    console.log("server is runnig on port 3000");
}) 