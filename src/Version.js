//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const SIMPLE_CLOCK_VERSION_MAJOR = 1;
const SIMPLE_CLOCK_VERSION_MINOR = 0;
const SIMPLE_CLOCK_VERSION_BABY  = 0;

//----------------------------------------------------------------------------//
// Public Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function GetVersion()
{
    return String_Cat(
        SIMPLE_CLOCK_VERSION_MAJOR, ".",
        SIMPLE_CLOCK_VERSION_MINOR, ".",
        SIMPLE_CLOCK_VERSION_BABY
    );
}
