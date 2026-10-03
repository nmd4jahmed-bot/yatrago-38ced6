import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowLeftRight, ArrowRight, ArrowUpRight, BadgeCheck, BusFront, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Compass, Globe2, Headphones, Heart, Hotel, MapPin, Menu, Mountain, Plane, Search, ShieldCheck, Sparkles, Ticket, Users, Wallet, X } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

const services = [
  { name: 'Flights', icon: Plane },
  { name: 'Hotels', icon: Hotel },
  { name: 'Holidays', icon: Compass },
  { name: 'Buses', icon: BusFront },
  { name: 'Visa', icon: Globe2 },
] as const
type Service = (typeof services)[number]['name']
type Destination = { name: string; region: string; image: string; tag: string; price: string; days: string; description: string; highlights: string[] }
const destinations: Destination[] = [
  { name: 'Bali', region: 'Indonesia', image: 'bali.jpg', tag: 'Tropical state of mind', price: '28,499', days: '5 nights / 6 days', description: 'Slow mornings, hidden beaches, and a little island magic. Find your own rhythm between the rice terraces of Ubud and the shores of the Indian Ocean.', highlights: ['Ubud rice terraces', 'Beach time in Seminyak', 'Temple and sunset tour'] },
  { name: 'Kashmir', region: 'India', image: 'kashmir.jpg', tag: 'A breath of fresh air', price: '18,999', days: '4 nights / 5 days', description: 'Trade your everyday view for mountain peaks, peaceful lakes, and pine-lined valleys. An unhurried escape into the great outdoors.', highlights: ['Srinagar lake experience', 'Gulmarg day trip', 'Valley walks and local cuisine'] },
  { name: 'Dubai', region: 'United Arab Emirates', image: 'dubai.jpg', tag: 'Something extraordinary', price: '32,999', days: '4 nights / 5 days', description: 'A city of contrasts, from quiet desert dunes to a skyline that never stops surprising. Discover a different side of Dubai each day.', highlights: ['Downtown skyline', 'Desert evening experience', 'Old Dubai and creek walk'] },
  { name: 'Thailand', region: 'Southeast Asia', image: 'thailand.jpg', tag: 'Take the scenic route', price: '24,499', days: '5 nights / 6 days', description: 'Turquoise bays, island-hopping days, and evenings full of flavor. Leave room in your plans for a little discovery.', highlights: ['Phuket beach stay', 'Island-hopping excursion', 'Local night markets'] },
]
const image = (file: string, width = 700) => `/.netlify/images?url=/img/${file}&w=${width}&fm=webp&q=85`
function dateAfter(days: number) { const date = new Date(); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10) }

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])
  return <dialog ref={dialogRef} className="modal" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} aria-labelledby="modal-title">
    <div className="modal-top"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={21} /></button></div>{children}
  </dialog>
}

