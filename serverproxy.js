const express = require('express')
const fs = require('fs')
const path = require('path')
const http = require('http')
const request = require('request')
const app = express()
var cors = require('cors')


var key = 'somebodysomewhereanddevlol';

// Create an encryptor:
var encryptor = require('simple-encryptor')(key);

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

// let domain = 'http://localhost:3000/';
let domain = 'https://thawing-scrubland-27252.herokuapp.com/';


// let target = 'http://fxqv1b9sa9zmbmotrxqhga-on.drv.tw/m/Tandav%20(2021)%20720p%20Hindi%20S-01%20Ep-[01-09]%20HDRip%20x264%20AAC%201.4GB[MB].mkv';
// // figure out 'real' target if the server returns a 302 (redirect)
// http.get(target, resp => {
//   if(resp.statusCode == 302) {
//     target = resp.headers.location;
//   }
// });

app.use(express.static('dist'));

app.get('/api', (req, res) => {
  try {
    var uri = req.query.uri; // $_GET["id"]

    req.pipe(request.get(uri)).pipe(res);
  } catch (e) {
    res.send(e);
  }
});


app.get('/encrypt', (req, res) => {
  try {
    var user = req.query.user; // $_GET["id"]
    var pass = req.query.pass; // $_GET["id"]
    // nested object:
    var obj = {
      user,
      pass
    };
    var objEnc = encryptor.encrypt(obj);
    
    res.send(objEnc);
    // var objDec = encryptor.decrypt(objEnc);


  } catch (e) {
    res.send(e);
  }
});



// app.get('/decrypt', (req, res) => {
//   try {
//     var hash = req.query.hash; // $_GET["id"]
//     var objDec = encryptor.decrypt(hash);
//     res.send(objDec);
//     // var objDec = encryptor.decrypt(objEnc);
//   } catch (e) {
//     res.send(e);
//   }
// });



app.get('/fembedstream', (req, res) => {
  var uri = req.query.id; // $_GET["id"]
  var index = req.query.index;
  try {
    request.post(
      'https://www.fembed.com/api/source/' + uri,
      { json: { r: '' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // body = JSON.parse(body);
          //  console.log(body);

          body = body['data'];


          var final = [];
          body.forEach(element => {


            // request(element['file'], {method: 'HEAD'}, function (err, res, body){
            //  final.push(element['file']);
            // });

            final.push(element['file']);

          });


          // res.send(final);
          req.pipe(request.get(final[index])).pipe(res);
          // got.stream(final[index]).pipe(res);


        }
      }
    );
  }
  catch (e) {
    res.send(e);

  }
});






app.get('/fembed', (req, res) => {
  var uri = req.query.id; // $_GET["id"]
  try {
    request.post(
      'https://www.fembed.com/api/source/' + uri,
      { json: { r: '' } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // body = JSON.parse(body);
          //  console.log(body);
          //  console.log(body);

          body = body['data'];


          var final = [];
          body.forEach(element => {
            var index = body.indexOf(element);
            final.push
              (
                [element['label'], domain + 'fembedstream?id=' + uri + '&index=' + index]

              );
          });


          // res.send(final);
          res.send(JSON.stringify(final));
        }
      }
    );
  } catch (e) {
    res.send(e);

  }
});














//seedr
// await seedr.login("mandalbis1729@gmail.com","Bm782403");

let getFile = async (user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }

  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.getVideos();
  //await seedr.deleteFile("file_id");

};


let init = async (user, pass, link) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user, pass);
  var all = await seedr.getAllFilesandFolders();
  // console.log(all);
  var finalall = [];


  all.forEach(each => {
    each.forEach(each => {
      if (!finalall.includes(each['fid'])) {
        // console.log(each);
        finalall.push(each['fid']);
      }
    });
  });


  // console.log(finalall);

  for (var each of finalall) {
    var lol = await seedr.deleteFolder(each);
    //  console.log(lol);
  }

  //await seedr.deleteFile("file_id");
  var magnet = await seedr.addMagnet(link);

  var n = true;
  while (n == true) {
    var vids = await seedr.getVideos();
    if (vids.length === 0) {
      n = true;
    } else {
      n = false;
      var url = await seedr.getFile(vids[0][0]['id']);
      url = url['url'];
      //  console.log(url);
      return url;
    }
  }

};




let getall = async (user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.getAllFilesandFolders();
};




let download = async (id, user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.getFile(id);
  //

};


let play = async (id, user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.getVideo(id);
  //

};

let deleteFolder = async (fid, user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.deleteFolder(fid);
  //

};

