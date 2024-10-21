const router=require("express").Router();
const weatherCtrl=require('../Controller/weatherController');
const userCtrl =require('../Controller/authController')
const auth=require('../middleware/authCheck')

router.get("/current_weather",auth,weatherCtrl.current_weather);
router.get("/city_history",auth,weatherCtrl.cityWeatherHistory);
router.post("/signup",userCtrl.signup);
router.post("/set_threshold",auth,userCtrl.set_threshold);
router.get("/getalerts",auth,weatherCtrl.getAlerts);
router.post("/signin",userCtrl.signin);

module.exports=router;
