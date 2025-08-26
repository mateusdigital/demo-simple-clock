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
//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/gif.js/gif.js",

    "/modules/demolib/source/demolib.js",
];

//------------------------------------------------------------------------------
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

let text_size = null;
let text_size_width = 0;
let text_color = "white";
let text_font  = "50px Arial";

let text_scale_hack = 0.5;

//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Draw_Arc(value, maxValue, radius, color_a, color_b)
{
    // The shadow arc.
    set_canvas_stroke(color_b);
    draw_arc(0, 0, radius, 0, Math.PI * 2);

    // The actual arc.
    set_canvas_stroke(color_a);
    let s = map_values(value, 0, maxValue, -Math.PI/2, (2 * Math.PI) - Math.PI/2);

    draw_arc(0, 0, radius, -Math.PI/2, s, false);
}



//------------------------------------------------------------------------------
function estimate_text_width_hack(text, font_size)
{
    text_scale_hack = 0.45;
    const avg_char_width = text_scale_hack * font_size;
    return text.length * avg_char_width;
}

//------------------------------------------------------------------------------
function recalculate_sizes()
{
    const screen_size = Math.min(get_canvas_width(), get_canvas_height());
    base_radius = screen_size * 0.5 * CLOCK_SIZE_MULTIPLIER;

    const ctx = get_main_canvas_context();
    const diagonal = base_radius * 1.5;
    const tolerance = 2;

    let min = 10;
    let max = 500;

    const text_to_measure = "99 : 99 : 99";
    while (max - min > tolerance) {
        let curr = (min + max) / 2;
        ctx.font = `${curr}px Arial`;

        text_size = ctx.measureText(text_to_measure);
        if(text_size.width == 0) {
            text_size_width = estimate_text_width_hack(text_to_measure, curr);
        } else {
            var a = estimate_text_width_hack(text_to_measure, curr);
            console.log(a, text_size.width);
            text_size_width = text_size.width;
        }
        var a = estimate_text_width_hack(text_to_measure, curr);
        console.log(a, text_size.width);

        let gap = text_size_width - diagonal;

        if (gap < 0) {
            min = curr;
        } else {
            max = curr;
        }
    }

    text_font = `${min}px Arial`;
}


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_standalone_mode()
{
    return new Promise((resolve, reject)=>{
        demolib_load_all_scripts(__SOURCES).then(()=> { // Download all needed scripts.
            // Create the standalone canvas.
            const canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);

            // Setup the listener for gif recording.
            gif_setup_listeners();

            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_main_canvas(canvas);
    set_canvas_fill("white");
    set_canvas_line_width(STROKE_SIZE);

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

    recalculate_sizes();

    translate_canvas_to_center();
    start_draw_loop(draw);
}


//------------------------------------------------------------------------------
function demo_main(user_canvas)
{
    // No canvas, meanings that we are standalone (fullscreen) mode.
    if(!user_canvas) {
        setup_standalone_mode().then((canvas)=>{
            setup_common(canvas);
        });
    }
    // We got a canvas, meaning that we are running in embedded mode.
    else {
        // Resize the canvas to the size of the container.
        const container    = user_canvas.parentElement;
        user_canvas.width  = container.clientWidth;
        user_canvas.height = container.clientHeight;

        setup_common(user_canvas);
    }
}

//------------------------------------------------------------------------------
function draw(dt)
{
    clear_canvas();

    begin_draw();

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
        Draw_Arc(hours,   12, base_radius -  0, "#0000FF", "#0000FF20");

        //
        // Timer.
        var str = "";
        {
            let h = to_int(hours  );
            let m = to_int(minutes);
            let s = to_int(seconds);

            str +=         ((h < 10) ? "0" + h : h);
            str += " : " + ((m < 10) ? "0" + m : m);
            str += " : " + ((s < 10) ? "0" + s : s);
        }

        const ctx = get_main_canvas_context();

        ctx.font      = text_font;
        ctx.fillStyle = text_color;
        ctx.fillText(str, -text_size_width * text_scale_hack, text_size_width * 0.05);
    end_draw();
}
