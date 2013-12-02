// ==UserScript==
// @name       svtplay.se batch download helper
// @namespace  https://github.com/plainas
// @version    0.1
// @description  This will add a minimal UI on top of svtplay.se providing a simple way to save the contents of all the available sreams. You can choose the bitrate.
// @match      http://www.svtplay.se/*
// @copyright  2013+, Plainas
// ==/UserScript==    


var output_div = document.createElement('div');
output_div.id = "output_div";
output_div.innerHTML = "";
output_div.style.zIndex = "100000";
output_div.style.backgroundColor = "#D6FFE4";
output_div.style.position = "absolute";
output_div.style.padding = "15px";
output_div.style.top = "0px";
output_div.style.left = "0px";
output_div.style.margin='20px';
output_div.style.backgroundColor = "white";
output_div.innerHTML = '';
output_div.style.display = "none";

//just grabbing a random div to insert stuff before
var early_div = document.getElementsByClassName("playGlobalHeader")[0];
document.body.insertBefore(output_div,early_div);
 
var patch_url_with_bitrate_piece = function(url){
	var bitrate_key = document.querySelector('input[name="g"]:checked').value;
    return url.replace('master', bitrate_key);
};

var clean_filename = function(raw_filename){
	return raw_filename.replace(/[^\w\-öäå]/gi, '_');
};

var get_detils_from_json_reply = function(response){
	var reply_ob = JSON.parse(response.responseText);
    var v_url = reply_ob.video.videoReferences[1].url;
    var video_ob = {};
    video_ob.video_url = patch_url_with_bitrate_piece(v_url.match(/^.*?m3u8/)[0]);
    video_ob.filename = clean_filename(reply_ob.context.title);
    return video_ob;
}

var process_video_json_reply = function(response){
    var video_details = get_detils_from_json_reply(response);
    //console.log(video_details);
	//var v_url = stream_json_to_url(response);
    var dload_cmd = "ffmpeg -i " + video_details.video_url + " -acodec copy -vcodec copy -absf aac_adtstoasc "+ video_details.filename +".mp4";
    output_div.innerHTML = output_div.innerHTML + "\n<br>" + dload_cmd;    
};


var do_the_crazy_stuff = function(){
    var a_elements_nodelist = document.querySelectorAll("a.playLink");
    var a_elements_array = Array.prototype.slice.call(a_elements_nodelist);
    var hrefs_array = a_elements_array.map(function(a){return a.href;});
    var urls_json = hrefs_array.map(function(url){var rurl = url + "?output=json"; return rurl;});
    output_div.innerHTML = output_div.innerHTML + '<br><br>';
	for(var i=0; i< urls_json.length;i++){
        GM_xmlhttpRequest({
            method: "GET",
            url: urls_json[i],
            onload: process_video_json_reply
        });
	}
};

var showUI = function(){
	var s_output_div = document.getElementById("output_div");
    s_output_div.style.display = "block";
    var UI = '<h1>svtplay.se batch download helper</h1>\
		<p>Click choose the bitrate and click the link below.<br>\
		Only those episodes that are presently on the list will be saved.<br>\
		Click "visa fler" to load more.</p><br>\
        <h2>Choose bitrate</h2>\
        <input type="radio" name="g" value="index_4_av">2791 kbps<br>\
        <input type="radio" name="g" value="index_3_av" checked>1675 kbps<br>\
        <input type="radio" name="g" value="index_0_av">983 kbps<br>\
        <input type="radio" name="g" value="index_2_av">561 kbps<br>\
        <input type="radio" name="g" value="index_2_av">345 kbps<br><br>\
        <a id="do_magic" href="#" style="color:#44F"> click here to get the download script<a>';
    output_div.innerHTML = UI;
    document.getElementById("do_magic").onclick=do_the_crazy_stuff;
};

showUI();



