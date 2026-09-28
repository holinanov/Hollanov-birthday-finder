// ======================================================
// ORIGINAL ILYA ALGORITHM
// Used only to determine which birthdays previously matched
// ======================================================

function getOldIlyaIndex(month, day) {
  const seed = `${month}-${day}`;

  let hash = 2166136261;

  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  hash >>>= 0;

  return hash % 31;
}


// ======================================================
// DAYS PER MONTH
// Leap year included = 366 birthdays
// ======================================================

const daysInMonth = {
  1: 31,
  2: 29,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};


// ======================================================
// HOLLANOV RESULTS
// Replace ONLY the text values with your own captions.
// Each picture is permanently connected to its text.
// ======================================================

const hollanovResults = [
  {
    image: "pics/hollanov1.png",
    text: "Hollanov having a very sweet but sad moment at the cottage"

  },
  {
    image: "pics/hollanov2.png",
    text: "Hollanov's first public kiss"
  },
  {
    image: "pics/hollanov3.png",
    text: "Hollanov when they spend the night together"
  },
  {
    image: "pics/hollanov4.png",
    text: "Hollanov being massively pent up"
  },
  {
    image: "pics/hollanov5.png",
    text: "Hollanov getting drafted (Shane is not mad at all)"
  },
  {
    image: "pics/hollanov6.png",
    text: "Hollanov touching tips(fingertips)"
  },
  {
    image: "pics/hollanov7.png",
    text: "Hollanov being all cute and cuddly(also Ilya looking ready to kill for this moment)"
  },
  {
    image: "pics/hollanov8.png",
    text: "Hollanov fighting and then making out- I mean making up."
  },
  {
    image: "pics/hollanov9.png",
    text: "Hollanov first meeting(cutie babies)"
  },
  {
    image: "pics/hollanov10.png",
    text: "Hollanov at all stars(do you think they dressed Shane in all white because he was going to see his future husband?)"
  },
  {
    image: "pics/hollanov11.png",
    text: "Hollanov's hottest kiss(I will not argue over this talk to the wall)"
  },
  {
    image: "pics/hollanov12.png",
    text: "Hollanov when they became Jane and Lily"
  },
  {
    image: "pics/hollanov13.png",
    text: "Hollanov trying out for different sports⚽️"
  },
  {
    image: "pics/hollanov14.png",
    text: "Hollanov standing bulge to butt (trust!) making burgers"
  },
  {
    image: "pics/hollanov15.png",
    text: "Hollanov when he is just the bellboy and you can't treat him like this(he's exactly where he wants to be)"
  },
  {
    image: "pics/hollanov16.png",
    text: "Hollanov when Ilya calls Shane his lover(ew Ilya, those are his parents)"
  },
  {
    image: "pics/hollanov17.png",
    text: "Hollanov always gotta make everything a competition"
  },
  {
    image: "pics/hollanov18.png",
    text: "Hollanov first hookup in process of being scheduled"
  },
  {
    image: "pics/hollanov19.png",
    text: "Hollanov but first let me make a selfie😜"
  },
  {
    image: "pics/hollanov20.png",
    text: "Hollanov being boyfriends for 40 seconds and this motherfucker is already pissing Shane off(that their kink tho don't worry)"
  },
  {
    image: "pics/hollanov21.png",
    text: "Hollanov casually eating tuna melts, life is perfect nothing can go wrong🙂"
  },
  {
    image: "pics/hollanov22.png",
    text: "Hollanov as heated rivals"
  },
  {
    image: "pics/hollanov23.png",
    text: "Hollanov realising mid making love they were maybe possibly a bit reckless"
  },
  {
    image: "pics/hollanov24.png",
    text: "Hollanov pulling up like this"
  }
];



// ======================================================
// CREATE ALL 366 BIRTHDAYS IN CALENDAR ORDER
// ======================================================

const birthdays = [];

for (let month = 1; month <= 12; month++) {
  for (let day = 1; day <= daysInMonth[month]; day++) {
    birthdays.push({
      month,
      day,
      oldIlyaIndex: getOldIlyaIndex(month, day)
    });
  }
}


// ======================================================
// GROUP BIRTHDAYS BY THEIR OLD ILYA RESULT
// ======================================================

const oldIlyaGroups = Array.from(
  { length: 31 },
  () => []
);

birthdays.forEach((birthday, calendarIndex) => {
  oldIlyaGroups[birthday.oldIlyaIndex].push(calendarIndex);
});


// ======================================================
// NEW BALANCED HOLLANOV DISTRIBUTION
//
// RULES:
//
// 1. Old Ilya matches cannot remain matches.
//
// 2. Consecutive calendar days cannot match.
//
// 3. Every Hollanov occurs either 15 or 16 times.
//
// 4. Assignment always stays the same after refresh.
// ======================================================

const assignments = new Array(birthdays.length).fill(null);

