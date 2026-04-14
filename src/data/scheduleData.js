// ── Shared Schedule Data ──────────────────────────────────────────────────────
// Single source of truth used by CalendarPorts (Adventure Map) and MyYosties (Schedule Tab)

export const TAG_CONFIG = {
  flight:   { node: '#1B2A4A', label: 'FLIGHT',   bg: '#e1f5fe', color: '#0277bd' },
  required: { node: '#FF6B6B', label: 'REQUIRED', bg: '#ffebee', color: '#c62828' },
  included: { node: '#2ecc71', label: 'INCLUDED', bg: '#edfcf2', color: '#22863a' },
  food:     { node: '#F4C430', label: 'FOOD',     bg: '#fff8e1', color: '#a16207' },
  tip:      { node: '#888888', label: 'TIP',      bg: '#f5f5f5', color: '#666666' },
  show:     { node: '#7b1fa2', label: 'SHOW',     bg: '#f3e5f5', color: '#7b1fa2' },
};

export const DEFAULT_NODE = '#1B2A4A';

export const DAY_GRAD = {
  travel:        { from: '#C0392B', to: '#E74C3C', label: 'Travel Day',   icon: '✈️',  watermark: '✈️'  },
  embark:        { from: '#1B2A4A', to: '#2A3F6F', label: 'Embarkation',  icon: '🚢',  watermark: '🚢'  },
  port_nassau:   { from: '#0E6655', to: '#1ABC9C', label: 'Port Day',      icon: '🏝️', watermark: '🏝️' },
  port_castaway: { from: '#1A5276', to: '#2E86C1', label: 'Port Day',      icon: '⚓',  watermark: '⚓'  },
  sea:           { from: '#4A235A', to: '#7D3C98', label: 'At Sea',        icon: '🌊',  watermark: '🌊'  },
  debark:        { from: '#784212', to: '#CA6F1E', label: 'Debarkation',   icon: '🏨',  watermark: '🏨'  },
  resort:        { from: '#1E8449', to: '#27AE60', label: 'Resort Day',    icon: '🏨',  watermark: '🏖️' },
  return:        { from: '#C0392B', to: '#E74C3C', label: 'Travel Day',    icon: '✈️',  watermark: '✈️'  },
};

