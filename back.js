/* Setup of the engine */


const CONST_MONEY = 150;
const COMP_CNT = 5;
const COMP_NAME = ["mcdonalds","google","apple","cocacola","pepsi"];
const COMP_VALUE = [90,250,200,150,110];
const COMP_STOCK_NO = [1,0,0,0,0];
const COMP_TREND_DATA = [[6,12,24,36],[4,8,23,38],[8,14,21,36],[6,9,22,37],[10,20,31,39]];
const COMP_CUR_TREND = [[0,1,-1],[0,-1,-1],[0,-1,-1],[0,-1,-1],[0,1,-1]];
//0:next trend change, 1: trend up or down, 2: trend data index
const PEOPLE_ON = [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]];
const PEOPLE_EFFECT = [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]];
const PEOPLE_START = [[-1,15,28,34],[2,11,26,38],[5,9,23,33],[7,18,30,39],[13,20,32,37]];
const PPL_CNT = 4;
const HEALTH_DEC = 0.02;

var game = new Clarity();

var phase = -1;

var money;

/*stock*/
var cm_cnt;
var cm_name;
var cm_value;
var cm_next_value;
var cm_stock_no;
var cm_trend_data;
var cm_cur_trend;

var ele;
var elb;
var health_dec_rate;

let health = document.getElementById("health")

var people_on;
var people_effect;
var people_start_phase;

var hotel_out_time;
var hotel_closed;

var update_trend = function(){
  for (i=0;i<cm_cnt;i++){
    if (phase >= cm_cur_trend[i][0]){
      cm_cur_trend[i][2] += 1;
      if (cm_cur_trend[i][2]==4) {cm_cur_trend[i][2]=0;}
      cm_cur_trend[i][0] = cm_trend_data[i][cm_cur_trend[i][2]];
      cm_cur_trend[i][1] *= -1;
    }
  }
}


game.set_viewport(canvas.width, canvas.height);
game.load_map(map);

/* Limit the viewport to the confines of the map */

game.limit_viewport = false;

var initialize = function(){
  phase = -1;

  money = CONST_MONEY; //player money

  /*stock*/
  cm_cnt = COMP_CNT;
  cm_name = COMP_NAME;
  cm_value = COMP_VALUE;
  cm_next_value = cm_value.slice();
  cm_stock_no = COMP_STOCK_NO;
  cm_trend_data = COMP_TREND_DATA;
  cm_cur_trend = COMP_CUR_TREND;

  ele = [0,0,0,0,0];
  elb = [false,false,false,false,false];

  health.value = 100;
  health.max = 100;
  health_dec_rate = HEALTH_DEC;

  people_on = PEOPLE_ON;
  people_start_phase = PEOPLE_START;
  people_effect = PEOPLE_EFFECT;

  hotel_closed = true;

  update_trend();
}

var display = function(){
  document.getElementById('money').innerHTML = money;
  
  for (i=0;i<cm_cnt;i++){
    document.getElementById(cm_name[i]).innerHTML = cm_value[i];
    document.getElementById(cm_name[i]+"_cnt").innerHTML = cm_stock_no[i];
  }
}

var Loop = function() {

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update();
    game.draw(ctx);

    window.requestAnimFrame(Loop);

    health.value -= health_dec_rate;
    if (health.value == 0){
      alert("You died!");
      initialize();
      display();
      game.load_map(map);
    }
    if (health.value > 100) {health.value = 100;}

};

var message_0 = function (msg)
{
  if (elb[0]) {return;}
  ele[0] = document.createElement("div");
  ele[0].setAttribute("style","position:absolute; top:30%; width: 300px; left:70%; margin: 10px; background-color:#333; color:#777; font-family: Helvetica, Arial, sans-serif; font-size: 18px;");
  ele[0].innerHTML = msg;
  document.body.appendChild(ele[0]);
  elb[0] = true;
}; 

var message_1 = function (msg)
{
  if (elb[1]) {return;}
  ele[1] = document.createElement("div");
  ele[1].setAttribute("style","position:absolute; top:50%; width: 300px; left:70%; margin: 10px; background-color:#333; color:#fff; font-family: Helvetica, Arial, sans-serif; font-size: 18px;");
  ele[1].innerHTML = msg;
  document.body.appendChild(ele[1]);
  elb[1] = true;
};

var message_2 = function (msg)
{
  if (elb[2]) {return;}
  ele[2] = document.createElement("div");
  ele[2].setAttribute("style","position:absolute; top:30%; width: 300px; left:70%; margin: 10px; background-color:#333; color:#fff; font-family: Helvetica, Arial, sans-serif; font-size: 18px;");
  ele[2].innerHTML = msg;
  document.body.appendChild(ele[2]);
  elb[2] = true;
};

var message_buy = function (type)
{
  if (elb[3]) {return;}
  ele[3] = document.createElement("button");
  ele[3].setAttribute("style","position:absolute; top:50%; left:75%; margin: 10px; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block;font-size: 14px;");
  ele[3].innerHTML = "Buy Stock";
  ele[3].onclick = function(){
    buy_stock(type);
  };
  document.body.appendChild(ele[3]);
  elb[3] = true;
};

