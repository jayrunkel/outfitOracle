# Owl Speech Bubble

Send it words, and I'll talk to you!

## implementation
- Copy the owl_speech_bubble directory to your web root
- Add the CSS into the `<head>`
```html    
<link rel="stylesheet" href="./owl_speech_bubble/speech_bubble.css">
```
- Add this Code into the `<body>`
```html
<div id="owl_parentContainer">
    <img class="owl_owlImage" src="./owl_speech_bubble/owl.jpeg" alt="Owl">
    <div id="owl_bubble">
    <canvas id="owl_canvas1" width="400px" height="400px"></canvas>
    <div id="owl_speechText"></div>
    </div>
</div>
<script src="./owl_speech_bubble/speech_bubble.js"></script>
```
- Have your code call:
```javascript
owl_displayMessage("This is a message");
```

## configuration
- there's an optional duration (in seconds) that can be passed to speed up or slow down the animation:
```javascript
owl_displayMessage("This is a message",10); //10 seconds
owl_displayMessage("This is a message",0);  //Instant
```
- the default container size is 800x400, but this can be adjusted in the css and js files as well as the canvas you embedded in the html  -- just do a find and replace of 400