export const DAYS = [
  {
    idx: 0, day: 1, type: 'travel',
    dateShort: 'July 22', dateLong: 'Wednesday, July 22, 2026',
    label: 'Arrive Fort Lauderdale',
    events: [
      { time: '9:54 AM',   text: 'K-Yosties depart Columbus — Breeze Airlines MX1016',              tag: 'flight'   },
      { time: '1:54 PM',   text: 'K-Yosties arrive FLL — Uber to hotel',                            tag: 'flight'   },
      { time: 'Afternoon', text: 'Publix run — buy alcohol & snacks (12 min walk from Embassy Suites)', tag: 'tip'  },
      { time: '4:00 PM',   text: 'Hotel check-in: Embassy Suites, 1100 SE 17th St'                               },
      { time: '5:30 PM',   text: 'Complimentary apps & drinks in hotel lobby',                      tag: 'included' },
      { time: 'Evening',   text: 'Dinner via DoorDash / Uber Eats · Pool time',                     tag: 'food'     },
      { time: '8:00 PM',   text: "Kids' bedtimes"                                                                  },
    ],
  },
  {
    idx: 1, day: 2, type: 'embark',
    dateShort: 'July 23', dateLong: 'Thursday, July 23, 2026',
    label: 'Cruise Embarkation',
    events: [
      { time: '6:30–9:30 AM', text: 'Complimentary breakfast at Embassy Suites',               tag: 'included' },
      { time: '10:00 AM',     text: 'Transportation to Port Everglades, Terminal 4'                             },
      { time: 'Boarding',     text: 'Lunch at Marceline Market Buffet (Deck 11)',               tag: 'food'     },
      { time: 'Embark Day',   text: "Enroll kids in Kids Clubs — it's open house day!",        tag: 'tip'      },
      { time: '1:30 PM',      text: 'Staterooms are ready! Great time for unpacking and naps', tag: 'included' },
      { time: '3:00 PM',      text: 'Ship departs Fort Lauderdale'                                              },
      { time: '4:00 PM',      text: 'Mandatory Muster Drill — all guests required',            tag: 'required' },
      { time: '5:45 PM',      text: 'Dinner: Rotational Dining',                               tag: 'food'     },
    ],
  },
  {
    idx: 2, day: 3, type: 'port_nassau',
    dateShort: 'July 24', dateLong: 'Friday, July 24, 2026',
    label: 'Nassau, Bahamas',
    events: [
      { time: '7:30 AM',  text: 'Breakfast',                                                   tag: 'food'     },
      { time: '8:00 AM',  text: 'Arrive in Nassau, Bahamas',                                   tag: 'included' },
      { time: '5:30 PM',  text: 'Return to ship',                                              tag: 'required' },
      { time: '5:45 PM',  text: 'Dinner: Rotational Dining',                                   tag: 'food'     },
    ],
  },
  {
    idx: 3, day: 4, type: 'port_castaway',
    dateShort: 'July 25', dateLong: 'Saturday, July 25, 2026',
    label: 'Castaway Cay',
    events: [
      { time: '7:30 AM',  text: 'Breakfast',                                                   tag: 'food'     },
      { time: '8:30 AM',  text: 'Depart ship · Optional 5K run available',                    tag: 'included' },
      { time: '9:00 AM',  text: "Scuttle's Cove opens — kids ages 3–12",                      tag: 'included' },
      { time: '12:30 PM', text: 'Lunch on island',                                             tag: 'food'     },
      { time: '3:30 PM',  text: "Scuttle's Cove closes"                                                        },
      { time: '4:45 PM',  text: 'Return to ship',                                              tag: 'required' },
      { time: '5:45 PM',  text: 'Dinner: Rotational Dining',                                   tag: 'food'     },
    ],
  },
  {
    idx: 4, day: 5, type: 'sea',
    dateShort: 'July 26', dateLong: 'Sunday, July 26, 2026',
    label: 'Day at Sea',
    events: [
      { time: '7:30 AM',  text: 'Breakfast',                                                   tag: 'food'     },
      { time: '12:30 PM', text: 'Lunch',                                                       tag: 'food'     },
      { time: '5:45 PM',  text: 'Dinner: Rotational Dining',                                   tag: 'food'     },
    ],
  },
  {
    idx: 5, day: 6, type: 'debark',
    dateShort: 'July 27', dateLong: 'Monday, July 27, 2026',
    label: 'Cruise Debarkation',
    events: [
      { time: 'Morning',  text: 'Breakfast: Room service or Marceline Market',                 tag: 'food'     },
      { time: '8:00 AM',  text: 'Debarkation — Uber to Pelican Grand Beach Resort (families with car seats: coordinate Uber car seat options in advance)' },
      { time: '4:00 PM',  text: 'Hotel check-in: Pelican Grand, 2000 North Ocean Blvd'                         },
      { time: 'Evening',  text: 'Dinner options: Shooters Waterfront or Del Mar',              tag: 'food'     },
    ],
  },
  {
    idx: 6, day: 7, type: 'resort',
    dateShort: 'July 28', dateLong: 'Tuesday, July 28, 2026',
    label: 'Fort Lauderdale Resort Day',
    events: [],
  },
  {
    idx: 7, day: 8, type: 'return',
    dateShort: 'July 29', dateLong: 'Wednesday, July 29, 2026',
    label: 'Return Home',
    events: [
      { time: 'Morning',  text: 'Breakfast'                                                                     },
      { time: '12:00 PM', text: 'Uber to airport'                                                               },
      { time: '2:15 PM',  text: 'K-Yosties depart FLL — Breeze Airlines MX1017',             tag: 'flight'    },
      { time: '6:20 PM',  text: 'K-Yosties arrive Columbus',                                 tag: 'flight'    },
    ],
  },
];
