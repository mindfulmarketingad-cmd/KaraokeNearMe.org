export type Region = "Northeast" | "Midwest" | "South" | "West";

export interface State {
  name: string;
  slug: string;
  abbr: string;
  region: Region;
  capital: string;
  cities: string[];
  intro: string;
}

// All 50 states plus the District of Columbia. Capitals and major cities are
// factual reference data; the intro for each state is original editorial
// content describing the local karaoke landscape.
export const states: State[] = [
  {
    name: "Alabama",
    slug: "alabama",
    abbr: "AL",
    region: "South",
    capital: "Montgomery",
    cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"],
    intro:
      "Karaoke in Alabama blends Southern hospitality with a relaxed bar-room atmosphere. Birmingham and Huntsville anchor the state's most active scenes, with weekly host-led nights at neighborhood pubs and sports bars, while Gulf-adjacent Mobile leans into a livelier, late-night crowd.",
  },
  {
    name: "Alaska",
    slug: "alaska",
    abbr: "AK",
    region: "West",
    capital: "Juneau",
    cities: ["Anchorage", "Fairbanks", "Juneau", "Wasilla", "Sitka"],
    intro:
      "Despite its remoteness, Alaska sustains a surprisingly committed karaoke community centered in Anchorage and Fairbanks. Long winter nights make warm, song-filled bars a popular gathering point, and many venues run karaoke several nights a week to draw a steady local crowd.",
  },
  {
    name: "Arizona",
    slug: "arizona",
    abbr: "AZ",
    region: "West",
    capital: "Phoenix",
    cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Tempe", "Chandler"],
    intro:
      "Arizona's karaoke scene is concentrated across the Phoenix metro and Tucson, where the climate keeps nightlife busy year-round. Tempe and Scottsdale cater to a younger, college and resort crowd, while private-room karaoke and traditional bar nights both have a strong following.",
  },
  {
    name: "Arkansas",
    slug: "arkansas",
    abbr: "AR",
    region: "South",
    capital: "Little Rock",
    cities: ["Little Rock", "Fayetteville", "Fort Smith", "Springdale", "Jonesboro"],
    intro:
      "In Arkansas, karaoke is a fixture of neighborhood bars and grills, especially in Little Rock and the fast-growing northwest corridor around Fayetteville. Expect friendly, community-driven nights where regulars and newcomers share the microphone.",
  },
  {
    name: "California",
    slug: "california",
    abbr: "CA",
    region: "West",
    capital: "Sacramento",
    cities: [
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "San Jose",
      "Sacramento",
      "Oakland",
      "Long Beach",
    ],
    intro:
      "California offers one of the deepest and most varied karaoke landscapes in the country. Los Angeles is known for its Koreatown private-room KTV lounges, San Francisco and the Bay Area host eclectic bar nights, and San Diego balances beachside venues with downtown destinations.",
  },
  {
    name: "Colorado",
    slug: "colorado",
    abbr: "CO",
    region: "West",
    capital: "Denver",
    cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
    intro:
      "Colorado pairs an active outdoor culture with a lively after-hours bar scene. Denver leads the state for karaoke, with both private rooms and host-run nights, while Boulder and Fort Collins bring an energetic college-town crowd to the microphone.",
  },
  {
    name: "Connecticut",
    slug: "connecticut",
    abbr: "CT",
    region: "Northeast",
    capital: "Hartford",
    cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Norwalk"],
    intro:
      "Connecticut's karaoke nights thrive in its dense corridor of small cities. New Haven's student population fuels weeknight events, while Hartford, Stamford, and the shoreline towns offer dependable weekend karaoke at pubs and restaurants.",
  },
  {
    name: "Delaware",
    slug: "delaware",
    abbr: "DE",
    region: "South",
    capital: "Dover",
    cities: ["Wilmington", "Dover", "Newark", "Rehoboth Beach"],
    intro:
      "Compact but social, Delaware concentrates its karaoke around Wilmington and the university town of Newark, with seasonal beach venues in Rehoboth bringing a summer surge of singers along the coast.",
  },
  {
    name: "Florida",
    slug: "florida",
    abbr: "FL",
    region: "South",
    capital: "Tallahassee",
    cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Tallahassee"],
    intro:
      "Florida's nightlife runs year-round, and karaoke is everywhere from Miami's late-night lounges to Orlando's tourist-friendly bars. Tampa and Jacksonville maintain strong local followings, and the state's mix of residents and visitors keeps song lists diverse.",
  },
  {
    name: "Georgia",
    slug: "georgia",
    abbr: "GA",
    region: "South",
    capital: "Atlanta",
    cities: ["Atlanta", "Augusta", "Savannah", "Athens", "Columbus", "Macon"],
    intro:
      "Georgia's karaoke heart is Atlanta, where private KTV rooms and packed bar nights both flourish. The college energy of Athens and the historic charm of Savannah add their own character, making the state a rewarding place to find a stage.",
  },
  {
    name: "Hawaii",
    slug: "hawaii",
    abbr: "HI",
    region: "West",
    capital: "Honolulu",
    cities: ["Honolulu", "Hilo", "Kailua", "Kaneohe", "Waipahu"],
    intro:
      "Karaoke is woven deeply into Hawaii's social culture, with Honolulu home to numerous private-room karaoke boxes reflecting strong Japanese and Korean influences. Singing with friends in a reserved room is a beloved local pastime across the islands.",
  },
  {
    name: "Idaho",
    slug: "idaho",
    abbr: "ID",
    region: "West",
    capital: "Boise",
    cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Coeur d'Alene"],
    intro:
      "Idaho's growing capital, Boise, anchors a friendly karaoke scene of brewpubs and neighborhood bars. Resort areas and northern towns like Coeur d'Alene add seasonal nights that draw both locals and visitors.",
  },
  {
    name: "Illinois",
    slug: "illinois",
    abbr: "IL",
    region: "Midwest",
    capital: "Springfield",
    cities: ["Chicago", "Aurora", "Naperville", "Springfield", "Peoria", "Rockford"],
    intro:
      "Illinois is defined by Chicago's expansive karaoke culture, from divey neighborhood favorites to dedicated private-room venues. Beyond the city, college towns and suburban pubs keep the tradition alive across the state.",
  },
  {
    name: "Indiana",
    slug: "indiana",
    abbr: "IN",
    region: "Midwest",
    capital: "Indianapolis",
    cities: ["Indianapolis", "Fort Wayne", "Evansville", "Bloomington", "South Bend"],
    intro:
      "Indiana keeps karaoke casual and welcoming, centered on Indianapolis and the lively college crowd of Bloomington. Sports bars and taverns across the state host regular host-led nights throughout the week.",
  },
  {
    name: "Iowa",
    slug: "iowa",
    abbr: "IA",
    region: "Midwest",
    capital: "Des Moines",
    cities: ["Des Moines", "Cedar Rapids", "Davenport", "Iowa City", "Ames"],
    intro:
      "Iowa's karaoke nights are a staple of its small-city social calendar. Des Moines offers the most options, while university towns like Iowa City and Ames bring reliably energetic crowds to weeknight events.",
  },
  {
    name: "Kansas",
    slug: "kansas",
    abbr: "KS",
    region: "Midwest",
    capital: "Topeka",
    cities: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Lawrence"],
    intro:
      "Kansas balances metro-area nightlife around Wichita and the Kansas City suburbs with spirited college karaoke in Lawrence. Friendly neighborhood bars form the backbone of the local scene.",
  },
  {
    name: "Kentucky",
    slug: "kentucky",
    abbr: "KY",
    region: "South",
    capital: "Frankfort",
    cities: ["Louisville", "Lexington", "Bowling Green", "Frankfort", "Owensboro"],
    intro:
      "Kentucky's karaoke culture pairs naturally with its renowned bourbon bars, especially in Louisville and Lexington. Expect warm, social nights where local pride and a good song list go hand in hand.",
  },
  {
    name: "Louisiana",
    slug: "louisiana",
    abbr: "LA",
    region: "South",
    capital: "Baton Rouge",
    cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Metairie"],
    intro:
      "In a state synonymous with live music, Louisiana karaoke holds its own, particularly in New Orleans where the nightlife rarely sleeps. Baton Rouge and Lafayette add a strong college and Cajun-country following.",
  },
  {
    name: "Maine",
    slug: "maine",
    abbr: "ME",
    region: "Northeast",
    capital: "Augusta",
    cities: ["Portland", "Lewiston", "Bangor", "Augusta", "Brunswick"],
    intro:
      "Maine's karaoke scene centers on Portland's well-regarded bar and brewery district, with steady nights in Bangor and surrounding towns. The atmosphere tends to be friendly, low-key, and community-focused.",
  },
  {
    name: "Maryland",
    slug: "maryland",
    abbr: "MD",
    region: "South",
    capital: "Annapolis",
    cities: ["Baltimore", "Columbia", "Germantown", "Annapolis", "Frederick", "Rockville"],
    intro:
      "Maryland's karaoke options span Baltimore's diverse neighborhood bars to the suburban venues ringing Washington. Annapolis adds a waterfront crowd, and the state's proximity to the capital keeps song nights busy and varied.",
  },
  {
    name: "Massachusetts",
    slug: "massachusetts",
    abbr: "MA",
    region: "Northeast",
    capital: "Boston",
    cities: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
    intro:
      "Massachusetts is a karaoke stronghold, led by Boston and Cambridge where a large student population fills bars and private rooms throughout the week. Worcester and the western cities round out a deep statewide scene.",
  },
  {
    name: "Michigan",
    slug: "michigan",
    abbr: "MI",
    region: "Midwest",
    capital: "Lansing",
    cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint", "Kalamazoo"],
    intro:
      "Michigan's karaoke culture is anchored by Detroit's revitalized nightlife and the craft-beer bars of Grand Rapids. Ann Arbor's university crowd ensures lively weeknights, and host-run events are common statewide.",
  },
  {
    name: "Minnesota",
    slug: "minnesota",
    abbr: "MN",
    region: "Midwest",
    capital: "Saint Paul",
    cities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
    intro:
      "The Twin Cities give Minnesota a robust karaoke calendar, from dive-bar classics to dedicated private rooms in Minneapolis and Saint Paul. Cold winters only seem to make warm, song-filled venues more inviting.",
  },
  {
    name: "Mississippi",
    slug: "mississippi",
    abbr: "MS",
    region: "South",
    capital: "Jackson",
    cities: ["Jackson", "Gulfport", "Southaven", "Biloxi", "Hattiesburg"],
    intro:
      "Mississippi's karaoke nights are most active along the Gulf Coast casino corridor around Biloxi and Gulfport, with steady events in Jackson and the college town of Hattiesburg. Expect welcoming, music-loving crowds.",
  },
  {
    name: "Missouri",
    slug: "missouri",
    abbr: "MO",
    region: "Midwest",
    capital: "Jefferson City",
    cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Jefferson City"],
    intro:
      "Missouri's two big metros, Kansas City and St. Louis, headline a strong karaoke scene full of neighborhood bars and music halls. The college town of Columbia adds dependable weeknight energy.",
  },
  {
    name: "Montana",
    slug: "montana",
    abbr: "MT",
    region: "West",
    capital: "Helena",
    cities: ["Billings", "Missoula", "Bozeman", "Great Falls", "Helena"],
    intro:
      "Montana's karaoke happens in classic Western bars and brewpubs, with the most reliable nights in Missoula, Bozeman, and Billings. The mood is friendly and unpretentious, a natural fit for the state's social culture.",
  },
  {
    name: "Nebraska",
    slug: "nebraska",
    abbr: "NE",
    region: "Midwest",
    capital: "Lincoln",
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    intro:
      "Nebraska's karaoke life centers on Omaha and the college energy of Lincoln, where bars and taverns host regular host-led nights. Crowds are enthusiastic and the welcome is warm.",
  },
  {
    name: "Nevada",
    slug: "nevada",
    abbr: "NV",
    region: "West",
    capital: "Carson City",
    cities: ["Las Vegas", "Henderson", "Reno", "Sparks", "Carson City"],
    intro:
      "Few places take karaoke as seriously as Nevada. Las Vegas offers everything from glitzy private rooms to round-the-clock bar nights, while Reno provides a vibrant, more local alternative just to the north.",
  },
  {
    name: "New Hampshire",
    slug: "new-hampshire",
    abbr: "NH",
    region: "Northeast",
    capital: "Concord",
    cities: ["Manchester", "Nashua", "Concord", "Portsmouth", "Dover"],
    intro:
      "New Hampshire's karaoke scene is friendly and accessible, with Manchester and the seacoast town of Portsmouth leading the way. Pubs and taverns keep weekly nights on the calendar year-round.",
  },
  {
    name: "New Jersey",
    slug: "new-jersey",
    abbr: "NJ",
    region: "Northeast",
    capital: "Trenton",
    cities: ["Newark", "Jersey City", "Paterson", "Edison", "Atlantic City", "Trenton"],
    intro:
      "New Jersey's density gives it an abundance of karaoke options, from Jersey City's diverse bar scene to the casinos and boardwalk venues of Atlantic City. Palisades Park and Fort Lee are known for authentic private-room KTV.",
  },
  {
    name: "New Mexico",
    slug: "new-mexico",
    abbr: "NM",
    region: "West",
    capital: "Santa Fe",
    cities: ["Albuquerque", "Las Cruces", "Santa Fe", "Rio Rancho", "Roswell"],
    intro:
      "New Mexico's karaoke is centered in Albuquerque, with a distinctive Southwestern flavor at local cantinas and bars. Santa Fe and the university town of Las Cruces add their own steady weekly nights.",
  },
  {
    name: "New York",
    slug: "new-york",
    abbr: "NY",
    region: "Northeast",
    capital: "Albany",
    cities: ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany", "Yonkers"],
    intro:
      "New York sets the national standard for karaoke variety. Manhattan's Koreatown is famous for its multi-floor private-room venues, while every borough and upstate city from Buffalo to Albany offers its own bar nights and song-loving crowds.",
  },
  {
    name: "North Carolina",
    slug: "north-carolina",
    abbr: "NC",
    region: "South",
    capital: "Raleigh",
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Asheville"],
    intro:
      "North Carolina's karaoke scene has grown alongside its booming cities. Charlotte and the Research Triangle of Raleigh and Durham lead the way, while Asheville's eclectic bar culture brings a creative, welcoming edge.",
  },
  {
    name: "North Dakota",
    slug: "north-dakota",
    abbr: "ND",
    region: "Midwest",
    capital: "Bismarck",
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    intro:
      "North Dakota's karaoke gathers in the friendly bars of Fargo, Bismarck, and the university town of Grand Forks. Tight-knit communities make for warm, participatory nights, especially through the long winters.",
  },
  {
    name: "Ohio",
    slug: "ohio",
    abbr: "OH",
    region: "Midwest",
    capital: "Columbus",
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
    intro:
      "Ohio's three C's, Columbus, Cleveland, and Cincinnati, each support a thriving karaoke culture of neighborhood bars and private rooms. Columbus, in particular, benefits from a large and enthusiastic student population.",
  },
  {
    name: "Oklahoma",
    slug: "oklahoma",
    abbr: "OK",
    region: "South",
    capital: "Oklahoma City",
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
    intro:
      "Oklahoma's karaoke nights are a welcoming staple of Oklahoma City and Tulsa, with the college town of Norman adding youthful energy. Expect down-to-earth bars and a strong sense of local community.",
  },
  {
    name: "Oregon",
    slug: "oregon",
    abbr: "OR",
    region: "West",
    capital: "Salem",
    cities: ["Portland", "Eugene", "Salem", "Gresham", "Bend", "Hillsboro"],
    intro:
      "Portland is one of the West Coast's great karaoke cities, beloved for its nightly bar events and quirky, all-are-welcome spirit. Eugene and Bend extend Oregon's reputation for relaxed, music-friendly nightlife.",
  },
  {
    name: "Pennsylvania",
    slug: "pennsylvania",
    abbr: "PA",
    region: "Northeast",
    capital: "Harrisburg",
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Harrisburg", "Scranton"],
    intro:
      "Pennsylvania's karaoke scene spans Philadelphia's diverse neighborhood bars and Pittsburgh's revitalized nightlife districts. Both cities offer private rooms and host-led nights, with steady events in smaller cities statewide.",
  },
  {
    name: "Rhode Island",
    slug: "rhode-island",
    abbr: "RI",
    region: "Northeast",
    capital: "Providence",
    cities: ["Providence", "Cranston", "Warwick", "Pawtucket", "Newport"],
    intro:
      "Rhode Island packs a lot of nightlife into a small footprint. Providence leads with a student-driven bar scene, while the harbor town of Newport draws a lively summer crowd to its waterfront venues.",
  },
  {
    name: "South Carolina",
    slug: "south-carolina",
    abbr: "SC",
    region: "South",
    capital: "Columbia",
    cities: ["Charleston", "Columbia", "Greenville", "Myrtle Beach", "Spartanburg"],
    intro:
      "South Carolina's karaoke thrives in historic Charleston, the capital of Columbia, and the beach destination of Myrtle Beach. Coastal tourism and college towns combine for energetic, year-round song nights.",
  },
  {
    name: "South Dakota",
    slug: "south-dakota",
    abbr: "SD",
    region: "Midwest",
    capital: "Pierre",
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Pierre"],
    intro:
      "South Dakota's karaoke nights bring people together in the friendly bars of Sioux Falls and Rapid City. The atmosphere is warm and participatory, a natural extension of the state's close-knit communities.",
  },
  {
    name: "Tennessee",
    slug: "tennessee",
    abbr: "TN",
    region: "South",
    capital: "Nashville",
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
    intro:
      "As the home of Music City, Tennessee treats singing as a way of life. Nashville's bars overflow with talent, Memphis brings its own soulful nightlife, and Knoxville and Chattanooga keep karaoke lively across the state.",
  },
  {
    name: "Texas",
    slug: "texas",
    abbr: "TX",
    region: "South",
    capital: "Austin",
    cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso"],
    intro:
      "Everything is bigger in Texas, and the karaoke scene is no exception. Houston is renowned for its extensive private-room KTV culture, Austin lives up to its live-music reputation, and Dallas and San Antonio offer countless bar nights.",
  },
  {
    name: "Utah",
    slug: "utah",
    abbr: "UT",
    region: "West",
    capital: "Salt Lake City",
    cities: ["Salt Lake City", "Provo", "West Valley City", "Ogden", "Park City"],
    intro:
      "Utah's karaoke centers on Salt Lake City's growing nightlife and the resort crowd of Park City. Bars and lounges host regular nights, offering a fun, social outlet for locals and visitors alike.",
  },
  {
    name: "Vermont",
    slug: "vermont",
    abbr: "VT",
    region: "Northeast",
    capital: "Montpelier",
    cities: ["Burlington", "Montpelier", "Rutland", "Essex", "Stowe"],
    intro:
      "Vermont's karaoke life is centered on Burlington, where a college-town crowd fills lakeside bars and pubs. The scene is friendly and intimate, reflecting the state's small-town character and creative spirit.",
  },
  {
    name: "Virginia",
    slug: "virginia",
    abbr: "VA",
    region: "South",
    capital: "Richmond",
    cities: ["Virginia Beach", "Norfolk", "Richmond", "Arlington", "Alexandria", "Chesapeake"],
    intro:
      "Virginia offers a broad karaoke landscape, from the Northern Virginia suburbs near Washington to the coastal nightlife of Virginia Beach and Norfolk. Richmond's revitalized districts add a creative, independent edge.",
  },
  {
    name: "Washington",
    slug: "washington",
    abbr: "WA",
    region: "West",
    capital: "Olympia",
    cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Vancouver", "Olympia"],
    intro:
      "Washington's karaoke culture is led by Seattle, where a strong Asian-American influence supports numerous private-room venues alongside classic bar nights. Spokane and Tacoma maintain enthusiastic local followings of their own.",
  },
  {
    name: "West Virginia",
    slug: "west-virginia",
    abbr: "WV",
    region: "South",
    capital: "Charleston",
    cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    intro:
      "West Virginia keeps karaoke warm and community-minded, with the most active nights in Charleston, Huntington, and the university town of Morgantown. Neighborhood bars form the heart of the scene.",
  },
  {
    name: "Wisconsin",
    slug: "wisconsin",
    abbr: "WI",
    region: "Midwest",
    capital: "Madison",
    cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Appleton"],
    intro:
      "Wisconsin's renowned tavern culture makes it a natural home for karaoke. Milwaukee and the capital of Madison lead the way, with friendly neighborhood bars across the state hosting regular, well-attended song nights.",
  },
  {
    name: "Wyoming",
    slug: "wyoming",
    abbr: "WY",
    region: "West",
    capital: "Cheyenne",
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Jackson"],
    intro:
      "Wyoming's karaoke happens in classic Western saloons and local bars, with the most consistent nights in Cheyenne, Casper, and the college town of Laramie. The resort area of Jackson adds a seasonal visitor crowd.",
  },
  {
    name: "District of Columbia",
    slug: "district-of-columbia",
    abbr: "DC",
    region: "South",
    capital: "Washington",
    cities: ["Washington"],
    intro:
      "Washington, D.C. supports a cosmopolitan karaoke scene that reflects its diverse, international population. From private rooms in the city's Asian dining districts to lively neighborhood bars, the capital offers no shortage of places to take the microphone.",
  },
];

export const regions: Region[] = ["Northeast", "Midwest", "South", "West"];

export function getStateBySlug(slug: string): State | undefined {
  return states.find((s) => s.slug === slug);
}

export function statesByRegion(region: Region): State[] {
  return states.filter((s) => s.region === region);
}

export function totalCities(): number {
  return states.reduce((sum, s) => sum + s.cities.length, 0);
}
