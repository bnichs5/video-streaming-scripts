
const express = require('express');
let request = require('request-promise');
const app = express();
const port = 3000;
const cheerio = require('cheerio');
const axios = require('axios');

var cookieJar = request.jar();
request  =request.defaults({jar:cookieJar});

app.get('/', async (req, res) => {

var id = req.query.id;
var sub = req.query.sub;
try{
  var result = await request.get("https://ninjastream.to/watch/"+id);
  var cookistr = cookieJar.getCookieString("https://ninjastream.to/watch/"+id);


  const $ = cheerio.load(result);
  var csrd = $('meta[name=csrf-token]').attr('content'); // randomValue2

  
  // var loginres = await request.post(
  //   "https://ninjastream.to/api/video/get",
  //   {
  //         data: {
  //         "Content-Type": "application/json;charset=utf-8",
  //         "Cookie":cookistr,
  //         'content-type': 'application/json',
  //         "Origin": "https://ninjastream.to",
  //         "Referer": "https://ninjastream.to/watch/"+id+"/" ,
  //         "X-Csrf-Token": csrd,
  //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  //         "X-Xsrf-Token":"",
  //         "X-Requested-With": "XMLHttpRequest",
  //         body: JSON.stricookistrngify({id:id})
  //       },
  //   }
  // );


const options = {
  method: 'POST',
  headers: {
         "Content-Type": "application/json;charset=utf-8",
          "Cookie":cookistr,
          'content-type': 'application/json',
          "Origin": "https://ninjastream.to",
          "Referer": "https://ninjastream.to/watch/"+id+"/" ,
          "X-Csrf-Token": csrd,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
          "X-Xsrf-Token":"",
          "X-Requested-With": "XMLHttpRequest"
  },
  data: JSON.stringify({id}),
  url:"https://ninjastream.to/api/video/get"
};

var loginres = await axios(options);
loginres = loginres.data;
var final_url = loginres["result"]["playlist"];



// console.log(loginres);
  res.send(`
      <html>
<head>
 <meta name="viewport" content="width=device-width, initial-scale=1"> 
<style type="text/css">
        html,
        body {
            width: 100%;
            height: 100%;
            background: #000;
            overflow: hidden;
            position: fixed;
            border: 0;
            margin: 0;
            padding: 0;
        }
        #player {
            position: absolute;
            min-width: 100%;
            min-height: 100%;
        }
        .video-js .vjs-volume-panel .vjs-volume-level:before {
            top: -0.60em !important;
        }
        .jw-logo-button {
            width: 80px !important;
        }
.jw-aspect {
    padding-top: 0 !important;
}
        .jw-logo-button>div {
            width: 100% !important;
        }
        @media  only screen and (max-width: 500px) {
            .jw-logo-button {
                width: 50px !important;
            }
        }
    </style> 
  <style>
        .icon {
            display: inline-block;
            width: 1em;
            height: 1em;
            stroke-width: 0;
            stroke: currentColor;
            fill: currentColor;
        }
    </style>
  </head>
<body>
  <div class='video'>
  <script src="https://use.fontawesome.com/20603b964f.js"></script>
<script type="text/javascript" src="https://cdn.jwplayer.com/libraries/ocNS2ThC.js"></script>
		<script type="text/javascript">jwplayer.key = 'ypdL3Acgwp4Uh2/LDE9dYh3W/EPwDMuA2yid4ytssfI=';</script><div id="player"></div><script type="text/javascript">
					    jwplayer("player").setup({
								// width: '100%',
					    		autostart: false,
				file : "${final_url}",
      		tracks:[{"file":"${sub}","label":"English","kind":"captions","default":"true"}],
				abouttext: 'FLIXY',
				aboutlink: 'http://flixy.ga'
						    })
					</script>
  </div>
  </body>
</html>
  
  `);

}catch(e){
    res.send(e);

}
});

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
