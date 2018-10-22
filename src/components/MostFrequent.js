const mostFrequent = (arr) => {
  let max = 0;
  let mode = 0;
  let counter = 0;

  for(var i = 0; i < arr.length; i++){
    counter = 0;
    for (var j = 0; j < arr.length; j++)
    {
    if (arr[i] === arr[j]) {
      counter++
      if (counter > max) max = counter;
      mode = i;
    }    
  }
 }
 return arr[mode];
}
export default mostFrequent;