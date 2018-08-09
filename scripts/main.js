let cssLink = document.getElementById("css_link");

/*
	dictionary object that maps keys to numbers (for easy calculations).
	
	if e is found to be below f then change accordingly.
*/
const keyToNum = 
{
	"C": 0,
	"C#": 1,
	"D": 2,
	"D# (Eb)": 3,
	"E": 4,
	"F": -7,
	"F#": -6,
	"G": -5,
	"G# (Ab)": -4,
	"A": -3,
	"A# (Bb)": -2,
	"B": -1
};

const keyToNumKeys = Object.keys(keyToNum);




/*
	dictionary object. used in calculations.
*/
const numToNote = 
{
	N_NUM: "\n",
	SPACE_NUM: " ",
	TAB_NUM: "\t",
	0: "c",
	2: "d",
	4: "e",
	5: "f",
	7: "g",
	9: "a",
	11: "b",
	12: "C",
	14: "D",
	16: "E",
	17: "F",
	19: "G",
	21: "A",
	23: "B"
};

const numToNoteKeys = Object.keys(numToNote);
/*
	i_		input (left side)
	o_		output (right side)
	dd		dropdown (html select tag)
*/
const i_dd = document.getElementById("dropdown_0");
const o_dd = document.getElementById("dropdown_1");
const dnBtn = document.getElementById("day_night_btn");

const NIGHT_MODE_STR = "nightMode";
const SUN_CHAR = "☼";
const MOON_CHAR = "☾";
let nightMode = true;


/*
	function activates when you click the button between the two textareas (as of now text is an arrow pointing right
	but might change later). this function handles all the good stuff. 
*/
function convert()
{
    /*
        i_		input (left side)
        o_		output (right side)
        ta		textarea
    */
	let i_ta = document.getElementById("input_textarea");
	let o_ta = document.getElementById("output_textarea");
	
	if (i_ta === null || o_ta === null || i_dd === null || o_dd === null)
	{
		alert("something is null that shouldn't be null");
		return;
	}
	
	/*
		str		string in textarea
		keyStr	musical key, which we get from the dd
	*/
	let i_str = i_ta.value;
	let o_str = "";
	let i_keyStr = i_dd.value;
	let o_keyStr = o_dd.value;
	
	/*
		keyShift	number variable representing how much we adjust the values in i_notes by
		i_notes		array of input musical notes converted to numbers
		rejects		stuff that we couldn't parse
	*/
	let keyShift = keyToNum[o_keyStr] - keyToNum[i_keyStr];
	let i_notes = [];
	let rejects = "";
	
	const SPACE_NUM = Symbol("SPACE");
	const N_NUM = Symbol("N");
	const TAB_NUM = Symbol("TAB");
	
	for (let i = 0; i < i_str.length; i++)
	{
		switch (i_str[i])
		{
			case "#":
				i_notes[i_notes.length-1]++;
				break;
			case "!":
				i_notes[i_notes.length-1] += 12;
				break;
			case " ":
				i_notes.push(SPACE_NUM);	//cannot put these in for-loop since numToNote[SPACE_NUM] === undefined
				break;
			case "\t":
				i_notes.push(TAB_NUM);
				break;
			case "\n":
				i_notes.push(N_NUM);
				break;
			default:
                let k = numToNoteKeys.find(key => numToNote[key] === i_str[i]);
				
				if (k === undefined)
				{
					rejects += i_str[i] + "\n";
				}
				else
				{
					i_notes.push(Number(k));
				}
				
				break;
		}
	}
	
	let o_notes = i_notes.map((i)=>
	{
		if (i === N_NUM || i === SPACE_NUM || i === TAB_NUM)
			return i;
		else
			return i + keyShift;
	});
	
	//if this boolean is true, something is wrong with the input (or the code but probably the input)
	let outOfRangeFlag = false;
	
	o_notes.forEach((n)=>
	{
		//note that the below commented line would output "false", hence the need for the inelegant if-else blocks following
		//console.log(numToNote[N_NUM] === numToNote.N_NUM);
		
		let nextStr;
		
		if (n === SPACE_NUM)
			nextStr = numToNote.SPACE_NUM;
		else if (n === N_NUM)
			nextStr = numToNote.N_NUM;
		else if (n === TAB_NUM)
			nextStr = numToNote.TAB_NUM;
		else
		{
			nextStr = numToNote[n];
			
			if (nextStr === undefined)
			{
				nextStr = numToNote[n-12];
				
				if (nextStr === undefined)
				{
					nextStr = numToNote[n-1];
					
					if (nextStr === undefined)
					{
						nextStr = numToNote[n-13];
						
						if (nextStr === undefined)
						{
							outOfRangeFlag = true;
							nextStr = "?";
						}
						else
						{
							nextStr += "#!";
						}
					}
					else
					{
						nextStr += "#";
					}
				}
				else
				{
					nextStr += "!";
				}
			}
		}
		
		o_str += nextStr;
	});
	
	o_ta.value = o_str;
	
	if (rejects !== "")
	{
		let alertMsg = "Conversion complete. The following input characters couldn't be parsed:\n\n" + rejects;
		
		if (outOfRangeFlag)
			alertMsg += "\n\nAdditionally, some input items were out of range. They have been marked with question marks in the output.";
		
		alert(alertMsg);
	}
	else if (outOfRangeFlag)
		alert("Conversion complete. Some input items were out of range. They have been marked with question marks in the output.");
}



/*
	function called when button with double-headed arrow is clicked. swaps contents of the two html
	select elements.
*/
function swap()
{
	[i_dd.value, o_dd.value] = [o_dd.value, i_dd.value];
}

/*
	toggles between day mode and night mode.
*/
function dayNight()
{
	nightMode = !nightMode;
	applyDayNightMode(nightMode);
}

function applyDayNightMode(nm)
{
	localStorage.setItem(NIGHT_MODE_STR, String(nm));
	
	if (nm)
	{
		dnBtn.value = SUN_CHAR;
		cssLink.href = "CSS/main.css";
	}
	else
	{
		dnBtn.value = MOON_CHAR;
		cssLink.href = "CSS/day.css";
	}
}


//add eventlistener to buttons
document.getElementById("swap_btn").addEventListener("click", swap);
document.getElementById("convert_btn").addEventListener("click", convert);
dnBtn.addEventListener("click", dayNight);

//populates html select dropdown boxes via the cool new Option api instead of innerHTML
keyToNumKeys.forEach(key => {
    i_dd.add(new Option(key));
    o_dd.add(new Option(key));
});

//checks localstorage for preferred mode (day or night) then acts accordingly
nightMode = (localStorage.getItem(NIGHT_MODE_STR) === "false"? false : true);
applyDayNightMode(nightMode);