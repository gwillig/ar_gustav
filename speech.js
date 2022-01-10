///Button
/*jshint esversion: 4 */
/*jshint strict:false */



/// Variables for speech recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
//Add words from robot
    // Animation of the robot
const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
const mapping_robo = {"hallo":'Wave',"bye":'ThumbsUp',"tschüss":'ThumbsUp',"sitzen":"Sitting","stehen":"Standing",
                  "tanze":'Dance', "rennen":"Running","spring":"Jump","ja":"Yes","böse":"Punch","no":"No"}



function fillSelectMenu(){
    const select = document.getElementById("selectMenu");
    if (select.childElementCount<2){

        var options = Object.keys(mapping_robo)

        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }

}


const mapping_robo_keys = Object.keys(mapping_robo)
var grammar = '#JSGF V1.0; grammar words; public <words> = ' + mapping_robo_keys.join(' | ') + ' ;'
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

//===============
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'de';
recognition.interimResults = false;
recognition.maxAlternatives = 1;



function startSpeech() {

    const btn_speech = document.querySelector("#startSpeech")
    btn_speech.classList.add("blink_btn")
    recognition.start();

    console.log('Ready to receive a color command.');

}

recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var wordRaw = event.results[0][0].transcript;
    const word =  wordRaw.toLowerCase();
    const confidence = Math.round(event.results[0][0].confidence*100);

    console.log('Confidence: '+word+": " + event.results[0][0].confidence);
    document.querySelector("#recoSpeech").textContent=`${word}: ${confidence} % `
    let animation = mapping_robo[word]
    let emotion = {"morphtarget": "Sad", "value":0}
    let repetitions=3

    var vorstellen = ['vorstellen',"vorstellt","verstellen"];
    var goodbye=["tschüss","bye","gut"]
    var no = ["böse","sauer","gehen"]

    if (new RegExp(no.join('|')).test(word)){
        repetitions=1
        animation=mapping_robo["no"]
        emotion = {"morphtarget": "Sad", "value":2}
    }
   else if(new RegExp(vorstellen.join('|')).test(word)){
          animation=mapping_robo["ja"]

          emotion = {"morphtarget": "Surpise", "value":2}
    }
    else if(new RegExp(goodbye.join('|')).test(word)){
          animation=mapping_robo["tschüss"]
    }
    else {
        //If no word has been detected he will shake his head
        animation = 'No'
    }

    nextAnimation(animation,emotion,repetitions)

}

recognition.onspeechend = function() {
    recognition.stop();
    const btn_speech = document.querySelector("#startSpeech")
    btn_speech.classList.remove("blink_btn")
}

recognition.onnomatch = function(event) {
  console.log(event)
}

recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error)
}

function nextAnimation(animation,emotion,repetitions) {
    const model = document.getElementById('robot');

     model.setAttribute('animation-mixer', {
        clip:animation,
        loop: "repeat",
        repetitions:repetitions,
        timeScale:0.8,
        crossFadeDuration: 0.4

      });
    model.setAttribute("gltf-morph",emotion)
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function onSelect(e){
     nextAnimation(mapping_robo[e])


}


//https://www.8thwall.com/8thwall/morph-targets-aframe/code/body.html
const gltfMorphComponent = {
  multiple: true,
  schema: {
    morphtarget: {type: 'string', default: ''},
    value: {type: 'number', default: 0},
  },
  init() {
    this.el.addEventListener('object3dset', () => {
      this.morpher()
    })
  },
  update() {
    this.morpher()
  },
  morpher() {
    const mesh = this.el.object3D
    mesh.traverse((o) => {
      if (o.morphTargetInfluences && o.userData.targetNames) {
        const pos = o.userData.targetNames.indexOf(this.data.morphtarget)
        o.morphTargetInfluences[pos] = this.data.value
      }
    })
  },
}
AFRAME.registerComponent('gltf-morph', gltfMorphComponent)
