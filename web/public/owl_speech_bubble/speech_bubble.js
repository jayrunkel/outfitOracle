function owl_drawBubble(ctx, width, height, birdHeight)
{
    width=parseInt(width);
    height=parseInt(height);
    birdHeight=parseInt(birdHeight);

    const radius=birdHeight/40;
    const minHeight=birdHeight/3;
    const tailHeight=birdHeight/20;
    const tailWidth=tailHeight*1.5;
    const bottom=(height<=minHeight+radius)? minHeight:height;
    const maxWidth=300; // Maximum width you want for the bubble
    const border=2;

    const box_upper_left={ x: tailWidth, y: border };
    const box_upper_right={ x: Math.min(width, maxWidth)-border, y: border };
    const box_lower_left={ x: tailWidth, y: bottom-border };
    const box_lower_right={ x: Math.min(width, maxWidth)-border, y: bottom-border };



    // Start drawing at (0, minHeight)
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.lineWidth=2;
    ctx.moveTo(tailWidth, minHeight);
    //straight line for the tail
    ctx.lineTo(border, minHeight);
    // Diagonal line for the tail
    ctx.lineTo(tailWidth, minHeight-tailHeight);

    // left line
    ctx.lineTo(tailWidth, box_upper_left.y+radius);
    ctx.quadraticCurveTo(box_upper_left.x, box_upper_left.y, box_upper_left.x+radius, box_upper_left.y);

    // top line
    ctx.lineTo(box_upper_right.x-radius, box_upper_right.y);
    ctx.quadraticCurveTo(box_upper_right.x, box_upper_right.y, box_upper_right.x, box_upper_right.y+radius);

    // right line
    ctx.lineTo(box_lower_right.x, box_lower_right.y-radius);
    ctx.quadraticCurveTo(box_lower_right.x, box_lower_right.y, box_lower_right.x-radius, box_lower_right.y);

    // bottom line
    ctx.lineTo(box_lower_left.x+radius, box_lower_left.y);
    ctx.quadraticCurveTo(box_lower_left.x, box_lower_left.y, tailWidth, bottom-radius);

    // line back to the tail
    ctx.closePath();

    // Stroke the bubble
    ctx.stroke();
}

var owl_instance=null;

function owl_animateText(text, duration)
{
    window.clearInterval(owl_instance);
    const speechText=document.getElementById('owl_speechText');
    speechText.innerHTML=''; // Clear existing text

    // If duration is 0, display all characters in black
    if (duration===0) {
        speechText.innerHTML=text.split('').map(char => `<span style="color: black;">${char}</span>`).join('');
        return;
    }

    // Else, proceed with animation
    text.split('').forEach(char =>
    {
        let span=document.createElement('span');
        span.textContent=char;
        span.style.color='white';
        speechText.appendChild(span);
    });


    let currentChar=0;
    const intervalTime=(duration*1000)/text.length; // Time per character

    owl_instance=setInterval(() =>
    {
        if (currentChar<text.length) {
            //check if speechText.children[ currentChar ] exists
            if (speechText.children[ currentChar ]!==null) {
                (speechText.children[ currentChar ]||{}).style.color='black';
                currentChar++;
            }
        } else {
            window.clearInterval(owl_instance);
        }
    }, intervalTime);

}


function owl_displayMessage(text, duration)
{
    var textArea=text;
    var speechText=document.getElementById('owl_speechText');
    var canvas=document.getElementById('owl_canvas1');
    var dimensions=owl_calculateTextDimensions(textArea);
    var birdHeight=300;
    var tailHeight=birdHeight/20;
    var tailWidth=tailHeight*1.5;

    // Adjust speechText size

    speechText.style.width=parseInt(dimensions.width)+'px';
    speechText.style.height=parseInt(dimensions.height)+'px';
    speechText.style.paddingTop=parseInt(dimensions.topMargin)+'px';
    speechText.innerText=textArea;

    duration=(duration==null||String(duration)==""||duration<0)? textArea.length/25:parseFloat(duration)

    if (textArea.trim()!=='') {
        if (canvas.getContext) {
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0, 0, birdHeight, birdHeight);
            owl_drawBubble(ctx, parseInt(dimensions.width)+tailWidth+tailWidth, parseInt(dimensions.height)+tailHeight, birdHeight); // Adjust as needed
        }

        owl_animateText(textArea, duration||0);
    } else {
        if (canvas.getContext) {
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0, 0, birdHeight, birdHeight);
        }
        speechText.innerHTML='';
    }
}

// Function to calculate the dimensions of the text
function owl_calculateTextDimensions(text)
{
    const maxWidth=300-30; // Maximum width you want for the bubble
    const maxHeight=300-20; // Maximum height you want for the bubble
    const charWidth=12; // Approximate width of a character
    const lineHeight=19; // Line height
    const minHeight=300/3; // Minimum height of the bubble

    const charsPerLine=Math.floor(maxWidth/charWidth);
    const lineCount=text.split("\n").reduce((count, line) =>
    {
        return count+Math.ceil(line.length/charsPerLine);
    }, 0);
    // calc top margin using (min height/line height ) - (number of lines) * line height
    const fillSpace=(minHeight/lineHeight-lineCount)/2
    const topMargin=((fillSpace*lineHeight)>(lineHeight*1.4))? fillSpace*lineHeight:0;

    // calculate the longest line by number of characters
    const longestLineLength=text.split("\n").reduce((max, line) =>
    {
        return Math.max(max, line.length);
    }, 0);

    const actualWidth=Math.min(maxWidth, charsPerLine*charWidth, longestLineLength*charWidth);
    const actualHeight=Math.max(minHeight, Math.min(lineCount*lineHeight, maxHeight));
    /*console.log("actualWidth: "+actualWidth);
    console.log("actualHeight: "+actualHeight);*/

    return { width: actualWidth, height: actualHeight, topMargin: topMargin };
}

// only display if owl_textBox is found
if (document.getElementById('owl_textBox')) {
    // Event listeners and initial setup
    document.getElementById('owl_autoDuration').addEventListener('change', function ()
    {
        var durationInput=document.getElementById('owl_duration');
        durationInput.disabled=this.checked;
        if (this.checked) {
            durationInput.value='';
        }
    });

    window.onload=function ()
    {
        const urlParams=new URLSearchParams(window.location.search);
        const text=urlParams.get('owl_text');
        if (text) {
            document.getElementById('owl_textBox').value=text;
            owl_displayMessage(owl_displayMessage(document.getElementById('owl_textBox').value, document.getElementById('owl_duration').value));
        }
        var linkElement=document.createElement("link");
        linkElement.rel="stylesheet";
        linkElement.href="/owl_speech_bubble/speech_bubble.css"; //Replace here

        document.head.appendChild(linkElement);

    };
} 
