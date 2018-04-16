// Convert coordinates WGS 84 to CH 1903 
// Made by http://www.giangrandi.ch/soft/swissgrid/swissgrid.shtml
module.exports = (lat, lon, hgt) => {
    lat *= 3600;                                                // Convert latitude and longitude in seconds.
    lon *= 3600;

    lat -= 169028.66;                                           // Shift the origin in Bern.
    lon -= 26782.5;

    lat /= 10000;                                               // Convert latitude and longitude in 10000" units.
    lon /= 10000;

    var east = 600072.37;                                       // Calculate easting [m].
    east += 211455.93 * lon;
    east -= 10938.51 * lon * lat;
    east -= 0.36 * lon * lat * lat;
    east -= 44.54 * lon * lon * lon;

    var north = 200147.07;                                      // Calculate northing [m].
    north += 308807.95 * lat;
    north += 3745.25 * lon * lon;
    north += 76.63 * lat * lat;
    north -= 194.56 * lon * lon * lat;
    north += 119.79 * lat * lat * lat;

    hgt -= 49.55;                                               // Convert height [m].
    hgt += 2.73 * lon;
    hgt += 6.94 * lat;

    var returnObject = new Object();                            // Return new coordinates.
    returnObject.east = east;
    returnObject.north = north;
    returnObject.hgt = hgt;
    return returnObject;
};

