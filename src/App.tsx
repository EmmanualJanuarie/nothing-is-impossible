import {
  CalendarDays,
  Facebook,
  Heart,
  ImagePlus,
  Instagram,
  Lock,
  LogOut,
  Mic2,
  Music2,
  Pencil,
  Plus,
  Send,
  Ticket,
  Trash2,
  Video,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Release = {
  id: string;
  title: string;
  date: string;
  platform: string;
  link: string;
  cover: string;
};

type EventItem = {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  ticketPrice: string;
  ticketLink: string;
  ticketTotal: number;
  ticketsLeft: number;
};

type Post = {
  id: string;
  title: string;
  message: string;
  date: string;
};

type Story = {
  headline: string;
  body: string;
  image: string;
};

type SocialPlatform = "tiktok" | "instagram" | "facebook";

type SocialStory = {
  platform: SocialPlatform;
  label: string;
  profileUrl: string;
  storyTitle: string;
  storyText: string;
  storyUrl: string;
  updatedAt: string;
};

type BackgroundTheme =
  | "theme-default"
  | "theme-christmas"
  | "theme-breast-cancer"
  | "theme-love"
  | "theme-human-rights"
  | "theme-freedom"
  | "theme-heritage"
  | "theme-youth-day"
  | "theme-womens-day"
  | "theme-workers-day"
  | "theme-rugby"
  | "theme-gospel";

type SiteData = {
  artistName: string;
  heroLine: string;
  heroImage: string;
  backgroundTheme: BackgroundTheme;
  whatsappNumber: string;
  whatsappTicketMessage: string;
  loveCount: number;
  story: Story;
  releases: Release[];
  events: EventItem[];
  posts: Post[];
  socials: Record<SocialPlatform, SocialStory>;
};

const STORAGE_KEY = "nothing-is-impossible-site";
const ADMIN_KEY = "nothing-is-impossible-admin";
const ADMIN_PASSCODE = "gift2026";
const ADMIN_EMAIL = "admin@nothingisimpossible.com";
const ADMIN_PATH = "/studio-gift";

const emptyRelease: Omit<Release, "id"> = {
  title: "",
  date: "",
  platform: "",
  link: "",
  cover: "",
};

const emptyEvent: Omit<EventItem, "id"> = {
  title: "",
  venue: "",
  city: "",
  date: "",
  time: "",
  ticketPrice: "",
  ticketLink: "",
  ticketTotal: 0,
  ticketsLeft: 0,
};

const emptyPost: Omit<Post, "id"> = {
  title: "",
  message: "",
  date: new Date().toISOString().slice(0, 10),
};

const socialPlatforms: SocialPlatform[] = ["tiktok", "instagram", "facebook"];

const backgroundThemes: Array<{ label: string; value: BackgroundTheme }> = [
  { label: "Default clean", value: "theme-default" },
  { label: "Christmas / New Year", value: "theme-christmas" },
  { label: "Breast Cancer Awareness", value: "theme-breast-cancer" },
  { label: "Valentine's / Love", value: "theme-love" },
  { label: "Human Rights Day", value: "theme-human-rights" },
  { label: "Freedom Day", value: "theme-freedom" },
  { label: "National Braai / Heritage Day", value: "theme-heritage" },
  { label: "Youth Day", value: "theme-youth-day" },
  { label: "Women's Day", value: "theme-womens-day" },
  { label: "Workers' Day", value: "theme-workers-day" },
  { label: "Rugby World Cup / Match Day", value: "theme-rugby" },
  { label: "Gospel / Worship Night", value: "theme-gospel" },
];

const seedData: SiteData = {
  artistName: "Nothing Is Impossible",
  heroLine: "Singer, survivor, storyteller. Every song carries light from the fight he already won.",
  heroImage: "",
  backgroundTheme: "theme-default",
  whatsappNumber: "",
  whatsappTicketMessage: "Hi, I would like to buy tickets for",
  loveCount: 128,
  story: {
    headline: "A voice that came through the fire",
    body:
      "He faced cancer with faith, music, and the people who refused to let him stand alone. Beating it did not just give him more time, it gave every lyric a deeper reason. This space shares the music, the healing, and the message that nothing is impossible.",
    image: "",
  },
  releases: [
    {
      id: "release-1",
      title: "New Dawn",
      date: "2026-08-02",
      platform: "Spotify, Apple Music",
      link: "",
      cover: "",
    },
    {
      id: "release-2",
      title: "Still Standing",
      date: "2026-09-14",
      platform: "All platforms",
      link: "",
      cover: "",
    },
  ],
  events: [
    {
      id: "event-1",
      title: "Acoustic Night",
      venue: "The Garden Room",
      city: "Johannesburg",
      date: "2026-08-21",
      time: "19:30",
      ticketPrice: "R180",
      ticketLink: "",
      ticketTotal: 120,
      ticketsLeft: 34,
    },
    {
      id: "event-2",
      title: "Hope Sessions",
      venue: "City Hall",
      city: "Pretoria",
      date: "2026-10-05",
      time: "18:00",
      ticketPrice: "R250",
      ticketLink: "",
      ticketTotal: 300,
      ticketsLeft: 188,
    },
  ],
  posts: [
    {
      id: "post-1",
      title: "To everyone still fighting",
      message:
        "You are not your diagnosis, your scar, or your hardest day. Keep breathing. Keep singing. Keep believing.",
      date: "2026-07-04",
    },
  ],
  socials: {
    tiktok: {
      platform: "tiktok",
      label: "TikTok",
      profileUrl: "",
      storyTitle: "Studio warm-up",
      storyText: "A quick behind-the-scenes vocal run before the next release.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
    instagram: {
      platform: "instagram",
      label: "Instagram",
      profileUrl: "",
      storyTitle: "Thank you for the love",
      storyText: "A short message for everyone supporting the journey and the music.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
    facebook: {
      platform: "facebook",
      label: "Facebook",
      profileUrl: "",
      storyTitle: "Next show update",
      storyText: "New event details, tickets, and a note for the people coming through.",
      storyUrl: "",
      updatedAt: "2026-07-04",
    },
  },
};

export function App() {
  const [data, setData] = useState<SiteData>(() => cleanExpiredEvents(loadData()));
  const [route, setRoute] = useState(() => window.location.pathname);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === "true");

  useEffect(() => {
    const cleaned = cleanExpiredEvents(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    if (cleaned.events.length !== data.events.length) {
      setData(cleaned);
    }
  }, [data]);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const updateData = (next: SiteData) => setData(cleanExpiredEvents(next));

  if (route.startsWith("/admin")) {
    if (window.location.pathname !== "/") {
      window.history.replaceState({}, "", "/");
    }
    return <PublicSite data={data} onNavigate={navigate} onUpdate={updateData} />;
  }

  if (route.startsWith(ADMIN_PATH)) {
    return (
      <AdminPage
        data={data}
        isAdmin={isAdmin}
        onLogin={() => {
          localStorage.setItem(ADMIN_KEY, "true");
          setIsAdmin(true);
        }}
        onLogout={() => {
          localStorage.removeItem(ADMIN_KEY);
          setIsAdmin(false);
        }}
        onNavigate={navigate}
        onUpdate={updateData}
      />
    );
  }

  return <PublicSite data={data} onNavigate={navigate} onUpdate={updateData} />;
}

function PublicSite({
  data,
  onNavigate,
  onUpdate,
}: {
  data: SiteData;
  onNavigate: (path: string) => void;
  onUpdate: (data: SiteData) => void;
}) {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const nextEvent = useMemo(
    () => [...data.events].sort((a, b) => a.date.localeCompare(b.date))[0],
    [data.events]
  );

  useEffect(() => {
    if (!creditsOpen) return;

    let previousScrollY = window.scrollY;
    const closeOnScrollUp = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < previousScrollY - 8) {
        setCreditsOpen(false);
      }
      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", closeOnScrollUp, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScrollUp);
  }, [creditsOpen]);

  return (
    <main className={`site-shell ${data.backgroundTheme}`}>
      <ThemeStrip theme={data.backgroundTheme} />
      <nav className="topbar glass">
        <button className="brand-button" onClick={() => onNavigate("/")}>
          <span className="brand-mark">NiIM</span>
          <span>{data.artistName}</span>
        </button>
        <div className="nav-links">
          <a href="#music">Music</a>
          <a href="#events">Events</a>
          <a href="#socials">Socials</a>
          <a href="#story">Story</a>
          <button className="studio-button" aria-label="Open admin studio" onClick={() => onNavigate(ADMIN_PATH)}>
            <Lock size={16} />
            <span>Studio</span>
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Official profile</p>
          <h1>{data.artistName}</h1>
          <p>{data.heroLine}</p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onUpdate({ ...data, loveCount: data.loveCount + 1 })}
            >
              <Heart size={18} fill="currentColor" />
              Love you
            </button>
            <a className="secondary-button" href="#story">
              My story
            </a>
          </div>
          <p className="love-note">{formatCompactCount(data.loveCount)} people send love</p>
        </div>
        <div className="hero-visual">
          {data.heroImage ? (
            <img src={data.heroImage} alt={`${data.artistName} portrait`} />
          ) : (
            <div className="photo-placeholder">
              <Mic2 size={56} />
              <span>Add his portrait in admin</span>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-band">
        <div className="metric">
          <span>Next show</span>
          <strong>{nextEvent ? nextEvent.date : "Coming soon"}</strong>
        </div>
        <div className="metric">
          <span>Releases</span>
          <strong>{data.releases.length}</strong>
        </div>
        <div className="metric">
          <span>Fan love</span>
          <strong>{formatCompactCount(data.loveCount)}</strong>
        </div>
      </section>

      <section id="music" className="section">
        <div className="section-heading">
          <p className="eyebrow">New song releases</p>
          <h2>Listen to what is next</h2>
        </div>
        <div className="release-grid">
          {data.releases.map((release) => (
            <article className="release-card" key={release.id}>
              <div className="cover">
                {release.cover ? <img src={release.cover} alt={`${release.title} cover`} /> : <Music2 size={38} />}
              </div>
              <div>
                <p>{formatDate(release.date)}</p>
                <h3>{release.title}</h3>
                <span>{release.platform}</span>
              </div>
              {release.link && (
                <a className="text-link" href={release.link} target="_blank" rel="noreferrer">
                  Listen
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="events" className="section split-section">
        <div className="section-heading">
          <p className="eyebrow">Live dates</p>
          <h2>Where he is playing</h2>
        </div>
        <div className="event-list">
          {data.events.length === 0 && <p className="muted">No upcoming events yet.</p>}
          {data.events.map((event) => (
            <article className="event-row" key={event.id}>
              <div className="date-pill">
                <span>{month(event.date)}</span>
                <strong>{day(event.date)}</strong>
              </div>
              <div>
                <h3>{event.title}</h3>
                <p>
                  {event.venue}, {event.city} at {event.time}
                </p>
              </div>
              <div className="ticket">
                <TicketMeter event={event} />
                <strong>{event.ticketPrice}</strong>
                <TicketActions data={data} event={event} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="story" className="story-section">
        <div className="story-image">
          {data.story.image ? <img src={data.story.image} alt="Story portrait" /> : <CalendarDays size={54} />}
        </div>
        <div>
          <p className="eyebrow">My story</p>
          <h2>{data.story.headline}</h2>
          <p>{data.story.body}</p>
        </div>
      </section>

      <section id="socials" className="section">
        <div className="section-heading">
          <p className="eyebrow">Social stories</p>
          <h2>Follow the latest moments</h2>
        </div>
        <div className="social-grid">
          {socialPlatforms.map((platform) => (
            <SocialCard social={data.socials[platform]} key={platform} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Words for the people</p>
          <h2>Messages to fans</h2>
        </div>
        <div className="post-grid">
          {data.posts.map((post) => (
            <article className="post-card" key={post.id}>
              <span>{formatDate(post.date)}</span>
              <h3>{post.title}</h3>
              <p>{post.message}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer" id="credits">
        <button
          className="credits-link"
          type="button"
          aria-expanded={creditsOpen}
          aria-controls="credits-panel"
          onClick={() => setCreditsOpen((open) => !open)}
        >
          Framework and icon credits
        </button>
        <div className={`credits-panel ${creditsOpen ? "is-open" : ""}`} id="credits-panel">
          <p>
            Built with <a href="https://react.dev/" target="_blank" rel="noreferrer">React</a>,{" "}
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">TypeScript</a>, and{" "}
            <a href="https://vite.dev/" target="_blank" rel="noreferrer">Vite</a>.
          </p>
          <p>
            Icons by <a href="https://lucide.dev/" target="_blank" rel="noreferrer">Lucide</a>.
          </p>
        </div>
      </footer>
    </main>
  );
}

function AdminPage({
  data,
  isAdmin,
  onLogin,
  onLogout,
  onNavigate,
  onUpdate,
}: {
  data: SiteData;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  onUpdate: (data: SiteData) => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [release, setRelease] = useState(emptyRelease);
  const [event, setEvent] = useState(emptyEvent);
  const [post, setPost] = useState(emptyPost);
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const login = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && passcode === ADMIN_PASSCODE) {
      setError("");
      onLogin();
    } else {
      setError("Incorrect email or password.");
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-login">
        <form className="login-panel glass" onSubmit={login}>
          <button type="button" className="brand-button" onClick={() => onNavigate("/")}>
            <span className="brand-mark">NiIM</span>
            <span>{data.artistName}</span>
          </button>
          <div className="login-copy">
            <h1>Private studio</h1>
            <p>Only your friend can update releases, shows, messages, and story details.</p>
          </div>
          <div className="login-fields">
            <label>
              Email
              <input
                required
                autoComplete="email"
                inputMode="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                required
                autoComplete="current-password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                type="password"
              />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary-button" type="submit">
            <Lock size={18} />
            Log in
          </button>
          <p className="hint">Demo email: admin@nothingisimpossible.com - Password: gift2026</p>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar glass">
        <button className="brand-button" onClick={() => onNavigate("/")}>
          <span className="brand-mark">NiIM</span>
          <span>Public site</span>
        </button>
        <div>
          <h1>Studio</h1>
          <p>Update what fans see.</p>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <section className="admin-content">
        <Panel title="Profile">
          <div className="form-grid">
            <label>
              Artist name
              <input value={data.artistName} onChange={(e) => onUpdate({ ...data, artistName: e.target.value })} />
            </label>
            <label>
              Hero line
              <input value={data.heroLine} onChange={(e) => onUpdate({ ...data, heroLine: e.target.value })} />
            </label>
            <label>
              Client background theme
              <select
                value={data.backgroundTheme}
                onChange={(e) => onUpdate({ ...data, backgroundTheme: e.target.value as BackgroundTheme })}
              >
                {backgroundThemes.map((theme) => (
                  <option value={theme.value} key={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              WhatsApp Business number
              <input
                placeholder="Example: 27821234567"
                value={data.whatsappNumber}
                onChange={(e) => onUpdate({ ...data, whatsappNumber: e.target.value })}
              />
            </label>
            <label>
              Ticket WhatsApp message
              <input
                value={data.whatsappTicketMessage}
                onChange={(e) => onUpdate({ ...data, whatsappTicketMessage: e.target.value })}
              />
            </label>
          </div>
          <ImagePicker
            label="Hero photo"
            value={data.heroImage}
            onChange={(heroImage) => onUpdate({ ...data, heroImage })}
          />
        </Panel>

        <Panel title="My story">
          <label>
            Headline
            <input
              value={data.story.headline}
              onChange={(e) => onUpdate({ ...data, story: { ...data.story, headline: e.target.value } })}
            />
          </label>
          <label>
            Story
            <textarea
              value={data.story.body}
              onChange={(e) => onUpdate({ ...data, story: { ...data.story, body: e.target.value } })}
            />
          </label>
          <ImagePicker
            label="Story photo"
            value={data.story.image}
            onChange={(image) => onUpdate({ ...data, story: { ...data.story, image } })}
          />
        </Panel>

        <Panel title="Social stories">
          <div className="social-admin-grid">
            {socialPlatforms.map((platform) => (
              <SocialAdminCard
                key={platform}
                social={data.socials[platform]}
                onChange={(social) =>
                  onUpdate({
                    ...data,
                    socials: {
                      ...data.socials,
                      [platform]: social,
                    },
                  })
                }
              />
            ))}
          </div>
        </Panel>

        <Panel title={editingReleaseId ? "Edit song release" : "Add song release"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const nextReleases = editingReleaseId
                ? data.releases.map((item) => (item.id === editingReleaseId ? { ...release, id: editingReleaseId } : item))
                : [{ ...release, id: crypto.randomUUID() }, ...data.releases];
              onUpdate({ ...data, releases: nextReleases });
              setRelease(emptyRelease);
              setEditingReleaseId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Song title
                <input required value={release.title} onChange={(e) => setRelease({ ...release, title: e.target.value })} />
              </label>
              <label>
                Release date
                <input required type="date" value={release.date} onChange={(e) => setRelease({ ...release, date: e.target.value })} />
              </label>
              <label>
                Platform
                <input value={release.platform} onChange={(e) => setRelease({ ...release, platform: e.target.value })} />
              </label>
              <label>
                Listen link
                <input value={release.link} onChange={(e) => setRelease({ ...release, link: e.target.value })} />
              </label>
            </div>
            <ImagePicker label="Cover image" value={release.cover} onChange={(cover) => setRelease({ ...release, cover })} />
            <button className="primary-button" type="submit">
              {editingReleaseId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingReleaseId ? "Save release" : "Add release"}
            </button>
            {editingReleaseId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingReleaseId(null);
                  setRelease(emptyRelease);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.releases}
            onEdit={(item) => {
              setEditingReleaseId(item.id);
              setRelease({
                title: item.title,
                date: item.date,
                platform: item.platform,
                link: item.link,
                cover: item.cover,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, releases: data.releases.filter((item) => item.id !== id) })}
          />
        </Panel>

        <Panel title={editingEventId ? "Edit event" : "Add event"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const normalizedEvent = {
                ...event,
                ticketTotal: Number(event.ticketTotal) || 0,
                ticketsLeft: Math.min(Number(event.ticketsLeft) || 0, Number(event.ticketTotal) || 0),
              };
              const nextEvents = editingEventId
                ? data.events.map((item) => (item.id === editingEventId ? { ...normalizedEvent, id: editingEventId } : item))
                : [...data.events, { ...normalizedEvent, id: crypto.randomUUID() }];
              onUpdate({ ...data, events: nextEvents });
              setEvent(emptyEvent);
              setEditingEventId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Event name
                <input required value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} />
              </label>
              <label>
                Date
                <input required type="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} />
              </label>
              <label>
                Time
                <input type="time" value={event.time} onChange={(e) => setEvent({ ...event, time: e.target.value })} />
              </label>
              <label>
                Venue
                <input value={event.venue} onChange={(e) => setEvent({ ...event, venue: e.target.value })} />
              </label>
              <label>
                City
                <input value={event.city} onChange={(e) => setEvent({ ...event, city: e.target.value })} />
              </label>
              <label>
                Ticket price
                <input value={event.ticketPrice} onChange={(e) => setEvent({ ...event, ticketPrice: e.target.value })} />
              </label>
              <label>
                Ticket link
                <input value={event.ticketLink} onChange={(e) => setEvent({ ...event, ticketLink: e.target.value })} />
              </label>
              <label>
                Total tickets
                <input
                  min="0"
                  type="number"
                  value={event.ticketTotal}
                  onChange={(e) => setEvent({ ...event, ticketTotal: Number(e.target.value) })}
                />
              </label>
              <label>
                Tickets left
                <input
                  min="0"
                  type="number"
                  value={event.ticketsLeft}
                  onChange={(e) => setEvent({ ...event, ticketsLeft: Number(e.target.value) })}
                />
              </label>
            </div>
            <button className="primary-button" type="submit">
              {editingEventId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingEventId ? "Save event" : "Add event"}
            </button>
            {editingEventId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setEvent(emptyEvent);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.events}
            onEdit={(item) => {
              setEditingEventId(item.id);
              setEvent({
                title: item.title,
                venue: item.venue,
                city: item.city,
                date: item.date,
                time: item.time,
                ticketPrice: item.ticketPrice,
                ticketLink: item.ticketLink,
                ticketTotal: item.ticketTotal,
                ticketsLeft: item.ticketsLeft,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, events: data.events.filter((item) => item.id !== id) })}
          />
        </Panel>

        <Panel title={editingPostId ? "Edit fan message" : "Fan message"}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const nextPosts = editingPostId
                ? data.posts.map((item) => (item.id === editingPostId ? { ...post, id: editingPostId } : item))
                : [{ ...post, id: crypto.randomUUID() }, ...data.posts];
              onUpdate({ ...data, posts: nextPosts });
              setPost(emptyPost);
              setEditingPostId(null);
            }}
          >
            <div className="form-grid">
              <label>
                Title
                <input required value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
              </label>
              <label>
                Date
                <input type="date" value={post.date} onChange={(e) => setPost({ ...post, date: e.target.value })} />
              </label>
            </div>
            <label>
              Message
              <textarea required value={post.message} onChange={(e) => setPost({ ...post, message: e.target.value })} />
            </label>
            <button className="primary-button" type="submit">
              {editingPostId ? <Pencil size={18} /> : <Send size={18} />}
              {editingPostId ? "Save message" : "Publish"}
            </button>
            {editingPostId && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  setPost(emptyPost);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
          <EditableList
            items={data.posts}
            onEdit={(item) => {
              setEditingPostId(item.id);
              setPost({
                title: item.title,
                message: item.message,
                date: item.date,
              });
            }}
            onDelete={(id) => onUpdate({ ...data, posts: data.posts.filter((item) => item.id !== id) })}
          />
        </Panel>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function EditableList<T extends { id: string; title: string }>({
  items,
  onEdit,
  onDelete,
}: {
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="editable-list">
      {items.map((item) => (
        <div className="editable-item" key={item.id}>
          <span>{item.title}</span>
          <div className="editable-actions">
            <button className="icon-button" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}>
              <Pencil size={17} />
            </button>
            <button className="icon-button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}>
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketMeter({ event }: { event: EventItem }) {
  const total = Math.max(event.ticketTotal || 0, event.ticketsLeft || 0);
  const left = Math.max(0, event.ticketsLeft || 0);
  const soldPercent = total > 0 ? Math.min(100, Math.round(((total - left) / total) * 100)) : 0;

  return (
    <div className="ticket-meter" aria-label={`${left} tickets left for ${event.title}`}>
      <div className="ticket-stack" aria-hidden="true">
        <Ticket size={27} />
        <Ticket size={27} />
        <Ticket size={27} />
      </div>
      <div className="ticket-copy">
        <span>{total > 0 ? `${left.toLocaleString()} tickets left` : "Tickets soon"}</span>
        {total > 0 && (
          <div className="ticket-track">
            <i style={{ width: `${soldPercent}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function TicketActions({ data, event }: { data: SiteData; event: EventItem }) {
  const whatsappLink = buildWhatsAppTicketLink(data, event);

  return (
    <div className="ticket-actions">
      {event.ticketLink && (
        <a href={event.ticketLink} target="_blank" rel="noreferrer">
          Tickets
        </a>
      )}
      {whatsappLink ? (
        <a className="buy-ticket-button" href={whatsappLink} target="_blank" rel="noreferrer">
          Buy ticket
        </a>
      ) : (
        <span className="buy-ticket-button disabled">Buy ticket</span>
      )}
    </div>
  );
}

function SocialCard({ social }: { social: SocialStory }) {
  const Icon = social.platform === "instagram" ? Instagram : social.platform === "facebook" ? Facebook : Video;
  const href = social.storyUrl || social.profileUrl;

  return (
    <article className={`social-card ${social.platform}`}>
      <div className="social-card-top">
        <span className="social-icon">
          <Icon size={22} />
        </span>
        <div>
          <p>{social.label}</p>
          <span>{formatDate(social.updatedAt)}</span>
        </div>
      </div>
      <div className="social-story-card">
        <h3>{social.storyTitle || "Latest story coming soon"}</h3>
        <p>{social.storyText || "No story has been added yet."}</p>
      </div>
      {href ? (
        <a className="social-link" href={href} target="_blank" rel="noreferrer">
          Open latest story
        </a>
      ) : (
        <span className="social-link disabled">Link coming soon</span>
      )}
    </article>
  );
}

function ThemeStrip({ theme }: { theme: BackgroundTheme }) {
  if (theme === "theme-default") return null;

  const label = backgroundThemes.find((item) => item.value === theme)?.label ?? "Nothing Is Impossible";
  const messageByTheme: Record<BackgroundTheme, string> = {
    "theme-default": "Nothing Is Impossible",
    "theme-christmas": "Merry Christmas",
    "theme-breast-cancer": "Breast Cancer Awareness",
    "theme-love": "Love and light",
    "theme-human-rights": "Happy Human Rights Day",
    "theme-freedom": "Happy Freedom Day",
    "theme-heritage": "Happy National Braai Day",
    "theme-youth-day": "Happy Youth Day",
    "theme-womens-day": "Happy Women's Day",
    "theme-workers-day": "Happy Workers' Day",
    "theme-rugby": "Go Bokke",
    "theme-gospel": "Worship Night",
  };
  const message = messageByTheme[theme] || label;
  const repeated = Array.from({ length: 9 }, () => `${message} •`);

  return (
    <aside className="theme-strip" aria-label={`Current theme: ${label}`}>
      <div>
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </aside>
  );
}

function SocialAdminCard({
  social,
  onChange,
}: {
  social: SocialStory;
  onChange: (social: SocialStory) => void;
}) {
  const update = (changes: Partial<SocialStory>) => onChange({ ...social, ...changes });

  return (
    <div className="social-admin-card">
      <h3>{social.label}</h3>
      <label>
        Profile link
        <input value={social.profileUrl} onChange={(e) => update({ profileUrl: e.target.value })} />
      </label>
      <label>
        Latest story title
        <input value={social.storyTitle} onChange={(e) => update({ storyTitle: e.target.value })} />
      </label>
      <label>
        Latest story message
        <textarea value={social.storyText} onChange={(e) => update({ storyText: e.target.value })} />
      </label>
      <label>
        Story link
        <input value={social.storyUrl} onChange={(e) => update({ storyUrl: e.target.value })} />
      </label>
      <label>
        Updated date
        <input type="date" value={social.updatedAt} onChange={(e) => update({ updatedAt: e.target.value })} />
      </label>
    </div>
  );
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-picker">
      <label className="file-button">
        <ImagePlus size={18} />
        {label}
        <input type="file" accept="image/*" onChange={pickImage} />
      </label>
      {value && (
        <button className="ghost-button" type="button" onClick={() => onChange("")}>
          Remove image
        </button>
      )}
    </div>
  );
}

function loadData(): SiteData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedData;

  try {
    const parsed = { ...seedData, ...JSON.parse(raw) } as SiteData;
    return {
      ...parsed,
      backgroundTheme: parsed.backgroundTheme ?? seedData.backgroundTheme,
      whatsappNumber: parsed.whatsappNumber ?? seedData.whatsappNumber,
      whatsappTicketMessage: parsed.whatsappTicketMessage ?? seedData.whatsappTicketMessage,
      socials: {
        ...seedData.socials,
        ...(parsed.socials ?? {}),
      },
      events: parsed.events.map((event) => ({
        ...event,
        ticketTotal: event.ticketTotal ?? seedData.events.find((seedEvent) => seedEvent.id === event.id)?.ticketTotal ?? 0,
        ticketsLeft: event.ticketsLeft ?? seedData.events.find((seedEvent) => seedEvent.id === event.id)?.ticketsLeft ?? 0,
      })),
    };
  } catch {
    return seedData;
  }
}

function cleanExpiredEvents(data: SiteData): SiteData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    ...data,
    events: data.events.filter((event) => {
      const eventDate = new Date(`${event.date}T23:59:59`);
      return eventDate >= today;
    }),
  };
}

function formatDate(date: string) {
  if (!date) return "Date coming soon";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

function month(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(date));
}

function day(date: string) {
  return new Intl.DateTimeFormat("en", { day: "2-digit" }).format(new Date(date));
}

function formatCompactCount(value: number) {
  if (value < 1000) return value.toLocaleString();

  const formatter = new Intl.NumberFormat("en", {
    compactDisplay: "short",
    maximumFractionDigits: value < 100000 ? 1 : 0,
    notation: "compact",
  });

  return formatter.format(value).toUpperCase();
}

function buildWhatsAppTicketLink(data: SiteData, event: EventItem) {
  const number = data.whatsappNumber.replace(/\D/g, "");
  if (!number) return "";

  const message = [
    data.whatsappTicketMessage || "Hi, I would like to buy tickets for",
    `${event.title}.`,
    event.ticketPrice ? `Ticket price: ${event.ticketPrice}.` : "",
    event.date ? `Date: ${formatDate(event.date)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
