// ==UserScript==
// @name       Memedroid barebones
// @namespace  http://lamehacks.net/
// @version    0.1
// @description  Maximum eficiency rocrastination. Browse memedroid.com's images only. Press spacebar or lef arrow key to move to next image.
// @match      http://www.memedroid.com/
// @copyright  Seriously???
// ==/UserScript==


document.body.style.textAlign = 'center';
var images = Array.prototype.slice.call(document.querySelectorAll('.image-meme img'));
var urlNextPage = document.querySelector('.next a').href;

var showNext = function(){
    console.log('ueoh');
    if (images.length == 0){
        getNextPage();
    }
    else{
    	document.body.innerHTML = images.shift().outerHTML;
    }
}

var getNextPage = function(){
    console.log(urlNextPage);
	GM_xmlhttpRequest({
      method: "GET",
      url: urlNextPage,
      onload: function(response) {
          var newPageEl = document.createElement('div');
			newPageEl.innerHTML = response.responseText;
			images = Array.prototype.slice.call(newPageEl.querySelectorAll('.image-meme img'));
            console.log(images);
          	urlNextPage = newPageEl.querySelector('.next a').href;
            document.body.innerHTML = images.shift().outerHTML;
      }
    });
}

function doc_keyUp(e) {
    console.log(e.keyCode);
    if (e.keyCode == 32 || e.keyCode == 39) {
        showNext();
    }
}
 
document.addEventListener('keyup', doc_keyUp, false);
