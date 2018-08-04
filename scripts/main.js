/*
	add all event listeners programatically
	check out html select tag
*/

let dropdownIsVisible = [false, false];


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
	function activates when you click the button between the two textareas (as of now text is ">>>"
	but might change later). this function handles all the good stuff. 
*/
function convert()
{
	/*
		i_		input (left side)
		o_		output (right side)
		ta		textarea
		dd		dropdown (only refers to the main button of the dropdown (class is dropdown_main))
	*/
	let i_ta = document.getElementById("input_textarea");
	let o_ta = document.getElementById("output_textarea");
	let i_dd = document.getElementById("dropdown_b0");
	let o_dd = document.getElementById("dropdown_b1");
	
	if (i_ta === null || o_ta === null || i_dd === null || o_dd === null)
	{
		alert("something is null that shouldn't be null");
		return;
	}
	
	/*
		str		string in textarea
		keyStr	musical key, which we get from the dd button's text
	*/
	let i_str = i_ta.value;
	let o_str = "";
	let i_keyStr = i_dd.value[0] + (i_dd.value[1] === "#"? "#":"");
	let o_keyStr = o_dd.value[0] + (o_dd.value[1] === "#"? "#":"");
	
	/*
		dictionary object that maps keys to numbers (for easy calculations).
		
		NOTE TO SELF: TODO: NTS:
		if it's found that e is actually below f then should change accordingly. make
		sure code still works because i haven't confirmed it does.
	*/
	let keyToNum = 
	{
		"F": -7,
		"F#": -6,
		"G": -5,
		"G#": -4,
		"A": -3,
		"A#": -2,
		"B": -1,
		"C": 0,
		"C#": 1,
		"D": 2,
		"D#": 3,
		"E": 4
	};
	
	/*
		keyShift	number variable representing how much we adjust the values in i_notes by
		i_notes		array of input musical notes converted to numbers
		rejects		stuff that we couldn't parse
	*/
	let keyShift = keyToNum[o_keyStr] - keyToNum[i_keyStr];
	let i_notes = [];
	let rejects = "";
	
	const SPACE_NUM = Symbol(-9000);
	const N_NUM = Symbol(-9001);
	const TAB_NUM = Symbol(-9002);
	
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

//makes dropdown either appear or disappear. parameter indicates which dropdown is affected.
function toggleDropdown(whichDropdown)
{
	let menu;
	
	if (whichDropdown === 0)
	{
		menu = document.getElementById("dropdown0");
	}
	else if (whichDropdown === 1)
	{
		menu = document.getElementById("dropdown1");
	}
	else
	{
		console.log("which drop down");
		return;
	}
	
	if (dropdownIsVisible[whichDropdown])
	{
		menu.style.display = "none";
	}
	else
	{
		menu.style.display = "block";
	}
	
	dropdownIsVisible[whichDropdown] = !dropdownIsVisible[whichDropdown];
}

//function activates when an option from a dropdown is clicked.
function dropdownOptionClicked(whichDropdown, whichButton)
{
	let dropdownMain;
	
	if (whichDropdown === 0)
	{
		dropdownMain = document.getElementById("dropdown_b0");
	}
	else if (whichDropdown === 1)
	{
		dropdownMain = document.getElementById("dropdown_b1");
	}
	else
	{
		console.log("which drop down");
		return;
	}
	
	dropdownMain.value = whichButton;
	toggleDropdown(whichDropdown);
}