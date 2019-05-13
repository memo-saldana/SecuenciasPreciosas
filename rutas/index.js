const express = require('express'),
      router = express.Router();


router.get("/", (req,res) =>{
  res.render('landing')
})

router.get('/favicon.ico', (req, res) => res.status(204));

router.get('/about', (req,res) => {
  res.render('about')
})

module.exports = router;