const resultCounts = new Array(24).fill(0);


// Process the largest old Ilya groups first.

const groupsInOrder = oldIlyaGroups
  .map((group, oldIndex) => ({
    group,
    oldIndex
  }))
  .sort((a, b) => b.group.length - a.group.length);


groupsInOrder.forEach(({ group, oldIndex }) => {

  // Hollanovs already used inside this old Ilya group.
  const usedInsideGroup = new Set();


  group.forEach((calendarIndex) => {

    const forbidden = new Set(usedInsideGroup);


    // Do not allow the previous calendar day to match.

    if (
      calendarIndex > 0 &&
      assignments[calendarIndex - 1] !== null
    ) {
      forbidden.add(
        assignments[calendarIndex - 1]
      );
    }


    // Do not allow the next calendar day to match
    // if it has already been assigned.

    if (
      calendarIndex < birthdays.length - 1 &&
      assignments[calendarIndex + 1] !== null
    ) {
      forbidden.add(
        assignments[calendarIndex + 1]
      );
    }


    // Find every Hollanov we are allowed to use.

    const availableResults = [];

    for (let result = 0; result < 24; result++) {
      if (!forbidden.has(result)) {
        availableResults.push(result);
      }
    }


    // Pick whichever valid Hollanov currently has
    // been used the least.
    //
    // The second calculation provides a deterministic
    // tie-breaker so the order is not simply 1,2,3,4...

    availableResults.sort((a, b) => {

      if (resultCounts[a] !== resultCounts[b]) {
        return resultCounts[a] - resultCounts[b];
      }

      const scoreA =
        (a * 7 + oldIndex * 11 + calendarIndex) % 24;

      const scoreB =
        (b * 7 + oldIndex * 11 + calendarIndex) % 24;

      return scoreA - scoreB;
    });


    const chosenResult =
      availableResults[0];


    assignments[calendarIndex] =
      chosenResult;

    resultCounts[chosenResult]++;


    // Nobody from this old Ilya group
    // can receive this Hollanov again.

    usedInsideGroup.add(
      chosenResult
    );
  });
});


// ======================================================
// CREATE BIRTHDAY LOOKUP
// ======================================================

const hollanovAssignments = {};

birthdays.forEach((birthday, calendarIndex) => {

  const key =
    `${birthday.month}-${birthday.day}`;

  hollanovAssignments[key] =
    assignments[calendarIndex];
});


// ======================================================
// GET HOLLANOV RESULT
// ======================================================

function getHollanovIndex(month, day) {

  const key =
    `${month}-${day}`;

  return hollanovAssignments[key];
}


// ======================================================
// HTML ELEMENTS
// ======================================================

const monthInput =
  document.getElementById("month");

const dayInput =
  document.getElementById("day");

const showButton =
  document.getElementById("showHollanov");

const resultText =
  document.getElementById("resultText");

const hollanovImage =
  document.getElementById("hollanovImage");

const shareButton =
  document.getElementById("shareTwitter");


// ======================================================
// DEFAULT PAGE
// ======================================================

resultText.textContent =
  "What Hollanov will come to your birthday party?";

hollanovImage.src = "";

hollanovImage.style.display =
  "none";


// ======================================================
// POPULATE DAYS
// ======================================================

monthInput.addEventListener("change", () => {

  const month =
    parseInt(monthInput.value, 10);


  dayInput.innerHTML =
    '<option value="">--</option>';


  if (!month || !daysInMonth[month]) {
    return;
  }


  for (
    let day = 1;
    day <= daysInMonth[month];
    day++
  ) {

    const option =
      document.createElement("option");

    option.value = day;

    option.textContent = day;

    dayInput.appendChild(option);
  }
});


// ======================================================
// SHOW RESULT
// ======================================================

showButton.addEventListener("click", () => {

  const month =
    parseInt(monthInput.value, 10);

  const day =
    parseInt(dayInput.value, 10);


  if (!month || !day) {

    resultText.textContent =
      "What Hollanov will come to your birthday party?";

    hollanovImage.src = "";

    hollanovImage.style.display =
      "none";

    return;
  }


  const index =
    getHollanovIndex(month, day);


  const result =
    hollanovResults[index];


  resultText.textContent =
    result.text;


  hollanovImage.src =
    result.image;


  hollanovImage.style.display =
    "block";
});


// ======================================================
// TWITTER SHARE
// ======================================================

shareButton.addEventListener("click", () => {

  if (
    hollanovImage.style.display === "none"
  ) {
    return;
  }


  const text =
    resultText.textContent;


  const url =
    window.location.href;


  const twitterUrl =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;


  window.open(
    twitterUrl,
    "_blank"
  );
});


// ======================================================
// OPTIONAL CHECK IN BROWSER CONSOLE
// ======================================================

console.log(
  "Hollanov result counts:",
  resultCounts
);