$(document).ready(function(){
	// Ricky
	$("#ricky").click(function(){
			$("#dialogo").fadeIn(1000);
			$("#contenidoDialogo").fadeIn(1500);
	});
	$("#dialogo").click(function(){
		$("#dialogo").fadeOut(1500);
		$("#contenidoDialogo").fadeOut(1500);
	});
	
	// Pan Background
	$("#musicEqualizer").pan({fps:24, speed:5, direction:"right"});
	$("#ricky").sprite({fps:4, no_of_frames:4});
	$("#loading").hide();
	
	// super commenter - to be used to decide what to do with comment
	
	var admin = "Kudos Ideas";  
	var mediaId = "71212117";//14567535 //71212117 //64441170
	var apiKey = "297aeedf702a22bba252d2b6a091960d";
	var duration = 1016; // change this later for flexibility - the issue is that we don't know the duration until the track has completely loaded            
	
	// support checks  
	
	var cssTransitionsSupport = Modernizr.csstransitions;   
	var audioTagSupport = !!(document.createElement('audio').canPlayType);    
	
	if (audioTagSupport == false ) {
		$('#commentOutput').text('Unfortunatley your browser does not support audio natively and so this demo will not run. Upgrade to the latest version of your browser for the best experience.'); 
		$('#destructions').text('Houston we have a problem!');
	} else if (cssTransitionsSupport ==  false) {
		$('#commentOutput').text('This demo features effects that rely on CSS3 transitions, which your browser does not support. Upgrade to the latest version of your browser for the best experience.');
	}
	
	       
	// Hide the URL bar for iPhone / iPad         
	
	addEventListener("load", function(){
		setTimeout(updateLayout, 0);
	}, false);   
	
    function updateLayout(){
		if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) 
		{
			//setTimeout("window.scrollTo(0, 14)", 0);	
			setTimeout(function(){
				window.scrollTo(0, 1);
			}, 100);     
		}
	}

	
	// load transcript - @maboa 
	// and wait until it is in place before doing anything
	$(document).ready(
		function(){
			setup();
		}
	);   

	var client_id = '?client_id='+apiKey;                  
	var myPlayer = $("#jquery_jplayer_1");  
	  
	// 
	
	function setup() { 

		$.ajax({
			url: "http://api.soundcloud.com/tracks/"+mediaId+".json" + client_id,
			dataType: 'jsonp',
			success: function(data) {

				myPlayer.jPlayer({
					ready: function (event) {
						$(this).jPlayer("setMedia", {
							mp3: "http://api.soundcloud.com/tracks/"+mediaId+"/stream?client_id="+apiKey,
							oga: "http://api.soundcloud.com/tracks/"+mediaId+"/download?client_id="+apiKey,
						});
						
						if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
						       myPlayer.jPlayer("play");
						}
					},
					swfPath: "js/libs", // Not important for HTML only solution.
					// solution: "html",
					supplied: "mp3,oga",
					cssSelectorAncestor: "",
					cssSelector: {
						play: ".jp-play",
						pause: ".jp-pause",
						seekBar: "#waveform .jp-seek-bar",
						playBar: "#waveform .jp-play-bar"
					},
					preload: "none"
				});

				$("#waveform-img").attr("src", data.waveform_url);
			}
		});
		
		
		SCsearch('Good Time For Psy Saxobeat Style');
	   
	} 

	// transcript links to audio
	
	$('#transcript').delegate('span','click',function(){  
		var jumpTo = $(this).attr('m')/1000; 

		myPlayer.jPlayer("play",jumpTo);    

		return false;
	});    
	
	$('.jp-restart').click( function() {
		myPlayer.jPlayer("play", 0);
		return false;
	});
	
	//Input Search
	
	$('#SCsearch').keyup(function () { $('#SCsearch').val().length > 3? SCsearch( $('#SCsearch').val() ) : SCsearch( "" ); });

});

	function SCsearch( question ){
		if (question == "") return;
		
		SC.initialize({
                  client_id: '297aeedf702a22bba252d2b6a091960d'
                });
		// find all sounds of buskers licensed under 'creative commons share alike'
		SC.get('/tracks', { q: question }, function(tracks) {
			
			console.log(tracks);
		      
		      var obj = tracks;
		      
		      $('#SCresultados').html("");
		      
		      $.each(obj, function(i, item) {
			      $('#SCresultados').html( $('#SCresultados').html() + "<div class='music' onclick='SoundCloudReload("+obj[i].id+");' style:'cursor:pointer;'><img src='"+ obj[i].artwork_url +"' /><b>Nombre:</b>" + obj[i].title + "Descarga: <a href='" + obj[i].permalink_url +"' target='_blank'>Descarga</a></div>");
			      $(".track-"+obj[i].id).click({id: obj[i].id},SoundCloudReload);
			      //alert(data[i].PageName);
		      });
		});
	}

// Change Music
	function SoundCloudReload( id ){
		
		$("#loading").show();
		
		var mediaId = "71212117";//14567535 //71212117 //64441170
		var apiKey = "297aeedf702a22bba252d2b6a091960d";
		
		var client_id = '?client_id='+apiKey;                  
		var myPlayer = $("#jquery_jplayer_1");
		myPlayer.jPlayer("destroy");
		//myPlayer.jPlayer("clearMedia");
		
		mediaId = id;
		//alert(mediaId);

		$.ajax({
			url: "http://api.soundcloud.com/tracks/"+mediaId+".json" + client_id,
			dataType: 'jsonp',
			success: function(data) {

				myPlayer.jPlayer({
					ready: function (event) {
						$(this).jPlayer("setMedia", {
							mp3: "http://api.soundcloud.com/tracks/"+mediaId+"/stream?client_id="+apiKey,
							oga: "http://api.soundcloud.com/tracks/"+mediaId+"/download?client_id="+apiKey,

							//mp3: data.stream_url + client_id,
							//oga: data.download_url + client_id
						});
						
						if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
						       myPlayer.jPlayer("play");
						}
					},
					swfPath: "js/libs", // Not important for HTML only solution.
					// solution: "html",
					supplied: "mp3,oga",
					cssSelectorAncestor: "",
					cssSelector: {
						play: ".jp-play",
						pause: ".jp-pause",
						seekBar: "#waveform .jp-seek-bar",
						playBar: "#waveform .jp-play-bar"
					},
					preload: "none"
				});
					
					$("#loading").hide();
					
					$("#waveform-img").attr("src", data.waveform_url);
				}
		});
		
		return false;
	}