//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Simple_Clock.js                                               //
//  Project   : simple_clock                                                  //
//  Date      : 17 Jul, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//   Displays a simple digital / analog clock.                                //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const SECONDS_IN_MINUTE     = 60;
const SECONDS_IN_HOUR       = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY        = 60 * 60 * 24;
const STROKE_SIZE           = 10;
const CLOCK_SIZE_MULTIPLIER = 0.9;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let hours       = 0;
let minutes     = 0;
let seconds     = 0;
let total_time  = 0;
let prev_date   = null;
let base_radius = 0;


//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Draw_Arc(value, maxValue, radius, color_a, color_b)
{
    // The shadow arc.
    Canvas_SetStrokeStyle(color_b);
    Canvas_DrawArc(0, 0, radius, 0, Math.PI * 2);

    // The actual arc.
    Canvas_SetStrokeStyle(color_a);
    let s = Math_Map(value, 0, maxValue, -Math.PI/2, (2 * Math.PI) - Math.PI/2);

    Canvas_DrawArc(0, 0, radius, -Math.PI/2, s, false);
}

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{

    //
    // Configure the Canvas.
    const parent        = document.getElementById("canvas_div");
    const parent_width  = parent.clientWidth;
    const parent_height = parent.clientHeight;

    const max_side = Math_Max(parent_width, parent_height);
    const min_side = Math_Min(parent_width, parent_height);

    const ratio = min_side / max_side;

    // Landscape
    if(parent_width > parent_height) {
        Canvas_CreateCanvas(800, 800 * ratio, parent);
        base_radius = Canvas_Half_Height - STROKE_SIZE;
    }
    // Portrait
    else {
        Canvas_CreateCanvas(800 * ratio, 800, parent);
        base_radius = Canvas_Half_Width - STROKE_SIZE;
    }
    base_radius *= CLOCK_SIZE_MULTIPLIER;

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";

    //
    // Add the information.
    const info = document.createElement("p");
    info.innerHTML = String_Cat(
        "Simple Clock", "<br>",
        "Jul 17, 2019", "<br>",
        GetVersion(),   "<br>",
        "<a href=\"http://stdmatt.com/demos/simple_clock.html\">More info</a>"
    );
    parent.appendChild(info);

    //
    // Configure the values
    date = new Date();
    hours   = date.getHours  ();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    total_time = hours   * SECONDS_IN_HOUR
               + minutes * SECONDS_IN_MINUTE
               + seconds;
    prev_date = Date.now();
    Canvas_Draw(0);
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow();
    Canvas_SetStrokeSize(STROKE_SIZE);
    Canvas_SetStrokeStyle("white");

    const curr_date = Date.now();
    total_time += (curr_date - prev_date) / 1000;
    prev_date = curr_date;

    seconds = (total_time % SECONDS_IN_MINUTE);
    minutes = (total_time % SECONDS_IN_HOUR  ) / SECONDS_IN_MINUTE;
    hours   = (total_time % SECONDS_IN_DAY   ) / SECONDS_IN_HOUR;
    if(hours > 13) {
        hours -= 12;
    }

    //
    // Arcs.
    Draw_Arc(seconds, 60, base_radius - 40, "#FF0000", "#FF000020");
    Draw_Arc(minutes, 60, base_radius - 20, "#00FF00", "#00FF0020");
    Draw_Arc(hours,   12, base_radius - 00, "#0000FF", "#0000FF20");

    //
    // Timer.
    var str = "";
    {
        let h = Math_Int(hours  );
        let m = Math_Int(minutes);
        let s = Math_Int(seconds);

        str +=         ((h < 10) ? "0" + h : h);
        str += " : " + ((m < 10) ? "0" + m : m);
        str += " : " + ((s < 10) ? "0" + s : s);
    }

    CurrContext.font      = "30px Arial";
    CurrContext.fillStyle = "white";
    CurrContext.fillText(str, -CurrContext.measureText(str).width/2, 0);
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup();
// Canvas_Setup({
// });
