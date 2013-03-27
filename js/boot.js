var arrow = 'L';

$(document).ready(function(){
	// Ricky
	$("#ricky").click(function(){
			$("#dialogo").fadeIn(1000);
			$("#contenidoDialogo").fadeIn(1500);
	});
	//click
	$("#click").click(function(){
			$("#click").fadeOut(1000);
	});	
	$("#dialogo").click(function(){
		$("#dialogo").fadeOut(1000);
		$("#contenidoDialogo").fadeOut(1000);
	});
	$("#nowPlaying").click(function(){
			$("#nowPlaying").fadeOut(1000);
	});
	// Pan Background
	$("#musicEqualizer").pan({fps:24, speed:3, direction:"right"});
	$("#ricky").sprite({fps:4, no_of_frames:4});
	
	$("#loading").hide();
	
	$('#icono').click(function() {
		$('#panelContenido').animate({width: 'toggle'});
		if ( arrow == 'R'){
			$('#icono').css("background-image", "url(images/arrowL.png)"); 
			arrow = 'L';
		}else {
			$('#icono').css("background-image", "url(images/arrowR.png)"); 
			arrow = 'R';
		}
	});
	
	// configuracion de la cuenta de Soundcloud
	
	var admin = "Kudos Ideas";  
	var mediaId = "85095617";//14567535 //71212117 //64441170
	var apiKey = "297aeedf702a22bba252d2b6a091960d";
	var duration = 1016; // change this later for flexibility - the issue is that we don't know the duration until the track has completely loaded            
	
	// support checks  
	
	var cssTransitionsSupport = Modernizr.csstransitions;   
	var audioTagSupport = !!(document.createElement('audio').canPlayType);    
	
	if (audioTagSupport == false ) {
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

	
	
	$(document).ready(
		function(){
			setup();
		}
	);   

	var client_id = '?client_id='+apiKey;                  
	var myPlayer = $("#jquery_jplayer_1");  
	  
	// 
	
	function setup() { 

		SCsearch('diego landa');
		
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
	
	$('#SCbusqueda').keyup(function () { $('#SCbusqueda').val().length > 3? SCsearch( $('#SCbusqueda').val() ) : SCsearch( "" ); });

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
				var imgSrc = "images/no-cover.jpg";
				if (obj[i].artwork_url != null)
					imgSrc = obj[i].artwork_url;
				
				var contenido = "";
				contenido += "<b>Nombre: </b>" + obj[i].title;
				contenido += "<br/><a href='#"+obj[i].user.username+"' onclick='setTag("+obj[i].id+")'>Mostrar Info</a>";
				$('#SCresultados').html( $('#SCresultados').html() + "<div class='music' id='sc-"+obj[i].id+
							"' sc-artista='"+obj[i].user.username+"' sc-titulo='"+obj[i].title+"' sc-link='"+obj[i].permalink_url+"'>"+
							"<img src='"+ imgSrc +"' onclick='SoundCloudReload("+obj[i].id+");'/><div class='contenido' style='cursor:auto;'>"+contenido+"</div>" );
				//$(".track-"+obj[i].id).click({id: obj[i].id},SoundCloudReload);
				//alert(data[i].PageName);
		      });

		});
	}

	function setTag(id){
		$('#nowPlaying').fadeOut(1);
		artist = $('#sc-'+id).attr('sc-artista');
		link = $('#sc-'+id).attr('sc-link');
		song = $('#sc-'+id).attr('sc-titulo');
		$('#nowPlaying').html("Artista: "+artist+"<br/><a href='"+link+"' target='_blank'>"+song+"</a>");
		$('#nowPlaying').fadeIn(1000);
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
					setTag(mediaId);
					$("#loading").hide();
					
					$("#waveform-img").attr("src", data.waveform_url);
				}
		});
		
		return false;
	}