let addMagnet = async (link, user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.addMagnet(link);
  //

};


app.get('/seedr/get', async function (req, res) {
  // const user = req.query.user
  // const pass = req.query.pass
  //s
 var hash = req.query.hash; // $_GET["id"]
 if(!hash){
  res.send('send hash lol');
 }
 if(hash.includes('/') || hash.includes('+') ) {
  res.send('send proper hash lol');
 }
 var objDec = encryptor.decrypt(hash);
 if(objDec['user'] && objDec['pass']){
 var user = objDec['user'];
 var pass = objDec['pass'];
 }

  var value = await getFile(user, pass);
  try {
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
})

app.get('/seedr/download', async function (req, res) {
  try{
  const id = req.query.id
  // const user = req.query.user
  // const pass = req.query.pass
  const embed = req.query.embed
  const pipe = req.query.pipe

 var hash = req.query.hash; // $_GET["id"]
 if(!hash){
  res.send('send hash lol');
 }
 if(hash.includes('/') || hash.includes('+') ) {
  res.send('send proper hash lol');
 }
 var objDec = encryptor.decrypt(hash);
 if(objDec['user'] && objDec['pass']){
 var user = objDec['user'];
 var pass = objDec['pass'];
 }

  try {
    var value = await download(id, user, pass);

    if (embed == 1) {
      var uri = value['url'];
      var value1 = await play(id, user, pass);
      var eng = value1["subtitles"]["English"];
      var pre = value1["url_preroll"];

      res.send(
        `
<html>
<head>
 <meta name="viewport" content="width=device-width, initial-scale=1"> 
<style type="text/css">
body{
	padding: 0px;
	margin: 0px;
	background: black;
}
        .video {
          height: calc(100%);
          width: 100%;
          background: black;
          position: absolute;
      }
      
    </style> 
    <script src="https://cdn.plyr.io/3.6.8/plyr.js"></script>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/plyr.css" />
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/demo.css" />
  </head>
<body>
  <div class='video'>
  <video id="player" playsinline controls data-poster="${pre}">
  <source src="${uri}"/>
  <!-- Captions are optional -->
  <track kind="captions" label="English captions" src="${domain + 'api?uri=' + eng}" srclang="en" default />
</video>
          <script>
          const player = new Plyr('#player', {
            captions: {
              active: true,
              language: "en"
            }
          });</script>
  </div>
  </body>
</html>
`

      );
    } else {
      if (pipe == 1) {
        var uri = value['url'];
        req.pipe(request.get(uri)).pipe(res);
      }
      else {
        var uri = value['url'];
        res.writeHead(302, {
          'Location': uri
          //add other headers here...
        });
        res.end();
      }
    }

    // console.log(uri);

  }
  catch (e) {
    res.send(e);
  }
  // res.send(value);
}
catch (e) {
  res.send(e);
}
})

app.get('/seedr/deletefolder', async function (req, res) {
  try{
   // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }

   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }


  const fid = req.query.fid
  try {
    var value = await deleteFolder(fid, user, pass);
    res.send(value);
  } catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})

app.get('/seedr/magnet', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
 var hash = req.query.hash; // $_GET["id"]
 if(!hash){
  res.send('send hash lol');
 }
 if(hash.includes('/') || hash.includes('+') ) {
  res.send('send proper hash lol');
 }
 var objDec = encryptor.decrypt(hash);
 if(objDec['user'] && objDec['pass']){
 var user = objDec['user'];
 var pass = objDec['pass'];
 }
  const link = req.query.link
  try {
    var value = await addMagnet(link, user, pass);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})


app.get('/seedr/subtitles', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }

  const link = req.query.id
  try {
    if (!user) {
      user = "mandalbis1729@gmail.com";
    }

    if (!pass) {
      pass = "Bm782403";
    }
    var seedr = require("./seedr");
    // console.log(user,pass);
    var seedr = new seedr();
    await seedr.login(user, pass);

    var value = await seedr.getVideo(link);
    var eng = value["subtitles"]["English"];

    req.pipe(request.get(eng)).pipe(res);
  }
  catch (e) {
    res.send(e);
  }
}
catch (e) {
  res.send(e);
}
})


