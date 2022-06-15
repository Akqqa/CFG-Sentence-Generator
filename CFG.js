// Function for example buttons
function replace(type) {
	if (type == "sentence") {
  	document.getElementById("cfginput").value = "SENTENCE -> The NOUN | The NOUN VERB the NOUN | EPSILON\nNOUN -> cat | dog | frog | toad\nVERB -> jumps over | eats | kisses"
  } else if (type == "number") {
  	document.getElementById("cfginput").value = "SENTENCE -> REALEXP | INT\nREALEXP -> REALeINT | REAL\nREAL -> INT.UNSIGNED | INT\nINT -> -UNSIGNED | UNSIGNED\nUNSIGNED -> DIGIT | UNSIGNEDDIGIT\nDIGIT -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
  } else if (type == "expression") {
  	document.getElementById("cfginput").value = "SENTENCE -> TERM + SENTENCE | TERM - SENTENCE | TERM\nTERM -> SUBTERM * TERM | SUBTERM / TERM | SUBTERM ~ 1,1,2\nSUBTERM -> FACTOR ^ SUBTERM | FACTOR ~ 1,10\nFACTOR -> (SENTENCE) | -FACTOR | DIGIT ~ 1,2,4\nDIGIT -> 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
  }
}

// Build the grammar
function buildGrammar(cfginput) {
	var productions = {EPSILON : []};
  const nameregex = /^([A-Za-z]+) -> /
  const distregex = / ~ (([1-9]\d*,)*[1-9]\d*)/

  for (var prod of cfginput) {
    var found = prod.match(nameregex);
    if (found == null) {
    	continue;
    }
    
    var options = prod.replace(nameregex, "").replace(distregex, "").split(" | ");
    var probabilities = [];
    for (var option of options) {
    	probabilities.push(1);
    }
    
    // Checks for distributions
    var dist = prod.match(distregex);
    if (dist != null) {
    	probabilities = dist[1].split(",");
      probabilities = probabilities.map(prob => parseInt(prob));
    }
    
    // Error if user does not enter enough probabilities
    if (probabilities.length != options.length) {
    	return null;
    }
    
    var arr = [options, probabilities];
    
    productions[found[1]] = arr;
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
    
    if (startDate.getTime() - baseDate.getTime() > 1000) {
    	return "Error: Valid sentence taken too long to generate. Please check the CFG to ensure there are no infinite loops"
    }

    while (!finished) {
    	// Discards if taking too long to generate
      let endDate = new Date();
    	if (endDate.getTime() - startDate.getTime() > 50) {
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
        let lot = [];
        for (let i = 0; i < productions[match][0].length; i++) {
        	for (let j = 0; j < productions[match][1][i]; j++) {
          	lot.push(productions[match][0][i]);
          }
        }
        var replacement = lot[Math.floor(Math.random()*lot.length)];
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
  let sentence;
  if (!build) {
  	sentence = "Error: Grammar could not be parsed, please the number of probabilities match the number of productions in that rule."
  } else {
  	  sentence = generateSentence(build);
  }
  document.getElementById("generatedsentence").innerHTML = sentence;
}
