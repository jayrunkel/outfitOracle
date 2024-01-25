function drawBubble(ctx, width, height, birdHeight)
{
    width=parseInt(width);
    height=parseInt(height);
    birdHeight=parseInt(birdHeight);

    const radius=birdHeight/40;
    const minHeight=birdHeight/3;
    const tailHeight=birdHeight/20;
    const tailWidth=tailHeight*1.5;
    const bottom=(height<=minHeight+radius)? minHeight:height;
    const maxWidth=400; // Maximum width you want for the bubble
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


function animateText(text, duration)
{
    const speechText=document.getElementById('speechText');
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

    const interval=setInterval(() =>
    {
        if (currentChar<text.length) {
            speechText.children[ currentChar ].style.color='black';
            currentChar++;
        } else {
            clearInterval(interval);
        }
    }, intervalTime);
}


function displayMessage()
{
    var textArea=document.getElementById('textBox');
    var speechText=document.getElementById('speechText');
    var canvas=document.getElementById('canvas1');
    var dimensions=calculateTextDimensions(textArea.value);
    var birdHeight=400;
    var tailHeight=birdHeight/20;
    var tailWidth=tailHeight*1.5;

    // Adjust speechText size
    speechText.style.width=parseInt(dimensions.width)+'px';
    speechText.style.height=parseInt(dimensions.height)+'px';
    speechText.style.paddingTop=parseInt(dimensions.topMargin)+'px';
    speechText.innerText=textArea.value;




    if (textArea.value.trim()!=='') {
        if (canvas.getContext) {
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0, 0, birdHeight, birdHeight);
            drawBubble(ctx, parseInt(dimensions.width)+tailWidth+tailWidth, parseInt(dimensions.height)+tailHeight, birdHeight); // Adjust as needed
        }

        var autoDurationChecked=document.getElementById('autoDuration').checked;
        var durationInput=document.getElementById('duration');
        var duration=autoDurationChecked? textArea.value.length/35:parseFloat(durationInput.value);
        animateText(textArea.value, duration||0);
    } else {
        if (canvas.getContext) {
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0, 0, birdHeight, birdHeight);
        }
        speechText.innerHTML='';
    }
}

// Function to calculate the dimensions of the text
function calculateTextDimensions(text)
{
    const maxWidth=370; // Maximum width you want for the bubble
    const maxHeight=390; // Maximum height you want for the bubble
    const charWidth=12; // Approximate width of a character
    const lineHeight=14; // Line height
    const minHeight=400/3; // Minimum height of the bubble

    const charsPerLine=Math.floor(maxWidth/charWidth);
    const lineCount=text.split("\n").reduce((count, line) =>
    {
        return count+Math.ceil(line.length/charsPerLine);
    }, 0);

    // calc top margin using (min height/line height ) - (number of lines) * line height
    const topMargin=Math.max(0, (minHeight/lineHeight-lineCount)/2*lineHeight);

    // calculate the longest line by number of characters
    const longestLineLength=text.split("\n").reduce((max, line) =>
    {
        return Math.max(max, line.length);
    }, 0);

    const actualWidth=Math.min(maxWidth, charsPerLine*charWidth, longestLineLength*charWidth);
    const actualHeight=Math.max(minHeight, Math.min(lineCount*lineHeight, maxHeight));

    return { width: actualWidth, height: actualHeight, topMargin: topMargin };
}


// Event listeners and initial setup
document.getElementById('autoDuration').addEventListener('change', function ()
{
    var durationInput=document.getElementById('duration');
    durationInput.disabled=this.checked;
    if (this.checked) {
        durationInput.value='';
    }
});

window.onload=function ()
{
    const urlParams=new URLSearchParams(window.location.search);
    const text=urlParams.get('text');
    if (text) {
        document.getElementById('textBox').value=text;
        displayMessage();
    }

};