function Home() {
  const [service, setService] = useState<Service>('Flights')
  const [tripType, setTripType] = useState('One way')
  const [origin, setOrigin] = useState('New Delhi')
  const [destination, setDestination] = useState('Mumbai')
  const [departure, setDeparture] = useState(() => dateAfter(14))
  const [returnDate, setReturnDate] = useState(() => dateAfter(19))
  const [travellers, setTravellers] = useState('1')
  const [fare, setFare] = useState('Regular')
  const [cabin, setCabin] = useState('Economy')
  const [error, setError] = useState('')
  const [searchResult, setSearchResult] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [info, setInfo] = useState<'support' | 'about' | 'terms' | 'privacy' | null>(null)
  const [offer, setOffer] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [destinationOffset, setDestinationOffset] = useState(0)
  const isTransport = service === 'Flights' || service === 'Buses'
  const today = dateAfter(0)
  const selectService = (next: Service) => { setService(next); setError(''); setMenuOpen(false); if (next === 'Flights' || next === 'Buses') setDestination('Mumbai'); else if (next === 'Visa') setDestination('United Arab Emirates'); else setDestination('Bali'); }
  const search = (event: FormEvent) => {
    event.preventDefault()
    if (!destination.trim() || (isTransport && !origin.trim())) { setError('Please enter your travel locations.'); return }
    if (isTransport && origin.trim().toLowerCase() === destination.trim().toLowerCase()) { setError('Choose a destination different from your departure city.'); return }
    if (!departure || departure < today) { setError('Please choose a travel date today or later.'); return }
    if ((tripType === 'Round trip' || service === 'Hotels') && (!returnDate || returnDate < departure)) { setError('Your return or check-out date must be on or after your departure.'); return }
    setError(''); setSearchResult(true)
  }
  const destinationOrder = destinations.map((_, index) => destinations[(index + destinationOffset) % destinations.length])
  return <>
    <div className="announcement"><span>A world of possibilities. One place to start.</span><span className="announcement-right">Made for the way you travel <Sparkles size={13} /></span></div>
    <header className="header container">
      <a className="brand" href="/" aria-label="Demo home"><span className="brand-symbol"><Plane size={24} strokeWidth={2.3} /></span>demo<span className="brand-dot">.</span></a>
      <nav className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {services.map(({ name }) => <a key={name} href="#booking" className={service === name ? 'active' : ''} onClick={() => selectService(name)}>{name}{name === 'Holidays' && <span className="new-label">EXPLORE</span>}</a>)}
      </nav>
      <button className="help-button" onClick={() => setInfo('support')}><Headphones size={19} /><span>Here to help</span><ChevronDown size={14} /></button>
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section className="hero container" aria-labelledby="hero-title">
        <img className="hero-image" src={image('tropical-escape.png', 1800)} alt="Turquoise tropical bay surrounded by lush limestone islands" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-copy"><span className="eyebrow"><span /> NOT ALL WHO WANDER ARE LOST</span><h1 id="hero-title">A little away.<br />A lot more <em>alive.</em></h1><p>New places. Fresh perspectives. Stories worth telling.<br className="desktop-break" /> Let’s find your next somewhere.</p><a className="hero-link" href="#destinations">Find your inspiration <ArrowUpRight size={19} /></a></div>
        <div className="hero-location"><MapPin size={16} /><span>Somewhere you’d rather be<br /><strong>PHI PHI ISLANDS, THAILAND</strong></span></div>
        <span className="hero-pagination"><span className="current" /><span /><span /></span>
      </section>

      <section className="booking container" id="booking" aria-label="Plan your trip">
        <div className="booking-tabs" role="tablist" aria-label="Travel services">{services.map(({ name, icon: Icon }, index) => <button key={name} role="tab" id={`tab-${name}`} aria-controls="booking-panel" aria-selected={service === name} tabIndex={service === name ? 0 : -1} className={service === name ? 'selected' : ''} onClick={() => selectService(name)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? services.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : services.length - 1)) % services.length
          const nextService = services[nextIndex].name
          selectService(nextService)
          document.getElementById(`tab-${nextService}`)?.focus()
        }}><Icon size={20} />{name}{name === 'Holidays' && <span className="tab-badge">NEW</span>}</button>)}<span className="booking-caption">Your next journey starts here.</span></div>
        <form onSubmit={search} id="booking-panel" role="tabpanel" aria-labelledby={`tab-${service}`}>
          <div className="trip-options">{service === 'Flights' ? <fieldset className="trip-radios"><legend className="sr-only">Journey type</legend>{['One way', 'Round trip'].map(type => <label key={type}><input type="radio" name="trip" value={type} checked={tripType === type} onChange={() => setTripType(type)} />{type}</label>)}</fieldset> : <span className="service-note">{service === 'Hotels' ? 'A good trip starts with a great stay.' : service === 'Visa' ? 'Start planning your international adventure.' : service === 'Buses' ? 'Go a little further, for a little less.' : 'Less planning. More exploring.'}</span>}<span className="secure-note"><ShieldCheck size={14} /> Easy planning. No hidden surprises.</span></div>
          <div className={`search-fields ${isTransport ? 'transport-fields' : 'stay-fields'}`}>
            {isTransport && <label className="search-field"><span>FROM</span><input aria-label="Departure city" value={origin} onChange={event => setOrigin(event.target.value)} list="cities" required /><small>{origin === 'New Delhi' ? 'DEL, Indira Gandhi International' : 'Departure city'}</small></label>}
            {isTransport && <button type="button" className="swap-button" onClick={() => { setOrigin(destination); setDestination(origin) }} aria-label="Swap departure and destination"><ArrowLeftRight size={17} /></button>}
            <label className="search-field"><span>{isTransport ? 'TO' : service === 'Visa' ? 'DESTINATION COUNTRY' : 'DESTINATION'}</span><input aria-label="Destination" value={destination} onChange={event => setDestination(event.target.value)} list={service === 'Visa' ? 'countries' : 'cities'} required /><small>{destination === 'Mumbai' ? 'BOM, Chhatrapati Shivaji International' : service === 'Visa' ? 'Where are you headed?' : 'City, region, or a little adventure'}</small></label>
            <label className="search-field date-field"><span>{service === 'Hotels' ? 'CHECK-IN' : 'DEPARTURE'}<CalendarDays size={13} /></span><input aria-label="Departure date" type="date" value={departure} onChange={event => setDeparture(event.target.value)} min={today} required /><small>Make time for somewhere new</small></label>
            {(tripType === 'Round trip' && service === 'Flights' || service === 'Hotels') && <label className="search-field date-field"><span>{service === 'Hotels' ? 'CHECK-OUT' : 'RETURN'}<CalendarDays size={13} /></span><input type="date" aria-label="Return or check-out date" value={returnDate} min={departure} onChange={event => setReturnDate(event.target.value)} required /><small>A little longer never hurts</small></label>}
            <div className="search-field traveller-field"><label htmlFor="travellers">{service === 'Hotels' ? 'GUESTS' : 'TRAVELLERS'}<Users size={13} /></label><select id="travellers" value={travellers} onChange={event => setTravellers(event.target.value)}>{['1', '2', '3', '4', '5', '6'].map(count => <option value={count} key={count}>{count} {service === 'Hotels' ? 'Guest' : 'Traveller'}{count !== '1' ? 's' : ''}</option>)}</select>{service === 'Flights' ? <select className="cabin-select" aria-label="Cabin class" value={cabin} onChange={event => setCabin(event.target.value)}><option>Economy</option><option>Premium economy</option><option>Business</option></select> : <small>{service === 'Hotels' ? 'Find your perfect stay' : 'Good company, great memories'}</small>}</div>
            <button className="search-button" type="submit"><Search size={20} />Search<span className="sr-only"> {service}</span></button>
          </div>
          <datalist id="cities">{['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Goa', 'Kolkata', 'Bali', 'Kashmir', 'Dubai', 'Thailand'].map(city => <option key={city} value={city} />)}</datalist><datalist id="countries">{['United Arab Emirates', 'Thailand', 'Indonesia', 'Singapore', 'United Kingdom'].map(country => <option key={country} value={country} />)}</datalist>
          {service === 'Flights' && <div className="fare-types"><span>Special fares <span className="save-pill">SAVE MORE</span></span>{['Regular', 'Student', 'Senior citizen', 'Armed forces'].map(type => <label key={type} className={fare === type ? 'chosen' : ''}><input type="radio" name="fare" checked={fare === type} onChange={() => setFare(type)} />{type}</label>)}</div>}
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </section>

      <div className="trust-strip container"><span><BadgeCheck size={20} />A better way to get away</span><span><Wallet size={17} />Thoughtful prices</span><span><ShieldCheck size={17} />Transparent choices</span><span><Headphones size={17} />A helping hand</span><span className="trust-heart">Made with <Heart size={14} /> for explorers</span></div>

      <section className="offers container" id="offers"><div className="section-heading"><div><span className="section-kicker">A LITTLE EXTRA FOR YOUR JOURNEY</span><h2>Good trips. Better deals.</h2></div><button className="text-link" onClick={() => setOffer('ALL')}>Explore offers <ArrowRight size={17} /></button></div>
        <div className="offer-grid"><button className="offer-card first-offer" onClick={() => { setOffer('FIRSTFLY'); setCopied(false) }}><div className="offer-content"><span className="offer-label">YOUR FIRST FLIGHT, ON A HIGH NOTE</span><h3>New adventures.<br />A little less to pay.</h3><p>Get up to ₹1,500 off your first flight.</p><span className="offer-code">Use code <strong>FIRSTFLY</strong><ArrowUpRight size={15} /></span></div><div className="offer-art flight-art"><Plane size={91} strokeWidth={1} /><span className="flight-track" /></div></button>
        <button className="offer-card stay-offer" onClick={() => { setOffer('STAYMORE'); setCopied(false) }}><div className="offer-content"><span className="offer-label">CHECK IN. SWITCH OFF.</span><h3>A stay worth<br />staying for.</h3><p>Save up to 20% on your next hotel.</p><span className="offer-code">Use code <strong>STAYMORE</strong><ArrowUpRight size={15} /></span></div><div className="offer-art hotel-art"><Hotel size={88} strokeWidth={1} /><span /></div></button>
        <button className="offer-card holiday-offer" onClick={() => { setService('Holidays'); setSelectedDestination(destinations[3]) }}><div className="offer-content"><span className="offer-label">OUT OF OFFICE. INTO THE WORLD.</span><h3>Your holiday.<br />All figured out.</h3><p>Handpicked escapes, happy prices.</p><span className="offer-code">Explore holiday packages <ArrowUpRight size={15} /></span></div><div className="offer-art mountain-art"><Mountain size={94} strokeWidth={1} /><span className="sun" /></div></button></div>
        <span className="offer-disclaimer">Illustrative offers for this demo. No payment or booking is processed.</span>
      </section>

      <section className="destinations container" id="destinations"><div className="section-heading"><div><span className="section-kicker">FOLLOW YOUR CURIOSITY</span><h2>Where to next?</h2><p>Some places stay with you long after you leave.</p></div><div className="destination-actions"><button className="text-link" onClick={() => { selectService('Holidays'); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore destinations <ArrowRight size={17} /></button><div className="carousel-buttons"><button className="icon-button" aria-label="Previous destinations" onClick={() => setDestinationOffset((destinationOffset + 3) % 4)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next destinations" onClick={() => setDestinationOffset((destinationOffset + 1) % 4)}><ChevronRight size={18} /></button></div></div></div>
        <div className="destination-grid">{destinationOrder.map(place => <button className="destination-card" key={place.name} onClick={() => setSelectedDestination(place)}><div className="destination-image"><img src={image(place.image)} alt={`${place.name} travel destination`} loading="lazy" /><span className="destination-tag">{place.tag}</span><span className="destination-arrow"><ArrowUpRight size={21} /></span><div className="destination-image-title"><span>{place.region}</span><h3>{place.name}</h3></div></div><div className="destination-meta"><span>{place.days}</span><span>From <strong>₹{place.price}</strong><small>/ person</small></span></div></button>)}</div>
      </section>

      <section className="why-demo container"><div className="why-heading"><span className="section-kicker">LESS WORRY. MORE WONDER.</span><h2>The journey matters.<br />So do you.</h2><p>From your first search to your next adventure,<br />we keep the little things simple.</p><button className="text-link" onClick={() => setInfo('about')}>Get to know Demo <ArrowUpRight size={17} /></button></div><div className="why-items"><div><span className="why-icon"><Ticket /></span><h3>More possibility, less guesswork.</h3><p>Flights, stays, and getaways. A whole world of travel, all in one place.</p></div><div><span className="why-icon"><ShieldCheck /></span><h3>Good value. No fine-print surprises.</h3><p>Clear choices and thoughtful deals, so you can focus on the experience.</p></div><div><span className="why-icon"><Headphones /></span><h3>A real helping hand.</h3><p>Useful answers for the questions that come with every new journey.</p></div></div></section>
      <section className="closing container"><span className="closing-icon"><Compass size={33} /></span><div><h2>Your next story is out there.</h2><p>Let’s take the first step.</p></div><a href="#booking" className="primary-button">Plan your getaway <ArrowRight size={18} /></a></section>
    </main>
    <footer className="footer"><div className="container footer-main"><div><a href="/" className="brand"><span className="brand-symbol"><Plane size={22} /></span>demo<span className="brand-dot">.</span></a><p>A little away. A lot more alive.</p></div><div className="footer-links"><a href="#booking">Plan a trip</a><a href="#destinations">Find inspiration</a><button onClick={() => setInfo('about')}>About Demo</button><button onClick={() => setInfo('support')}>Help & support</button></div><span className="footer-signoff">Go somewhere.<br /><em>Feel something.</em><ArrowUpRight size={23} /></span></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Demo. A travel discovery demo.</span><div><button onClick={() => setInfo('privacy')}>Privacy</button><button onClick={() => setInfo('terms')}>Terms</button><span>India · INR ₹</span></div></div></footer>

    {searchResult && <Modal title={`Your ${service.toLowerCase()} search`} onClose={() => setSearchResult(false)}><div className="search-summary"><span className="modal-kicker">LET’S MAKE A LITTLE ROOM FOR ADVENTURE</span><h3>{isTransport ? `${origin} → ${destination}` : destination}</h3><p>{departure} {service === 'Hotels' || (service === 'Flights' && tripType === 'Round trip') ? `— ${returnDate}` : ''} · {travellers} {service === 'Hotels' ? 'guest(s)' : 'traveller(s)'}</p>{service === 'Flights' && <p>{cabin} · {fare} fare · {tripType}</p>}</div><div className="demo-notice"><Compass size={24} /><div><strong>You’re exploring a demo.</strong><p>This is a preview of the travel search experience. Live fares, availability, visa applications, and booking services aren’t connected, and no reservation has been made.</p></div></div><h4>While you’re here, find a little inspiration</h4><div className="modal-destinations">{destinations.slice(0, 2).map(place => <button key={place.name} onClick={() => { setSearchResult(false); setSelectedDestination(place) }}><img src={image(place.image, 250)} alt={place.name} /><span>{place.name}<small>{place.days}</small></span><ArrowUpRight size={18} /></button>)}</div><button className="primary-button full-width" onClick={() => setSearchResult(false)}>Back to planning <ArrowRight size={17} /></button></Modal>}
    {selectedDestination && <Modal title={`A little escape to ${selectedDestination.name}`} onClose={() => setSelectedDestination(null)}><img className="modal-destination-image" src={image(selectedDestination.image, 850)} alt={selectedDestination.name} /><div className="modal-place-meta"><span><MapPin size={15} />{selectedDestination.region}</span><span>{selectedDestination.days}</span></div><p className="modal-description">{selectedDestination.description}</p><h4>A taste of the journey</h4><ul className="highlights">{selectedDestination.highlights.map(highlight => <li key={highlight}><Check size={16} />{highlight}</li>)}</ul><div className="package-price"><span>Illustrative package price<br /><strong>₹{selectedDestination.price}</strong> / person</span><button className="primary-button" onClick={() => { const place = selectedDestination.name; selectService('Holidays'); setDestination(place); setSelectedDestination(null); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}>Plan this trip <ArrowRight size={16} /></button></div><p className="small-print">A sample itinerary, not a live offer. Accommodation, flights, and availability are not confirmed.</p></Modal>}
    {offer && <Modal title={offer === 'ALL' ? 'A little extra for your next trip' : 'Good trips. Better deals.'} onClose={() => setOffer(null)}><div className="offer-modal-icon"><Ticket size={35} /></div><h3>{offer === 'STAYMORE' ? 'Make room for a longer stay.' : offer === 'ALL' ? 'Choose your next little saving.' : 'Your first flight, on a high note.'}</h3><p className="modal-description">{offer === 'ALL' ? 'Explore the sample flight and hotel offers below.' : 'This is an illustrative promotion. It cannot be redeemed for a real booking on this demo website.'}</p>{offer === 'ALL' ? <div className="offer-list"><button onClick={() => { setOffer('FIRSTFLY'); setCopied(false) }}><Plane size={22} /><span>First flight<strong>Up to ₹1,500 off · FIRSTFLY</strong></span><ArrowRight size={18} /></button><button onClick={() => { setOffer('STAYMORE'); setCopied(false) }}><Hotel size={22} /><span>Hotel escape<strong>Up to 20% off · STAYMORE</strong></span><ArrowRight size={18} /></button></div> : <><div className="copy-code"><strong>{offer}</strong><button onClick={async () => { try { await navigator.clipboard.writeText(offer); setCopied(true) } catch { setCopied(false) } }}>{copied ? <><Check size={16} />Copied</> : 'Copy code'}</button></div><p className="small-print">Sample terms: one use per traveller, selected routes or properties only, subject to minimum booking value. These promotions are for demonstration only.</p><span className="sr-only" role="status">{copied ? 'Offer code copied' : ''}</span></>}</Modal>}
    {info && <Modal title={info === 'support' ? 'A helping hand for your journey' : info === 'about' ? 'Hello, we’re Demo.' : info === 'privacy' ? 'Your privacy matters.' : 'A note before you explore.'} onClose={() => setInfo(null)}>{info === 'support' ? <><p className="modal-description">A few useful answers before you get away.</p><div className="faq-list"><details open><summary>Can I book a trip here?</summary><p>Demo is a travel website preview. You can explore destinations and try the search form, but live inventory, payments, and bookings are not connected.</p></details><details><summary>Are these prices live?</summary><p>No. Destination prices and offers are illustrative examples, not quotes. No availability is guaranteed.</p></details><details><summary>How do I plan a return journey?</summary><p>Select Flights, choose Round trip, and enter both travel dates. For hotel stays, use the check-in and check-out dates.</p></details><details><summary>What happens to my search?</summary><p>Your search stays within this page and is not saved. There is no account or reservation created.</p></details></div></> : info === 'about' ? <><span className="modal-kicker">A LITTLE AWAY. A LOT MORE ALIVE.</span><p className="modal-description">Demo brings a world of travel inspiration into one thoughtful space. Explore flights, stays, holiday ideas, bus journeys, and visa planning with a fresh perspective.</p><p className="modal-description">This site is a travel discovery prototype. It is independently branded and is not affiliated with Skywale or a travel supplier.</p></> : info === 'privacy' ? <p className="modal-description">Demo does not ask for accounts, payment details, or personal contact information. Search selections are held temporarily in your browser’s page state and are not saved to a database. Hosting services may process standard request logs. Fonts are loaded from Google Fonts. Please do not enter sensitive information into the search fields.</p> : <p className="modal-description">Demo is a demonstration website, not a travel agency or booking platform. All fares, promotions, and itineraries are illustrative. Search results do not represent live availability. No payments, bookings, or visa applications are processed. Demo is not affiliated with Skywale or any airline, hotel, or tour operator.</p>}</Modal>}
  </>
}
