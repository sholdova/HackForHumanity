import { FormEvent, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'

type Idea = { id: string; title: string; description: string; created_at: string; author_email: string }

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showComposer, setShowComposer] = useState(false)

  const loadIdeas = async () => {
    if (!supabase) return
    setIsLoading(true); setError('')
    const { data, error: queryError } = await supabase.from('ideas').select('id,title,description,created_at,author_email').order('created_at', { ascending: false })
    if (queryError) setError('We could not load the board. Please try again.')
    else setIdeas(data as Idea[])
    setIsLoading(false)
  }

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (session) void loadIdeas() }, [session])

  const signIn = async () => {
    if (!supabase) return
    setAuthLoading(true); setError(''); setNotice('')
    const { error: signInError } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } })
    if (signInError) { setError('Sign-in could not start. Please try again.'); setAuthLoading(false) }
  }

  const submitIdea = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase || !session) return
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    const description = String(form.get('description') ?? '').trim()
    if (!title || !description) return
    setIsSaving(true); setError(''); setNotice('')
    const { error: insertError } = await supabase.from('ideas').insert({ title, description, author_id: session.user.id, author_email: session.user.email ?? 'Hackathon participant' })
    if (insertError) setError('Your idea was not saved. Please try again.')
    else { event.currentTarget.reset(); setShowComposer(false); setNotice('Idea saved to the board.'); await loadIdeas() }
    setIsSaving(false)
  }

  return <main>
    <header className="site-header"><a className="brand" href="#top">HACK <span>FOR</span> HUMANITY</a><div className="header-actions">{session ? <><span className="email">{session.user.email}</span><button className="link-button" onClick={() => void supabase?.auth.signOut()}>Sign out</button></> : <button className="sign-in" disabled={!isSupabaseConfigured || authLoading} onClick={() => void signIn()}>{authLoading ? 'Connecting…' : 'Sign in with GitHub'}</button>}</div></header>
    <section id="top" className="hero"><p className="eyebrow">IDEA BOARD</p><h1>Turn a spark into<br /><em>something real.</em></h1><p className="intro">Share the problem you want to solve. Find people who want to build it with you.</p>{session && <button className="primary" onClick={() => setShowComposer(true)}>＋ Add your idea</button>}</section>
    {!isSupabaseConfigured && <section className="status setup"><strong>Setup needed.</strong> Add the Supabase URL and anon key to connect sign-in and the idea board.</section>}
    {error && <section className="status error" role="alert"><strong>Something went wrong.</strong> {error}<button onClick={() => void loadIdeas()}>Try again</button></section>}
    {notice && <section className="status success" role="status">{notice}</section>}
    {showComposer && <section className="composer-wrap"><form className="composer" onSubmit={submitIdea}><div className="composer-heading"><div><p className="eyebrow">NEW IDEA</p><h2>What could your team build?</h2></div><button type="button" className="close" aria-label="Close idea form" onClick={() => setShowComposer(false)}>×</button></div><label>Idea name<input name="title" maxLength={80} required placeholder="e.g. A map of accessible spaces" /></label><label>Describe the problem and your first move<textarea name="description" maxLength={500} required placeholder="Who is this for, and how might you help?" rows={4} /></label><button className="primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving idea…' : 'Save idea to board'}</button></form></section>}
    <section className="board"><div className="section-heading"><div><p className="eyebrow">THE WALL</p><h2>Ideas looking for a team</h2></div>{session && <button className="secondary" onClick={() => void loadIdeas()} disabled={isLoading}>Refresh</button>}</div>{!session ? <div className="empty"><h3>Sign in to see the board.</h3><p>Join the conversation, save an idea, and start finding your teammates.</p><button className="primary" disabled={!isSupabaseConfigured || authLoading} onClick={() => void signIn()}>Sign in to get started</button></div> : isLoading ? <div className="loading"><i /><i /><i /><span>Loading fresh ideas…</span></div> : ideas.length === 0 ? <div className="empty"><h3>Be the first to put an idea on the board.</h3><p>The best projects start with one person brave enough to share a possibility.</p><button className="primary" onClick={() => setShowComposer(true)}>＋ Add the first idea</button></div> : <div className="idea-grid">{ideas.map((idea) => <article className="idea-card" key={idea.id}><p className="card-label">PITCH</p><h3>{idea.title}</h3><p>{idea.description}</p><footer><span>{idea.author_email}</span><time dateTime={idea.created_at}>{new Date(idea.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></footer></article>)}</div>}</section>
    <footer className="site-footer">Hack for Humanity <span>·</span> Make a meaningful dent.</footer>
  </main>
}
export default App
