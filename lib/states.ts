export type Region = "Northeast" | "Midwest" | "South" | "West";

export interface State {
  name: string;
  slug: string;
  abbr: string;
  region: Region;
  capital: string;
  cities: string[];
  intro: string;
  // Neighborhood-level detail about the local karaoke scene, specific to
  // this state. Used on the individual state page to provide unique,
  // depth-adding content beyond the generic intro.
  scene: string;
}

export function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCityName(
  stateSlug: string,
  citySlug: string
): string | undefined {
  const state = states.find((s) => s.slug === stateSlug);
  return state?.cities.find((c) => cityToSlug(c) === citySlug);
}

// All 50 states plus the District of Columbia. Capitals and major cities are
// factual reference data; the intro and scene fields are original editorial
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
    scene:
      "Birmingham's Southside and Five Points districts host the most concentrated karaoke activity in the state, with bars running weekly nights that draw loyal regulars and friendly newcomers alike. Huntsville's growing tech corridor has fueled a newer wave of singing spots in the Downtown area, attracting a younger, mixed crowd. In Mobile, Dauphin Street is the main nightlife corridor where karaoke pops up regularly at multiple bars. Tuscaloosa's strip near the University of Alabama brings college energy to midweek events. Across the state, Thursday through Saturday nights are standard, and crowds are warm enough that first-timers feel at home by their second song.",
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
    scene:
      "Anchorage's downtown and Midtown neighborhoods concentrate most of the karaoke action, particularly at sports bars and multi-purpose venues that double as singing spots. Fairbanks has a tight-knit community of regulars who take karaoke seriously despite the small-city setting. The extended darkness of November through March makes karaoke nights especially popular—venues fill as locals seek warm social outlets. In summer, the midnight sun schedule shifts the rhythm, but late nights remain lively regardless. Juneau's cruise-ship season adds a seasonal influx of visitors who join locals for a song or two in the capital's compact bar district.",
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
    scene:
      "The Valley of the Sun dominates Arizona karaoke, with Tempe's Mill Avenue, Old Town Scottsdale, and Phoenix's Midtown offering the densest concentration of venues. Tucson adds a college-fueled second hub centered around the University of Arizona district on 4th Avenue and Congress Street. Private-room KTV has grown steadily in Chandler and Mesa, reflecting the Phoenix metro's diverse Asian-American communities. Summer karaoke runs indoors with powerful air conditioning—the heat doesn't stop the singing. Mesa's downtown revitalization has brought dedicated karaoke bars to a previously quiet corridor, and Glendale adds further options on the west side of the metro.",
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
    scene:
      "Fayetteville's Dickson Street bar district is the epicenter of karaoke in Arkansas, driven by the University of Arkansas student population that keeps venues active midweek and on weekends. Little Rock's River Market District hosts the most consistent karaoke nights in the capital, with a mix of young professionals and longtime regulars. Springdale and Rogers in the fast-growing Northwest Arkansas corridor have added karaoke options that reflect the region's booming population. Fort Smith and Jonesboro carry the tradition forward in their respective communities with a casual, neighborhood-bar approach that typifies Arkansas karaoke culture.",
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
    scene:
      "Los Angeles leads nationally for karaoke diversity—Koreatown's blocks of multi-floor KTV buildings offer private rooms around the clock, drawing a mix of Korean-American regulars and curious newcomers. San Francisco's Japantown and the Mission District host popular bar-style nights, while SoMa has dedicated karaoke bars popular on weekdays. San Diego's Gaslamp Quarter has reliable weekend karaoke at multiple venues, and the North Park neighborhood adds a hipper, indie-crowd alternative. The Bay Area's Oakland Chinatown and San Jose's Story Road corridor support a mix of KTV and open-mic styles. In Sacramento, the Midtown grid keeps things active on weekends for the capital crowd.",
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
    scene:
      "Denver's Capitol Hill, RiNo (River North Art District), and LoDo neighborhoods are the best bets for karaoke, offering both dedicated rooms and bar nights within a walkable entertainment zone. Boulder's Pearl Street and the Hill district near CU Boulder serve a consistently energetic college crowd with midweek events that stay busy through the semester. Fort Collins' Old Town Square holds its own on weekends, drawing from CSU. Aurora and Colorado Springs add suburban and resort-adjacent options. Ski resort towns including Breckenridge and Vail offer seasonal karaoke at lodge bars during peak winter, drawing visitors who want to extend the mountain fun into the evening.",
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
    scene:
      "New Haven's Wooster Square and the blocks around Yale University drive a strong weeknight karaoke scene fueled by students and young professionals. Hartford's Front Street entertainment district and downtown bars host recurring nights for a state-government and insurance-industry crowd. Stamford's downtown bar scene leans weekend-heavy, with a professional crowd spilling over from neighboring New York. Norwalk and Bridgeport add additional Fairfield County options. The shoreline towns from Milford to Old Saybrook bring seasonal outdoor karaoke to a summer crowd that blends locals and visitors. Middletown's Main Street rounds out the state's central corridor.",
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
    scene:
      "Wilmington's Trolley Square neighborhood anchors Delaware karaoke, with a cluster of bars and gastropubs hosting weekly nights that draw from across the metro. Newark benefits from the University of Delaware population, with weekend karaoke that packs in students from across the small campus town. Rehoboth Beach is strictly seasonal—June through August brings a tourist surge that makes the small beach strip one of the liveliest karaoke environments in the Mid-Atlantic region, with bars on and around Rehoboth Avenue running nights most weekends. Dover's downtown maintains a smaller but steady scene serving the state capital's community.",
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
    scene:
      "Miami's Brickell, Wynwood, and Little Havana each contribute a distinct flavor—from late-night lounge formats to lively Latin-inflected nights where Spanish-language songs share the rotation with English pop. Orlando's International Drive and downtown Orange Avenue host karaoke at both tourist-friendly spots and beloved local bars. Tampa's Ybor City brings historic nightlife energy to karaoke on its brick-lined streets, while Hyde Park Village adds a polished alternative. Jacksonville's Riverside and 5 Points neighborhoods have strong local followings. Tallahassee's College Town area and Adams Street serve FSU students. The Florida Keys and Gulf Coast beach towns add seasonal options year-round thanks to the climate.",
  },
  {
    name: "Georgia",
    slug: "georgia",
    abbr: "GA",
    region: "South",
    capital: "Atlanta",
    cities: [
      "Abbeville", "Acworth", "Adairsville", "Adel", "Adrian", "Ailey",
      "Alamo", "Alapaha", "Albany", "Aldora", "Allenhurst", "Allentown",
      "Alma", "Alpharetta", "Alto", "Ambrose", "Americus", "Andersonville",
      "Arlington", "Arnoldsville", "Ashburn", "Athens", "Atlanta", "Attapulgus",
      "Auburn", "Augusta", "Austell", "Avalon", "Avera", "Avondale Estates",
      "Bainbridge", "Baldwin", "Ball Ground", "Barnesville", "Bartow", "Baxley",
      "Berkeley Lake", "Berlin", "Bethlehem", "Bishop", "Blackshear",
      "Blairsville", "Blakely", "Bloomingdale", "Blue Ridge", "Boston",
      "Bostwick", "Bowdon", "Braselton", "Bremen", "Brinson", "Bronwood",
      "Brookhaven", "Brunswick", "Buchanan", "Buckhead", "Buena Vista",
      "Buford", "Butler", "Byron", "Cadwell", "Cairo", "Calhoun", "Camak",
      "Camilla", "Canon", "Canton", "Carl", "Carnesville", "Carrollton",
      "Cartersville", "Cave Spring", "Cedartown", "Centerville", "Chamblee",
      "Clarkesville", "Claxton", "Clayton", "Clermont", "Cleveland", "Cochran",
      "Colquitt", "Columbus", "Comer", "Commerce", "Conyers", "Cordele",
      "Cornelia", "Covington", "Crawford", "Cumming", "Cusseta", "Cuthbert",
      "Dacula", "Dahlonega", "Dalton", "Damascus", "Darien", "Dawson",
      "Dawsonville", "Decatur", "Demorest", "Dexter", "Doraville", "Douglas",
      "Douglasville", "Dublin", "Dudley", "Duluth", "Dunwoody",
      "East Dublin", "East Point", "Eatonton", "Edison", "Elberton",
      "Ellaville", "Emerson", "Enigma", "Ephesus", "Eton", "Evans", "Fairburn",
      "Fayetteville", "Fitzgerald", "Flowery Branch", "Folkston", "Forest Park",
      "Forsyth", "Fort Gaines", "Fort Oglethorpe", "Fort Valley", "Franklin",
      "Gainesville", "Garden City", "Georgetown", "Glennville", "Gordon",
      "Grantville", "Gray", "Grayson", "Greensboro", "Greenville", "Grovetown",
      "Hahira", "Hamilton", "Hampton", "Hartwell", "Helen", "Hinesville",
      "Holly Springs", "Jackson", "Jasper", "Jefferson", "Jesup", "Johns Creek",
      "Jonesboro", "Kennesaw", "Kingsland", "LaFayette", "LaGrange",
      "Lawrenceville", "Lilburn", "Lincolnton", "Lithonia", "Locust Grove",
      "Loganville", "Louisville", "Ludowici", "Lumpkin", "Macon", "Madison",
      "Manchester", "Marietta", "McDonough", "McRae-Helena", "Metter",
      "Milledgeville", "Milton", "Monroe", "Montezuma", "Moultrie",
      "Nashville", "Newnan", "Norcross", "Ocilla", "Oxford", "Palmetto",
      "Peachtree City", "Peachtree Corners", "Pembroke", "Perry", "Pine Lake",
      "Pooler", "Port Wentworth", "Powder Springs", "Quitman", "Ranger",
      "Richland", "Richmond Hill", "Rincon", "Riverdale", "Rockmart", "Rome",
      "Roswell", "Sandersville", "Sandy Springs", "Savannah", "Senoia",
      "Smyrna", "Snellville", "Social Circle", "Soperton", "South Fulton",
      "Statesboro", "Stockbridge", "Stone Mountain", "Stonecrest", "Sugar Hill",
      "Suwanee", "Sylvester", "Tifton", "Thomson", "Toccoa", "Trenton",
      "Tybee Island", "Union City", "Valdosta", "Vidalia", "Villa Rica",
      "Warner Robins", "Waycross", "Winder", "Woodstock", "Wrens", "Zebulon",
    ],
    intro:
      "Georgia's karaoke heart is Atlanta, where private KTV rooms and packed bar nights both flourish. The college energy of Athens and the historic charm of Savannah add their own character, making the state a rewarding place to find a stage.",
    scene:
      "Atlanta's Virginia-Highland, Little Five Points, and the Buckhead bar district all host regular karaoke nights for very different crowd types—Virginia-Highland leans neighborhood, Little Five Points leans eclectic, Buckhead leans high-energy. Midtown Atlanta has added dedicated private KTV rooms alongside bar-style events. Athens, anchored by UGA, sustains a creative karaoke culture on College Avenue and around downtown, with midweek nights that stay busy through the semester. Savannah's River Street and City Market serve a mix of locals and tourists with weekend karaoke in an atmospheric Historic District setting. Augusta and Columbus maintain community-focused scenes in their downtown corridors.",
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
    scene:
      "Honolulu's Chinatown district is the epicenter of karaoke culture on Oahu, with numerous dedicated KTV buildings that reflect Japanese and Korean community influences. The Kaimuki, Kapahulu, and Ala Moana neighborhoods also have popular spots ranging from sleek private rooms to casual bar nights. On Maui, Lahaina and Kihei host bar-style nights that attract a mix of residents and resort workers. The Big Island's Kona is the most active venue city, with a bar scene catering to both locals and visitors. Kaneohe and Kailua serve the windward Oahu community with neighborhood-focused spots. Private rooms dominate over open-mic formats statewide, reflecting karaoke's deep cultural roots across the islands.",
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
    scene:
      "Boise's Downtown core around 8th Street and the Hyde Park neighborhood are where most karaoke concentrates, with brewpubs and bars hosting regular nights for a crowd that trends young and outdoorsy. Meridian and Nampa add suburban options serving Boise's booming metro population. Coeur d'Alene's lakeside bar scene heats up in summer, drawing visitors from Spokane and beyond who discover karaoke alongside the resort atmosphere. Idaho Falls and Twin Falls hold steady weekend scenes in their downtown districts. The state's bar culture favors casual, unpretentious nights where craft beer and singing go naturally together.",
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
    scene:
      "Chicago is the nucleus of Illinois karaoke—Wicker Park, Logan Square, and Boystown each have beloved bars, and dedicated venues like Carol's Pub on the North Side offer marathon sessions that become legendary among regulars. Koreatown on Lawrence Avenue has private-room options for groups. The northern suburbs of Evanston, Naperville, and Schaumburg add family-friendly and late-night options for the metro's outer rings. Rockford's downtown entertainment district maintains a committed local scene. Springfield keeps karaoke alive near the Capitol with bars that serve state government workers and weeknight regulars. Peoria's riverfront and downtown corridor add central Illinois options.",
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
    scene:
      "Indianapolis' Mass Ave Arts District and Broad Ripple neighborhood are the most active karaoke hubs, with bars rotating hosts and building strong regular crowds. Fountain Square adds an artsy, indie flavor to the city's scene. Bloomington's Kirkwood Avenue and the square near Indiana University keep karaoke energetic year-round with strong student participation. Fort Wayne and South Bend are anchored by sports-bar karaoke with enthusiastic local followings. Evansville rounds out the state with a laid-back, southern-Indiana vibe that makes its nights some of the most social and friendly in the region—a true community gathering.",
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
    scene:
      "Des Moines' East Village and Court Avenue districts hold the strongest karaoke in Iowa, with multiple bars and music venues running consistent weekly events for a mix of young professionals and longtime regulars. Iowa City, home to the University of Iowa and the Iowa Writers' Workshop, has a literary-tinged creative bar scene where karaoke nights attract surprisingly polished performers. Ames benefits from Iowa State with packed midweek events on Welch Avenue. Cedar Rapids and Davenport anchor the eastern corridor of the state with reliable weekend nights. The Quad Cities metro adds further options just across the Mississippi River.",
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
    scene:
      "Wichita's Old Town entertainment district and the Delano neighborhood are the primary karaoke hubs in Kansas, with bars hosting weeknight and weekend events for a genuinely welcoming crowd. Overland Park and Olathe add suburban Kansas City options that serve a family-friendly demographic alongside younger nightlife-goers. Lawrence's Massachusetts Street—known locally as Mass Street—sustains lively college-town karaoke driven by the University of Kansas. Topeka's downtown keeps the capital's scene modest but consistent. Manhattan, home to Kansas State, adds another college-energy node to the state's central corridor.",
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
    scene:
      "Louisville's NuLu (East Market District) and Bardstown Road are the twin pillars of Kentucky karaoke, with bars that celebrate the state's bourbon culture by pairing song nights with craft spirits and locally made cocktails. Lexington's Triangle Bar area and the campus corridor near the University of Kentucky provide a reliably active scene through the semester. Bowling Green serves as the regional hub for western Kentucky, drawing from the WKU college crowd. Frankfort keeps nights intimate with a state-government flavor. Owensboro and Paducah add western Kentucky options where country music influences the song choices heavily.",
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
    scene:
      "New Orleans is the undisputed star, with Frenchmen Street, the Marigny, and bars along Bourbon Street hosting karaoke at venues that stay open deep into the night—some running until 4 or 5 a.m. The city's year-round festivals and massive tourism keep the scene alive even on slow weeknights. Baton Rouge's Tigerland neighborhood and the Perkins Road corridor serve a large LSU student population with consistent weekly events. Lafayette's downtown and Oil Center area add authentic Cajun flavor to bar nights. Shreveport offers casino-adjacent lounge-style karaoke at resort venues, while Metairie provides suburban New Orleans options close to the city.",
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
    scene:
      "Portland's Old Port is the heart of Maine karaoke, with the historic waterfront district's bars hosting nights that skew toward a 25-40 demographic who appreciate a well-curated song catalog over a party atmosphere. Congress Street adds a more arts-district flavor. Bangor holds its own as the state's northern hub, with consistent nights at downtown bars that draw from across the region. Brunswick benefits from Bowdoin College with weekend energy from students and faculty. Augusta and Lewiston maintain smaller weeknight scenes. The summer season, particularly July and August, brings tourist traffic that can double venue attendance at Portland spots.",
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
    scene:
      "Baltimore's Fells Point, Federal Hill, and Canton are the city's three most active karaoke neighborhoods, each with a distinct character—Fells Point leans dive-bar historic, Federal Hill leans polished sports-bar, Canton leans neighborhood social. Suburban Montgomery County—particularly Rockville, Germantown, and Silver Spring—has one of the highest concentrations of private-room KTV on the entire East Coast, reflecting the large Korean-American community in the area. Frederick's downtown walkable bar district is an underrated destination. Annapolis adds waterfront charm on weekends. Prince George's County adds diversity to the DC-suburb corridor with both KTV rooms and bar-style options.",
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
    scene:
      "Boston's Allston neighborhood is the city's karaoke heartbeat, with the student population from Boston University, Boston College, and nearby schools keeping prices reasonable and lines short even on weekdays. Jamaica Plain and Dorchester add neighborhood-bar authenticity. Cambridge's Central Square has dedicated venues popular with MIT and Harvard communities. Quincy and Malden have private KTV room options reflecting local Asian-American communities. Worcester's Main Street and Shrewsbury Street sustain the city's own active scene. The Pioneer Valley—Northampton, Amherst, and Springfield—adds western Massachusetts options with a progressive, creative-crowd character.",
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
    scene:
      "Detroit's Midtown, Corktown, and the Ferndale suburb anchor the state's most active karaoke scene, with a mix of dive bars and dedicated singing rooms. Grand Rapids' downtown and Eastown neighborhoods have grown their karaoke presence alongside the city's broader beer and arts renaissance. Ann Arbor's Main Street and South State Street serve University of Michigan crowds with consistent weeknight events that pack in well. Lansing's Old Town district and Kalamazoo's Vine Street neighborhood add character to their respective communities. Flint's downtown revival has brought new karaoke options, and the Detroit suburb of Dearborn adds a Middle Eastern–American cultural flavor to its bar scene.",
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
    scene:
      "Minneapolis' Uptown, Northeast Minneapolis, and the Warehouse District are the city's three primary karaoke zones, with venues ranging from intimate dive bars to purpose-built singing rooms that accommodate large groups. Saint Paul's Grand Avenue and the Payne-Phalen neighborhood contribute their own distinct flavor with a slightly more local, less trendy crowd. Duluth's Canal Park and Superior Street scene is smaller but enthusiastic, drawing from both residents and visitors to the North Shore. Rochester's bar scene near the Mayo Clinic complex adds an international dimension, attracting medical professionals and patients' families from around the world.",
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
    scene:
      "Biloxi and Gulfport's casino resort strips are the most active karaoke environments in the state, with casino lounges and adjacent bars running late-night events that cater to a mixed tourist and local crowd. Jackson's Fondren and Belhaven neighborhoods have more community-focused nights with strong repeat regulars. Hattiesburg's downtown and the Midtown district near the University of Southern Mississippi maintain college-driven energy through the semester. Southaven, on the Memphis suburban fringe, adds metro-level options at its own entertainment venues. The Gulf Coast's year-round warmth and tourism make its karaoke scene one of the most consistently active in the South.",
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
    scene:
      "Kansas City's Westport Road entertainment district and the Power and Light entertainment zone are the city's karaoke engines, with Westport in particular hosting some of the most beloved and long-running nights in the region. St. Louis' Cherokee Street, The Grove, and the Soulard neighborhood divide the city's karaoke loyalists across very different atmospheres. Columbia, home to the University of Missouri, keeps things energetic throughout the academic year with a vibrant downtown bar scene. Springfield's Commercial Street and downtown square anchor the southwest. Jefferson City maintains a modest but consistent scene befitting a state capital with government workers as a primary demographic.",
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
    scene:
      "Missoula's Downtown district, centered on Higgins Avenue and the blocks near the University of Montana, leads the state for karaoke frequency and crowd diversity. Bozeman's Main Street has grown its nightlife scene alongside the city's tech economy and resort influence, with karaoke appearing regularly at brewpubs and late-night bars that attract a younger, outdoor-enthusiast crowd. Billings holds steady as the state's largest city, with weekend nights at downtown bars drawing from across eastern Montana. Great Falls and Helena keep things local and intimate. The state's bar culture prizes authenticity over pretension—Montana karaoke is genuinely inclusive.",
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
    scene:
      "Omaha's Old Market historic district and the Benson neighborhood are the twin centers of Nebraska karaoke, with Old Market offering a warehouse-district atmosphere and Benson delivering an indie-bar vibe popular with younger creatives. Dundee adds a neighborhood feel. Lincoln's Haymarket District keeps the University of Nebraska community singing midweek and on weekends, with a student population that ensures consistently high energy. Bellevue and Papillion serve Omaha's southern suburbs. Grand Island and Kearney provide reliable weekend scenes along the Platte River Valley corridor, keeping karaoke accessible to Nebraskans outside the two main metros.",
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
    scene:
      "Las Vegas is in a category of its own—the Strip's hotel-casino entertainment complexes run lounge-style karaoke, while the Downtown Fremont Street area and the Las Vegas Arts District have more intimate, local-favorite bars that feel far removed from tourist territory. Henderson's Green Valley and Summerlin offer suburban options popular with Las Vegas residents who want to avoid the Strip crowds. Reno's Midtown District on South Virginia Street has a vibrant and growing karaoke scene with an authentic local character, backed by University of Nevada students and tech-industry workers. Sparks adds east-Reno options, and Carson City keeps it small and social.",
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
    scene:
      "Manchester's Elm Street corridor and the Millyard area are the primary karaoke hubs in New Hampshire, with bars and pubs hosting weekly nights that serve a broad demographic from college-age to middle-aged working crowd. Portsmouth's Market Square and the Ceres Street waterfront add a distinctly New England atmosphere—cobblestones and craft beer combine with a lively singing host culture. Nashua contributes as a Merrimack Valley hub close to the Massachusetts border, with options that attract both NH residents and cross-border visitors. Concord's downtown keeps its scene low-key and community-oriented, while Dover's bar district adds seacoast alternatives.",
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
    scene:
      "Jersey City's Downtown and Journal Square are NYC-adjacent karaoke hotbeds with more affordable options than across the Hudson. Palisades Park and Fort Lee in Bergen County have some of the most authentic Korean private-room KTV in the country, reflecting the large Korean-American community along Route 46. Hoboken's Washington Street delivers a high-energy bar crowd popular on Friday and Saturday nights. Atlantic City's casino resorts add late-night lounge-style karaoke on the Boardwalk, mixing local regulars with weekend visitors. Edison and New Brunswick serve Central Jersey with a mix of bar-style and KTV room options reflecting diverse South Asian and East Asian communities.",
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
    scene:
      "Albuquerque's Nob Hill neighborhood on Central Avenue and the Downtown district are the city's main karaoke zones, with cantinas and bars hosting nights that have a distinctly Southwestern character—Spanish-language songs mix naturally into the rotation. Craft brewery tap rooms in Nob Hill have added occasional karaoke events to their schedules. Santa Fe's Downtown Plaza area serves a smaller but well-traveled creative crowd, with venues that skew toward the artsy and eclectic. Las Cruces benefits from NMSU with college-driven weeknight energy on and around Mesilla Valley. Rio Rancho and the East Mountains add suburban Albuquerque options for residents outside the city core.",
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
    scene:
      "Manhattan's 32nd Street Koreatown is world-famous for private-room karaoke, with multi-floor buildings housing dozens of individual rooms bookable by the hour around the clock. Brooklyn's Williamsburg, Park Slope, and Bay Ridge neighborhoods each have cherished local spots. Queens' Flushing has a deep KTV culture rooted in its Chinese and Korean communities. In upstate New York, Buffalo's Elmwood Village and Allentown neighborhoods, Rochester's Monroe Avenue, and Syracuse's Armory Square all support active bar-karaoke scenes. Albany's Lark Street rounds out the capital region with consistent weekend nights. The sheer size and diversity of New York's population means song catalogs span dozens of languages.",
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
    scene:
      "Charlotte's South End and Plaza Midwood neighborhoods host the most consistent karaoke nights in the state, with both private-room KTV options and bar nights available for different crowd preferences. Raleigh's Glenwood South and Five Points area have reliable midweek and weekend events driven by a young-professional population. Durham's 9th Street and downtown core lean toward creative, indie crowds that take the singing seriously. Greensboro's downtown and Winston-Salem's Trade Street add Triad representation. Asheville's Lexington Avenue corridor has a uniquely eclectic singing culture that embraces originals, deep cuts, and unexpected choices—a perfect reflection of the city's creative identity.",
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
    scene:
      "Fargo's Downtown Broadway corridor and Main Avenue bar district are the beating heart of North Dakota karaoke, with venues hosting weekly nights that pack warmly through the long winters. Grand Forks, anchored by the University of North Dakota, adds strong college-night energy on and near University Avenue. Bismarck's Main Street holds the capital's scene together with a smaller but enthusiastic regular crowd. Minot and West Fargo maintain weekend traditions in their respective communities. The tight-knit nature of North Dakota's cities means karaoke regulars build genuine friendships over time, and new faces are welcomed enthusiastically—especially visitors from out of state.",
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
    scene:
      "Columbus' Short North Arts District and the OSU campus area near High Street are the most active karaoke environments in Ohio, with dedicated spots running multiple nights per week and drawing diverse crowds. German Village and Clintonville add neighborhood-bar alternatives. Cleveland's Detroit Shoreway, Tremont, and Ohio City neighborhoods have passionate local followings in rehabbed industrial spaces. Cincinnati's Over-the-Rhine and Northside are the Queen City's karaoke heartbeat. Dayton, Toledo, and Akron all add mid-city scenes with strong community character. Ohio's three major metros in close proximity make it one of the most karaoke-rich Midwest states—something for every taste.",
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
    scene:
      "Oklahoma City's Midtown district, Bricktown entertainment complex, and Automobile Alley neighborhoods host regular karaoke nights for a friendly, unpretentious crowd. Western Avenue adds options near the Penn Square Mall corridor. Tulsa's Cherry Street, Blue Dome District, and Brookside area are the oil city's karaoke centers—each neighborhood has its own distinct personality and regular crowd. Norman's Campus Corner and Main Street carry the OU student crowd on weeknights and weekends. Edmond and Broken Arrow add suburban metro options serving families and young professionals. Oklahoma's karaoke culture puts community first, making it an ideal environment for first-time performers.",
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
    scene:
      "Portland is one of the most celebrated karaoke cities in America—the Hawthorne, Division Street, and North Mississippi Avenue neighborhoods all have iconic spots that locals defend fiercely. Voicebox (with multiple locations) pioneered Portland's private-room revolution, while Southeast Portland bars like Chopsticks II are beloved institutions among regulars who show up every week. Eugene's downtown and the area near the University of Oregon bring college energy and a music-obsessed crowd to midweek nights. Bend's Old Mill District and vibrant downtown add a resort-town flavor. Salem bridges the Willamette Valley corridor with consistent options between the two major cities.",
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
    scene:
      "Philadelphia's Fishtown, Northern Liberties, and South Street neighborhoods offer karaoke ranging from low-key dive to polished private-room. South Philadelphia and Northeast Philly have private KTV options rooted in Vietnamese and Korean communities. Pittsburgh's South Side Flats on East Carson Street is the city's karaoke corridor, with bars running events Thursday through Sunday in a dense strip of nightlife. Shadyside and Lawrenceville add neighborhood-bar alternatives. Scranton's downtown and the Electric City atmosphere give its scene a blue-collar charm. Allentown and the Lehigh Valley add eastern Pennsylvania alternatives serving a growing suburban population.",
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
    scene:
      "Providence's Federal Hill neighborhood and the Downtown arts district are the city's two primary karaoke scenes—Federal Hill brings an Italian-American neighborhood warmth while Downtown attracts Brown and RISD students and young creative professionals. Thayer Street and the East Side add smaller, more intimate options. Newport's Thames Street becomes a karaoke hotspot in summer, with waterfront bars competing for tourist and day-tripper business from across Southern New England. Warwick and Cranston provide suburban options that serve Rhode Islanders who prefer a shorter drive. Pawtucket's growing arts-scene presence adds a newer option to the state's northern edge.",
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
    scene:
      "Charleston's Upper King Street is home to the city's most-visited karaoke bars, with venues that balance historic charm against genuinely lively modern nightlife and crowds that mix tourists with a committed local following. Columbia's Five Points and the Vista neighborhoods serve USC students and state government workers with consistent weekly events. Greenville's Falls Park corridor and the West End have grown their nightlife and karaoke presence alongside the city's downtown renaissance. Myrtle Beach's Ocean Boulevard makes summer karaoke festive and tourist-friendly. Spartanburg adds a smaller community option in the Upstate with a loyal and welcoming crowd.",
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
    scene:
      "Sioux Falls' downtown and Phillips Avenue corridor hold South Dakota's most reliable karaoke schedule, with neighborhood bars and entertainment spots hosting regular weekend nights. Rapid City, gateway to Mount Rushmore and the Black Hills, maintains an active downtown bar scene that draws from both residents and visitors—especially in summer when Black Hills tourism peaks. Brookings benefits from South Dakota State with midweek college energy. Aberdeen's downtown maintains a community-focused tradition. Pierre keeps things intimate for a state capital. The compact population of South Dakota means regulars know each other well, creating karaoke environments where newcomers are quickly embraced.",
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
    scene:
      "Nashville's karaoke is concentrated in Midtown and the 12South neighborhood, where dedicated karaoke bars offer a more structured singing night separate from the honky-tonk strip on Broadway. The Gulch area adds polished options for the young-professional crowd. Memphis' Cooper-Young neighborhood and South Main Arts District host weekly karaoke with a soulful, music-serious crowd that reflects the city's heritage. Knoxville's Old City and Market Square draw from UT's large student body with consistent weeknight events. Chattanooga's North Shore and Main Street are growing nightlife destinations with regular events. Tennessee crowds are notably enthusiastic—the state's music culture makes audiences genuinely supportive.",
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
    scene:
      "Houston's Chinatown corridor along Bellaire Boulevard and the Montrose neighborhood are the city's two karaoke universes—Bellaire has extensive private-room KTV rooted in a large Vietnamese and Chinese-American community, while Montrose has beloved bar-style spots. Austin's Dirty 6th Street, Red River Cultural District, and Rainey Street run bar-style karaoke that stands alongside the city's famous live music. Dallas' Deep Ellum and Uptown neighborhoods and the Royal Lane Koreatown have dedicated KTV room options. San Antonio's River Walk and Southtown areas offer consistent nights. El Paso brings a border-city flavor with Spanish-language songs prominent in the rotation at several popular venues.",
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
    scene:
      "Salt Lake City's 9th and 9th neighborhood, the Sugar House district, and Downtown all host consistent karaoke nights that have grown alongside the city's expanding bar culture. Ogden's Historic 25th Street is an underrated karaoke destination with character-filled bars and a loyal local following. Park City's Main Street adds a resort-town format that draws ski visitors in winter and outdoor-recreation crowds in summer. Provo's bar scene near BYU caters to the non-campus population. West Valley City adds suburban options with a diverse demographic. Utah's karaoke culture has expanded meaningfully in recent years as the state's nightlife infrastructure has grown.",
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
    scene:
      "Burlington's Church Street Marketplace and Pine Street are where Vermont karaoke concentrates, with the small city's walkable downtown making it easy to bar-hop to multiple venues in a single evening. The UVM student population keeps Thursday nights reliably energetic, and local regulars fill weekend events with a creative, inclusive atmosphere. Stowe and Killington add seasonal karaoke at lodge bars and après-ski venues during peak winter months, drawing visitors from across New England. Montpelier keeps a smaller but committed scene, while Rutland rounds out the southern half of the state with options that serve the Champlain Valley and surrounding communities.",
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
    scene:
      "Northern Virginia—particularly Annandale's Korean restaurant and KTV corridor, Tysons Corner, and Alexandria's Del Ray and Old Town—has one of the densest concentrations of private-room karaoke on the East Coast, driven by a large Korean-American and broader Asian-American community. Virginia Beach's Oceanfront and Town Center areas run beach-crowd-friendly karaoke year-round with strong summer peaks. Richmond's Scott's Addition, Carytown, and Shockoe Bottom districts sustain a creative, independent scene with loyal regulars. Norfolk's Granby Street and the Ghent neighborhood anchor Hampton Roads. Arlington's Clarendon corridor draws a young-professional crowd with strong DC ties.",
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
    scene:
      "Seattle's Capitol Hill and Belltown neighborhoods are the city's bar-karaoke heartbeat, while Rainier Valley and the International District host some of the finest private-room KTV in the Pacific Northwest, drawing on a large Vietnamese and Korean-American community. Bellevue's downtown and the Eastside corridor serve Eastside tech workers with polished KTV room options. Tacoma's 6th Avenue and Hilltop area add blue-collar bar-night character. Spokane's downtown revitalization has brought new karaoke bars to the Lilac City's main entertainment corridors. Vancouver, WA rounds out the southern edge of the state just across the Columbia River from Portland.",
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
    scene:
      "Charleston's Capitol Market area and the Virginia Street downtown corridor are the primary karaoke hubs, with bars hosting regular nights that attract state government workers, young professionals, and longtime locals. Huntington's 4th Avenue near Marshall University drives college-crowd energy through the semester with midweek and weekend events. Morgantown's High Street and the Wharf District are arguably the most active in the state, fueled by WVU's large and enthusiastic student body. Parkersburg and Wheeling maintain older, community-centered scenes at established neighborhood bars where regulars often know each other by first name.",
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
    scene:
      "Milwaukee's Brady Street, Walker's Point, and Bay View neighborhoods host dedicated and well-attended karaoke nights that feel like natural extensions of the city's deep tavern culture. Madison's State Street and the area around Camp Randall serve a UW student population that packs bars on Thursday and weekend nights year-round. Green Bay's downtown entertainment district serves a Packer-proud crowd that brings the same loyal team energy to karaoke. Appleton, Oshkosh, and Racine round out the state with options that lean toward neighborhood bar formats and consistent regular crowds who make newcomers feel immediately welcome.",
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
    scene:
      "Cheyenne's downtown 16th Street corridor is the most consistent karaoke destination in Wyoming, with several bars holding Thursday and Saturday night events for a crowd that blends ranchers, state workers, and military personnel from nearby F.E. Warren Air Force Base. Casper's downtown holds its own with a mix of energy-industry workers and community regulars who give the scene a blue-collar camaraderie. Laramie, home to the University of Wyoming, punches above its small-city size with college-driven midweek energy on Grand Avenue. Jackson's Town Square area brings resort visitors and National Park travelers into the mix, creating one of Wyoming's most varied and energetic seasonal karaoke crowds.",
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
    scene:
      "DC's Adams Morgan, U Street Corridor, and H Street NE are the city's three primary karaoke neighborhoods, each with a distinct personality. Adams Morgan has the most consistent rotation of venues with international audiences spanning dozens of nationalities. U Street's Black Broadway legacy gives its karaoke bars a music-reverent atmosphere where performers are expected to commit to the song. H Street's growing bar scene has added dedicated karaoke nights that skew younger and louder. Chinatown has traditional KTV room options. The city's constantly rotating population of diplomats, congressional staffers, and young professionals means song catalogs span every language and genre—a uniquely global singing experience.",
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
