function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomUpper() {
  const ascii = getRandomInt(65, 91);
  return String.fromCharCode(ascii);
}

function generateRandomLower() {
  const ascii = getRandomInt(97, 122);
  return String.fromCharCode(ascii);
}

function generateRandomString() {
  let result = ''
  let dice;
  for(let i = 0; i < 7; i++) {
    dice = getRandomInt(0, 3)
    switch (dice) {
      case 0:
        result += String(getRandomInt(0, 10));
        break;
      case 1:
        result += generateRandomUpper();
        break;
      default:
        result += generateRandomLower();
    }
  }
  return result;
}


console.log(generateRandomString());

