const router=require("express").Router();
const weatherCtrl=require('../Controller/weatherController');

router.post("/create_rule",weatherCtrl.create_rule);

module.exports=router;
