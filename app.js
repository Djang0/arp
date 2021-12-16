
var context=null;
var timer, noteCount, counting, accentPitch = 380, offBeatPitch = 200;
var delta = 0;
var curTime = 0.0;
var beat_count=4;
var playPauseIcon = document.getElementById('play-pause-icon');
var playButton = document.getElementById('play-button');
var isrunning = false;
playButton.addEventListener('click', function() {
    if (context == null)
        {
            context = new (window.AudioContext || window.webkitAudioContext)();
        }

    if (isrunning) {
        playPauseIcon.className = 'pause';
        isrunning = false;
        window.clearInterval(timer);
    }
    else {
        playPauseIcon.className = 'play';
        isrunning=true
        
        noteCount=0
        curTime = context.currentTime;
        schedule();
    }

});
// Load up dots on pageload
$("document").ready(function() {

const fretboard = new Fretboard({
  el: '#fretboard',
  fretColor: 'blue',
  dotFill: 'red'
});

fretboard.setDots([
  {
    string: 5,
    fret: 3,
  },
  {
    string: 4,
    fret: 2,
  },
  {
    string: 2,
    fret: 1,
  },
]);

fretboard.render();

	//$(".ts-top").trigger("change");
//$("header").fitText(1, { maxFontSize: "46px" });
});


/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule() {
	ctx_time=context.currentTime
	$("#colordiv").attr("style", "");

	$("#colordiv").css({
		
		background: "#F75454"
	});
	while(curTime < ctx_time + 0.1) {
		playNote(curTime);
		updateTime();
	
	}

	timer = window.setTimeout(schedule, 0.1);
}

function updateTime() {
	
	curTime += 60.0 / parseInt($("#tempo").text(), 10);
	
	noteCount++;
	
}

/* Play note on a delayed interval of t */
function playNote(t) {
	
	var note = context.createOscillator();


	note.frequency.value = (noteCount % beat_count == 0) ? 1000 : 800;
	

	note.connect(context.destination);

	note.start(t);
	note.stop(t + 0.05);
if(noteCount == beat_count ){
					$("#colordiv").attr("style", "");

		$("#colordiv").css({
			
			background: "yellow"
		});
		noteCount = 0;
		}
	
	
}