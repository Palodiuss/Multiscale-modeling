const generateColor = () => {
  var cssHSL = "hsl(" + 360 * Math.random() + ',' +
               (25 + 70 * Math.random()) + '%,' + 
               (60 + 30 * Math.random()) + '%)';   
  return cssHSL;
}
export default generateColor
