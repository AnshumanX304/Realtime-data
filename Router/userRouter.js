const router=require("express").Router();
const weatherCtrl=require('../Controller/weatherController');

router.get("/current_weather",weatherCtrl.current_weather);

module.exports=router;