app.get('/seedr/stream', async function (req, res) {
  try{
    
  // const user = req.query.user
  // const pass = req.query.pass
 var hash = req.query.hash; // $_GET["id"]
 if(!hash){
  res.send('send hash lol');
 }
 if(hash.includes('/') || hash.includes('+') ) {
  res.send('send proper hash lol');
 }
 var objDec = encryptor.decrypt(hash);
 if(objDec['user'] && objDec['pass']){
 var user = objDec['user'];
 var pass = objDec['pass'];
 }
  const link = req.query.link
  try {
    var value = await init(user, pass, link);
    // res.pipe(request.get(value)).pipe(res);
    // res.send(value);
    var uri = value;
    res.writeHead(302, {
      'Location': uri
      //add other headers here...
    });
    res.end();

  }
  catch (e) {
    res.send(e);
  }
}
catch (e) {
  res.send(e);
}
})




app.get('/seedr/getall', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }

  try {
    var value = await getall(user, pass);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})




let getsettings = async (user, pass) => {
  if (!user) {
    user = "mandalbis1729@gmail.com";
  }

  if (!pass) {
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);
  return await seedr.getSettings();
  //

};



app.get('/seedr/getsettings', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }

  try {
    var value = await getsettings(user, pass);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})














app.get('/seedr/play', async function (req, res) {
  try{
  const id = req.query.id


  // const user = req.query.user
  // const pass = req.query.pass
 var hash = req.query.hash; // $_GET["id"]
 if(!hash){
  res.send('send hash lol');
 }
 if(hash.includes('/') || hash.includes('+') ) {
  res.send('send proper hash lol');
 }
 var objDec = encryptor.decrypt(hash);
 if(objDec['user'] && objDec['pass']){
 var user = objDec['user'];
 var pass = objDec['pass'];
 }


  const embed = req.query.embed
  try {
    var value = await play(id, user, pass);

    // res.send(value);
    if (embed == 1) {
      var uri = value['url_hls'];
      var eng = value["subtitles"]["English"];
      var pre = value["url_preroll"];

      res.send(
        `
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
								image: "${pre}",
					   // 		aspectratio: "16:9",
								// width: '100%',
					    		autostart: false,
				file : '${uri}',
        tracks:[{"file":"${eng}","label":"English","kind":"captions","default":"true"}],
				abouttext: 'FLIXY',
				aboutlink: 'http://flixy.ga'
						    })
					</script>
  </div>
  </body>
</html>
`

      );
    } else {
      var uri = value['url_hls'];
      res.writeHead(302, {
        'Location': uri
        //add other headers here...
      });
      res.end();
    }
    // var uri = value['url'];
    // res.writeHead(302, {
    //   'Location': uri
    //   //add other headers here...
    // });
    // res.end();

    // console.log(uri);

  }
  catch (e) {
    res.send(e);
  }
  // res.send(value);
}
catch (e) {
  res.send(e);
}
})


//seedr










//new seedr





app.get('/seedr/getfolders', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }else{
    user = "mandalbis1729@gmail.com";
    pass = "Bm782403";
  }
  
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);

  try {
    var value = await seedr.getFolders();
    res.send(value['folders']);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})




app.get('/seedr/getband', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }else{
    user = "mandalbis1729@gmail.com";
    pass = "Bm782403";
  }
  
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);

  try {
    var value = await seedr.getBandwidth();
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})




app.get('/seedr/deletefile', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  var id = req.query.id; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }else{
    user = "mandalbis1729@gmail.com";
    pass = "Bm782403";
  }
  
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);

  try {
    var value = await seedr.deleteFile(id);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})




app.get('/seedr/search', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  var query = req.query.query; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }else{
    user = "mandalbis1729@gmail.com";
    pass = "Bm782403";
  }
  
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);

  try {
    var value = await seedr.search(query);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})


app.get('/seedr/getinside', async function (req, res) {
  try{
  // const user = req.query.user
  // const pass = req.query.pass
  var hash = req.query.hash; // $_GET["id"]
  var id = req.query.id; // $_GET["id"]
  if(!hash){
    res.send('send hash lol');
   }
   if(hash.includes('/') || hash.includes('+') ) {
    res.send('send proper hash lol');
   }
  var objDec = encryptor.decrypt(hash);
  if(objDec['user'] && objDec['pass']){
  var user = objDec['user'];
  var pass = objDec['pass'];
  }else{
    user = "mandalbis1729@gmail.com";
    pass = "Bm782403";
  }
  
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user, pass);

  try {
    var value = await seedr.getFilesofFolders(id);
    res.send(value);
  }
  catch (e) {
    res.send(e);

  }
}
catch (e) {
  res.send(e);
}
})



//new seedr

























app.get('/video', function(req, res) {
  const path = 'assets/sample.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})









app.listen(process.env.PORT || 3000);

// asdadsadasdasddsadsad


// app.listen(3000, function () {
//   console.log('Listening on port 3000!')
// })
