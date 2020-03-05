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
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR   = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY    = 60 * 60 * 24;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let hours   = 0;
let minutes = 0;
let seconds = 0;
let total_time;
let date = new Date();


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
    }
    // Portrait
    else {
        Canvas_CreateCanvas(800 * ratio, 800, parent);
    }

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";


    //
    // Configure the values
    hours   = date.getHours  ();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    total_time = hours   * SECONDS_IN_HOUR
               + minutes * SECONDS_IN_MINUTE
               + seconds;

    Canvas_Draw(0);
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow();
    Canvas_SetStrokeSize(10);
    Canvas_SetStrokeStyle("white");

    total_time += dt;

    let sin    = (1 + Math.sin(seconds / 60 * Math.PI)) / 2;
    let radius = 80 + (sin * 60);

    seconds = (total_time % SECONDS_IN_MINUTE);
    minutes = (total_time % SECONDS_IN_HOUR  ) / SECONDS_IN_MINUTE;
    hours   = (total_time % SECONDS_IN_DAY   ) / SECONDS_IN_HOUR;
    if(hours > 12) {
        hours -= 12;
    }

    //
    // Arcs.
    Draw_Arc(seconds, 60, radius + 00, "#FF0000", "#FF000020");
    Draw_Arc(minutes, 60, radius + 20, "#00FF00", "#00FF0020");
    Draw_Arc(hours,   12, radius + 40, "#0000FF", "#0000FF20");

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
//     main_title        : "Simple Clock",
//     main_date         : "Jul 17, 2019",
//     main_version      : "v0.0.1",
//     main_instructions : "",
//     main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
// });
