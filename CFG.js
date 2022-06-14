// Function for example buttons
function replace(type) {
	if (type == "sentence") {
  	document.getElementById("cfginput").value = "SENTENCE -> The NOUN | The NOUN VERB the NOUN | EPSILON\nNOUN -> cat | dog | frog | toad\nVERB -> jumps over | eats | kisses"
  } else if (type == "number") {
  	document.getElementById("cfginput").value = "SENTENCE -> REALEXP | INT\nREALEXP -> REALeINT | REAL\nREAL -> INT.UNSIGNED | INT\nINT -> -UNSIGNED | UNSIGNED\nUNSIGNED -> DIGIT | UNSIGNEDDIGIT\nDIGIT -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
  } else if (type == "expression") {
  	document.getElementById("cfginput").value = "SENTENCE -> TERM + SENTENCE | TERM - SENTENCE | TERM\nTERM -> SUBTERM * TERM | SUBTERM / TERM | SUBTERM\nSUBTERM -> FACTOR ^ SUBTERM | FACTOR\nFACTOR -> (SENTENCE) | -FACTOR  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
  }
}

// Build the grammar
function buildGrammar(cfginput) {
	var productions = {EPSILON : []};
  const nameregex = /^([A-Za-z]+) -> /

  for (var prod of cfginput) {
    var found = prod.match(nameregex);
    if (found == null) {
    	continue;
    }
    var options = prod.replace(nameregex, "").split(" | ");
    productions[found[1]] = options;
	}
  
  return productions;
}

// Generate random sentence
function generateSentence(productions) {
  let allproductions = Object.keys(productions);
  // Sorts in reverse alphabetical order to ensure longer names containing the same starts as other names come first
  // E.G realexp should come before real as otherwise the "real" would be matched with the regex, instead of realexp as a whole
  allproductions.sort();
	allproductions.reverse();
  let prodregex = new RegExp(allproductions.join("|"));
  let generating = true;
  let baseDate = new Date();
  
  while (generating) {
  	var sentence = "SENTENCE";
  
    let finished = false;
    const startDate = new Date();
    
    console.log(baseDate.getTime() - startDate.getTime());
    if (startDate.getTime() - baseDate.getTime() > 1000) {
    	return "Error: Valid sentence taken too long to generate. Please check the CFG to ensure there are no infinite loops"
    }

    while (!finished) {
    	// Discards if taking too long to generate
      let endDate = new Date();
    	if (endDate.getTime() - startDate.getTime() > 50) {
        console.log("abort");
      	break;
      }
    
      let match = sentence.match(prodregex);
      if (match == null) {
        finished = true;
        generating = false;
        break;
      } else if (match == "EPSILON") {
        sentence = sentence.replace("EPSILON", "");
      } else {
        var replacement = productions[match][Math.floor(Math.random()*productions[match].length)];
        sentence = sentence.replace(match, replacement);
      }
    }
  }
	
  return sentence;
}

// Event handler
function generate() {
	let grammar = document.getElementById("cfginput").value.split(/\r?\n/)
  let build = buildGrammar(grammar);
  let sentence = generateSentence(build);
  console.log(sentence);
  document.getElementById("generatedsentence").innerHTML = sentence;
}
