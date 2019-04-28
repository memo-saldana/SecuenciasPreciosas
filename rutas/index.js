var express = require("express"),
    router = express.Router();

router.get("/", (req,res) =>{
  res.send(`${ process.env.PROJECT_NAME } API working!`)
})


module.exports = router;