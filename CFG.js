var examplegrammar = ["SENTENCE -> The NOUN | The NOUN VERB the NOUN | EPSILON",
								"NOUN -> cat | dog | frog | toad",
                "VERB -> jumps over | eats | kisses"];

// Build the grammar
function buildGrammar(cfginput) {
	var productions = {};
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
	var sentence = "SENTENCE";
  let allproductions = Object.keys(productions);
  let prodregex = new RegExp(allproductions.join("|") + "|EPSILON");
  
  let finished = false;
  while (!finished) {
  	let match = sentence.match(prodregex);
    if (match == null) {
    	finished = true;
      break;
    } else if (match == "EPSILON") {
    	sentence = sentence.replace("EPSILON", "");
    } else {
    	var replacement = productions[match][Math.floor(Math.random()*productions[match].length)];
      sentence = sentence.replace(match, replacement);
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

//console.log(generateSentence(buildGrammar(grammar)));
