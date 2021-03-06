/// <reference path='utils/_getNoteFromDecimal.ts' />
/// <reference path='utils/_getKeyOffset.ts' />
/// <reference path='utils/GetNoteFromNumber.ts' />
/// <reference path='utils/Modes.ts' />
/// <reference path='utils/_getNoteDuration.ts' />
/// <reference path='utils/generateDuration.ts' />
/// <reference path='modules/Buffer.ts' />

declare var Synth:any
declare var $:any

var piano = Synth.createInstrument('piano')

this.addEventListener('modeDataLoaded', init)

	// properties
	let notes = 8
	let tempo = 120
	let key = 'C'
	let verses = 3
	let repeats = 4
	let turnaround = 0
	let durations:String[] = ['quarter']

	// utils
	let buffer, currentNote
	let generateDuration = new GenerateDuration()


function init(){

	playSong()	
}



function playSong(){
	currentNote = 0
	if(turnaround < (verses * repeats)){
		if(turnaround % repeats == 0){
			buffer = new Buffer()
			playTurnaround(false)
		} else {			
			playTurnaround(true)				
		}
	}
	turnaround++		
}

function playTurnaround($isRepeat){
	let note
	let duration
	
  if(!$isRepeat){
    let randomNote = Math.random() * 7
    
  	note = Modes.getNoteInterval('ionian', randomNote)
    duration = (60 / tempo) * (1 / generateDuration.getRandomDuration(durations)) * 1000
    console.log('duration: ' + duration)
    
    buffer.appendNote(randomNote, duration)
  } else {
    note = Modes.getNoteInterval('ionian', buffer.getNoteAtIndex(currentNote % notes)[0])
    duration = buffer.getNoteAtIndex(currentNote % notes)[1]
    console.log('retrived note: ' + note + ', duration: ' + duration)
  }
  
  // if(!duration) let newDuration = Math.random()
  piano.play(getNoteFromNumber(key, note), 2, duration / 1000)
	
	setTimeout(function(){
		if(notes > currentNote){
			playTurnaround($isRepeat)
		} else {
			playSong()
		}
	}, duration)

	currentNote++
}