var message_sell = function (type)
{
  if (elb[4]) {return;}
  ele[4] = document.createElement("button");
  ele[4].setAttribute("style","position:absolute; top:60%; left:75%; margin: 10px; background-color: #f44336; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block;font-size: 14px;");
  ele[4].innerHTML = "Sell Stock";
  ele[4].onclick = function(){
    sell_stock(type);
  };
  document.body.appendChild(ele[4]);
  elb[4] = true;
};

var message_stock = function (msg, type)
{
  message_2(msg);
  message_buy(type);
  message_sell(type);
};


var message_person = function (msg, id, product, person, amount)
{
  if (!people_on[product][person]) {return;}
  message_1(msg);
  if (people_effect[product][person]) {return;}
  setTimeout(function(){
    map.keys[id].colour = "#888";
    people_on[product][person] = false;
    map.keys[id].friction = {x: 0.9,y: 0.9};
    if (elb[1]){
      ele[1].parentNode.removeChild(ele[1]);
      ele[1] = null;
      elb[1] = false;
    }
  },3000);
  cm_next_value[product] = Math.ceil(cm_next_value[product] * amount);
  people_effect[product][person] = true;
};

var other_button = function (msg,type)
{
  if (elb[4]) {return;}
  ele[4] = document.createElement("button");
  ele[4].setAttribute("style","position:absolute; top:50%; left:70%; margin: 10px; background-color: #f44336; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block;font-size: 14px;");
  ele[4].innerHTML = msg;
  ele[4].onclick = function(){
    switch (type) {
      case 1:
        buy_plane ();
        break;
      case 2:
        buy_hotel ();
        break;
    }
  };
  document.body.appendChild(ele[4]);
  elb[4] = true;
}

var restore_el = function ()
{
  for (i=0; i<5; i++) {
    if (elb[i]) {
      ele[i].parentNode.removeChild(ele[i]);
      ele[i] = null;
      elb[i] = false;
    }
  }
};

var hotel_locked = function ()
{
  if (hotel_closed) {
    map.keys[42].colour = "#0FF";
  }
}

var buy_plane = function ()
{
  if (money >= 1000){
    money -= 1000;
    document.getElementById('money').innerHTML = money;
  }else{
    alert("You don't have enough money.");
  }
}

var buy_hotel = function ()
{
  if (money >= 15){
    money -= 15;
    document.getElementById('money').innerHTML = money;
    map.keys[33].colour = "#33ee99";
    map.keys[33].solid = 0;
    hotel_out_time = (phase+1)%41;
    hotel_closed = false;
  }else{
    alert("You don't have enough money.");
  }
}

var buy_stock = function (type)
{
  if (money >= cm_value[type]){
    money -= cm_value[type];
    document.getElementById('money').innerHTML = money;
    cm_stock_no[type] ++;
    document.getElementById(cm_name[type]+"_cnt").innerHTML = cm_stock_no[type];
  }else{
    alert("You don't have enough money.");
  }
}

var sell_stock = function (type)
{
  if (cm_stock_no[type] >= 1){
    money += cm_value[type];
    document.getElementById('money').innerHTML = money;
    cm_stock_no[type] --;
    document.getElementById(cm_name[type]+"_cnt").innerHTML = cm_stock_no[type];
  }else{
   alert("You don't have enough stocks to sell.");
  }
}

var apple_func = function ()
{
  if (phase < 10) {
    message_1("Apple: New spaceship campus, under construction. This part is not ready yet",5000);
  }else{
    message_stock("Welcome to Apple. How can we help you?",2);
  }
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        if (timer == duration){
          next_phase();
        }

        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    var min = 20,
        display = document.querySelector('#time');
    startTimer(min, display);
};

function getRandomInt(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.ceil(Math.random() * (max - min + 1)) + min;
}

function update_people() {
  for (i=0;i<COMP_CNT;i++){
    for (j=0;j<PPL_CNT;j++){
      if (people_start_phase[i][j] == phase){
        map.keys[10+(i*4)+j].colour = "#FFEB3B";
        people_on[i][j] = true;
        map.keys[10+(i*4)+j].friction = {x: 0.3,y: 0.5};
      }
      if ((people_start_phase[i][j]+2)%40 == phase && people_on[i][j] && !people_effect[i][j]) {
        map.keys[10+(i*4)+j].colour = "#888";
        people_on[i][j] = false;
        map.keys[10+(i*4)+j].friction = {x: 0.9,y: 0.9};
      }
    }
  }
}

function next_phase() {
    phase += 1;
    if (phase == 40) {phase = 0;}
    update_people();
    cm_value = cm_next_value.slice();
    if (hotel_out_time==phase) {
      map.keys[33].solid = 1;
      map.keys[33].colour = "#795548";
      hotel_closed = true;
    }
    update_trend();
    for (i=0;i<cm_cnt;i++){
      cm_value[i] += (cm_cur_trend[i][1] * getRandomInt(- (cm_value[i]/4), cm_value[i]/2));
    }
    cm_next_value = cm_value.slice();
    display();
}


/* Start */
initialize();
Loop();
