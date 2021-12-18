var context = null;
var noteCount = 1
var timer, counting, accentPitch = 380,
    offBeatPitch = 200;
var delta = 0;
var curTime = 0.0;
var beat_count = 4;
var playPauseIcon = document.getElementById('play-pause-icon');
var playButton = document.getElementById('play-button');
var isrunning = false;
var api = null;
var notes = null;
var strings = null;

var arpeggios = []
arpeggios.push({ "family": "M", "intervals": [0, 4, 7] }) //Major
arpeggios.push({ "family": "m", "intervals": [0, 3, 7] }) //Minor
arpeggios.push({ "family": "dim", "intervals": [0, 3, 6] }) //Diminished
arpeggios.push({ "family": "aug", "intervals": [0, 4, 8] }) //Augmented
arpeggios.push({ "family": "7", "intervals": [0, 4, 7, 10] }) //Dominant
arpeggios.push({ "family": "M7", "intervals": [0, 4, 7, 11] }) //Major7
arpeggios.push({ "family": "m7", "intervals": [0, 3, 6, 10] }) //Minor7

var progression = [{ "note": "C", "family": "M" }, { "note": "C", "family": "M" }, { "note": "D", "family": "7" }, { "note": "D", "family": "7" }]


var progression_stage = 0

function updateProgessionDisplay() {

}

function progessionStageAssertEqual(current, next) {
    if (current.note == next.note && current.family = next.faily) {
        return true;
    } else {
        return false;
    }
}

playButton.addEventListener('click', function() {
    if (context == null) {
        context = new(window.AudioContext || window.webkitAudioContext)();
    }

    if (isrunning) {
        playPauseIcon.className = 'pause';
        isrunning = false;
        window.clearInterval(timer);
    } else {
        playPauseIcon.className = 'play';
        isrunning = true

        noteCount = 0
        curTime = context.currentTime;
        schedule();
    }

});

function semiTonesToNotes(rootNote, semiTonesArr) {
    notesArr = []
    for (const interval of semiTonesArr) {
        if (interval == 0) {
            notesArr.push(rootNote);
        } else {
            rootIndx = notes.indexOf(rootNote);
            if (rootIndx + interval <= 11) {

                notesArr.push(notes[rootIndx + interval])
            } else {
                notesArr.push(notes[rootIndx + interval - 12])
            }
        }
    }
    return notesArr
}

function findAllNotesOnString(stringIndix, notesArr) {
    var stringLeterIndex = notes.indexOf(strings[stringIndix].letter);
    var stringFret = 0;
    var goodFrets = []
    while (stringFret < 16) {
        if (stringLeterIndex + stringFret <= 11) {
            currentNote = notes[stringLeterIndex + stringFret]
        } else {
            rest = stringLeterIndex + stringFret - 12
            while (rest > 11) {
                rest = rest - 12;
            }
            currentNote = notes[rest]
        }


        if (notesArr.includes(currentNote)) {
            goodFrets.push(stringFret)
        }
        stringFret++;
    }
    return goodFrets;
}

function findRootOnString(stringIndix, rootNote) {
    var stringLeterIndex = notes.indexOf(strings[stringIndix].letter);
    var found = false;
    iterIndx = stringLeterIndex;
    semiTones = 0;
    while (!found) {
        if (notes[iterIndx] == rootNote) {
            found = true;
        } else {
            if (iterIndx < 11) {
                iterIndx++;
            } else {
                iterIndx = 0;
            }
            semiTones++;
        }

    }
    return semiTones;
}

function fillStringWithArpeggio(stringIndix, semiTonesArr, rootNote, cssClass) {
    arp_notes = semiTonesToNotes(rootNote, semiTonesArr);
    goodFrets = findAllNotesOnString(stringIndix, arp_notes)
    var notes = []
    for (const pos of goodFrets) {
        notes.push({ fret: pos, cssClass: "red" })
    }
    return notes;
}

function fillAllStrings(semiTonesArr, rootNote, cssClass = "red") {
    var arpeggio = []
    indx = 0
    for (const thisString of strings) {
        note_lst = fillStringWithArpeggio(indx, semiTonesArr, rootNote, cssClass)
        arpeggio.push({ string: thisString, notes: note_lst })
        indx++;
    }
    api.setClickedNotes(arpeggio);
}
// Load up dots on pageload
$("document").ready(function() {
    //https://github.com/fmodica/fretboard
    $(".my-fretboard-js").fretboard();
    api = $(".my-fretboard-js").data('api');
    api.setNoteClickingDisabled(true);
    api.setNoteMode("interval");
    strings = api.getTuning();
    notes = api.getNoteLetters();
    console.log(semiTonesToNotes("A", arpeggios[0].intervals))

    api.setRoot("G")
    fillAllStrings(arpeggios[0].intervals, "G", cssClass = "red")
});


/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule() {
    ctx_time = context.currentTime
    while (curTime < ctx_time + 0.1) {
        playNote(curTime);
        updateTime();

    }

    timer = window.setTimeout(schedule, 0.1);
}

function updateTime() {

    curTime += 60.0 / parseInt($("#tempo").text(), 10);

    if (noteCount == beat_count) {
        noteCount = 1;
        progression_stage++
    } else {
        noteCount++;
    }


}

/* Play note on a delayed interval of t */
function playNote(t) {
    if (noteCount == 1) {
        window.setTimeout(updateProgessionDisplay, 0.1);
    }
    var note = context.createOscillator();


    note.frequency.value = (noteCount % beat_count == 0) ? 1000 : 800;


    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);




}