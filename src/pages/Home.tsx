import { Link } from "react-router-dom"
import { ArrowRight, Sparkles, ShieldCheck, Workflow, Database } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee"
import { Reveal } from "@/components/ui/reveal"

const marqueeItems = [
    "Trusted by builder teams",
    "Graph-native RAG",
    "Agent-ready workflows",
    "Audit-friendly traces",
    "Secure by default",
    "Composable pipelines",
]

const featureSections = [
    {
        title: "Orchestrate knowledge that stays coherent",
        description:
            "Shape retrieval and reasoning into a single flow. Align documents, graph context, and agent decisions with transparent controls.",
        icon: Workflow,
    },
    {
        title: "Build with confidence across every source",
        description:
            "Blend PDFs, docs, and structured signals into one live graph. Keep it fresh, searchable, and ready for your team.",
        icon: Database,
    },
    {
        title: "Governed answers without the overhead",
        description:
            "Track sources, validate citations, and observe each step. Keep teams aligned with a clear audit trail.",
        icon: ShieldCheck,
    },
]

const bentoItems = [
    {
        title: "Graph-first memory",
        description: "Keep context grounded and persistent across sessions.",
    },
    {
        title: "Instant upload pipeline",
        description: "Drop files, watch the graph enrich in seconds.",
    },
    {
        title: "Composable agents",
        description: "Swap tools, prompts, and retrieval strategies without rewiring.",
    },
    {
        title: "Traceable reasoning",
        description: "Every answer keeps a trail you can inspect and share.",
    },
    {
        title: "Hybrid vector + graph",
        description: "Relevance meets relationships for deeper context.",
    },
    {
        title: "Production-ready UI",
        description: "Ship workflows with a polished, human-first interface.",
    },
]

const testimonials = [
    {
        quote:
            "We went from scattered docs to a reliable knowledge hub in days. The graph view makes the system feel alive.",
        name: "Priya N.",
        title: "Head of AI Enablement",
    },
    {
        quote:
            "The trace output changed how we ship. We can finally explain answers to our stakeholders.",
        name: "Marcus L.",
        title: "Product Lead",
    },
    {
        quote:
            "A premium AI surface without the enterprise complexity. It feels focused, fast, and confident.",
        name: "Elena V.",
        title: "Founder",
    },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-bg text-ink">
            <Navbar
                brand={
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                            GA
                        </span>
                        GraphAgent
                    </div>
                }
                links={[
                    { label: "Features", href: "#features" },
                    { label: "Platform", href: "#platform" },
                    { label: "Customers", href: "#testimonials" },
                ]}
                actions={
                    <Button asChild size="sm">
                        <Link to="/studio">
                            Launch Studio
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                }
            />

            <main className="relative overflow-hidden">
                <div className="absolute inset-0 hero-glow" aria-hidden="true" />
                <div className="absolute inset-0 bg-noise opacity-40" aria-hidden="true" />

                <Section className="relative pt-20 md:pt-28">
                    <Container>
                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                            <Reveal>
                                <Badge className="mb-5 w-fit" variant="secondary">
                                    <Sparkles className="h-3 w-3" />
                                    New: Graph-first orchestration
                                </Badge>
                                <div className="text-display text-xs text-muted">AI WORKFLOWS, REFINED</div>
                                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-7xl">
                                    The modern RAG studio for teams that ship with confidence
                                </h1>
                                <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
                                    Turn documents into connected intelligence. GraphAgent blends retrieval, graphs,
                                    and agent reasoning into a single, premium surface your team can trust.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Button asChild size="lg">
                                        <Link to="/studio">Start exploring</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link to="/knowledge">View knowledge base</Link>
                                    </Button>
                                </div>
                                <div className="mt-6 text-sm text-muted">
                                    Built for teams who demand clarity, traceability, and speed.
                                </div>
                            </Reveal>

                            <Reveal delay={120}>
                                <div className="grid gap-4">
                                    <Card className="rounded-xl border border-border/70 bg-surface/90 p-6 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted">Active graph</p>
                                                <p className="text-2xl font-semibold text-ink">243 nodes</p>
                                            </div>
                                            <div className="rounded-full bg-accent-soft px-3 py-1 text-xs text-ink">
                                                Live
                                            </div>
                                        </div>
                                        <div className="mt-6 h-28 rounded-lg bg-gradient-to-br from-accent/10 via-transparent to-glow-2/20" />
                                        <div className="mt-4 flex items-center gap-3 text-sm text-muted">
                                            <span className="h-2 w-2 rounded-full bg-accent" />
                                            Extraction running
                                        </div>
                                    </Card>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Card className="rounded-xl border border-border/70 bg-surface/90 p-5 shadow-sm">
                                            <p className="text-xs text-muted">Agent trace</p>
                                            <p className="mt-2 text-sm font-medium text-ink">
                                                6 reasoning steps captured
                                            </p>
                                            <p className="mt-3 text-xs text-muted">
                                                Review every tool call in context.
                                            </p>
                                        </Card>
                                        <Card className="rounded-xl border border-border/70 bg-surface/90 p-5 shadow-sm">
                                            <p className="text-xs text-muted">Knowledge sources</p>
                                            <p className="mt-2 text-sm font-medium text-ink">
                                                18 files indexed
                                            </p>
                                            <p className="mt-3 text-xs text-muted">
                                                Updated 3 min ago.
                                            </p>
                                        </Card>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </Container>
                </Section>

                <Section size="tight" className="relative">
                    <Container>
                        <Marquee items={marqueeItems.map((item) => <span key={item}>{item}</span>)} />
                    </Container>
                </Section>

                <Section id="features" className="relative">
                    <Container>
                        <Reveal>
                            <div className="max-w-2xl">
                                <div className="text-display text-xs text-muted">WHY IT WORKS</div>
                                <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                                    Everything you need to ship trusted AI experiences
                                </h2>
                                <p className="mt-4 text-base text-muted">
                                    GraphAgent blends tooling, knowledge, and execution into a single workflow so your
                                    team can design, debug, and deliver without swapping contexts.
                                </p>
                            </div>
                        </Reveal>
                        <div className="mt-12 grid gap-10">
                            {featureSections.map((feature, index) => (
                                <Reveal key={feature.title} delay={120 * index}>
                                    <div className="grid items-center gap-8 rounded-2xl border border-border/70 bg-surface/80 p-8 shadow-sm lg:grid-cols-[1fr_0.9fr]">
                                        <div>
                                            <feature.icon className="h-5 w-5 text-accent" />
                                            <h3 className="mt-4 text-2xl font-semibold text-ink">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-3 text-sm text-muted">
                                                {feature.description}
                                            </p>
                                            <div className="mt-5 flex items-center gap-3 text-sm text-muted">
                                                <span className="h-2 w-2 rounded-full bg-accent" />
                                                Tuned for clarity and scale
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-accent-soft to-white p-6">
                                            <div className="flex items-center justify-between text-xs text-muted">
                                                <span>Workflow preview</span>
                                                <span>Updated live</span>
                                            </div>
                                            <div className="mt-6 grid gap-3">
                                                <div className="h-12 rounded-lg bg-white shadow-sm" />
                                                <div className="h-12 rounded-lg bg-white shadow-sm" />
                                                <div className="h-12 rounded-lg bg-white shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </Section>

                <Section id="platform" className="relative">
                    <Container>
                        <Reveal>
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <div className="text-display text-xs text-muted">PLATFORM</div>
                                    <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                                        A bento grid of capabilities
                                    </h2>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link to="/explore">Explore the graph</Link>
                                </Button>
                            </div>
                        </Reveal>
                        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {bentoItems.map((item, index) => (
                                <Reveal key={item.title} delay={80 * index}>
                                    <Card className="h-full rounded-2xl border border-border/70 bg-surface/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                        <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                                        <p className="mt-2 text-sm text-muted">{item.description}</p>
                                    </Card>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </Section>

                <Section id="testimonials" className="relative">
                    <Container>
                        <Reveal>
                            <div className="text-display text-xs text-muted">CUSTOMERS</div>
                            <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                                Teams trust the clarity
                            </h2>
                        </Reveal>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {testimonials.map((item, index) => (
                                <Reveal key={item.name} delay={90 * index}>
                                    <Card className="h-full rounded-2xl border border-border/70 bg-surface/90 p-6 shadow-sm">
                                        <p className="text-sm text-muted">"{item.quote}"</p>
                                        <div className="mt-6 text-sm font-semibold text-ink">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-muted">{item.title}</div>
                                    </Card>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </Section>

                <Section className="relative">
                    <Container>
                        <Reveal>
                            <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-accent-soft via-white to-white px-8 py-12 shadow-md md:px-12">
                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="text-display text-xs text-muted">READY TO BUILD</div>
                                        <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                                            Create your graph-powered workspace
                                        </h2>
                                        <p className="mt-3 text-sm text-muted">
                                            Spin up a studio, upload a document, and see the graph light up.
                                        </p>
                                    </div>
                                    <Button asChild size="lg">
                                        <Link to="/studio">
                                            Get started
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Reveal>
                    </Container>
                </Section>
            </main>

            <Footer
                brand="GraphAgent"
                note="A premium AI workspace for graph-native retrieval and reasoning."
                columns={[
                    {
                        title: "Product",
                        links: [
                            { label: "Studio", href: "/studio" },
                            { label: "Knowledge", href: "/knowledge" },
                            { label: "Explore", href: "/explore" },
                        ],
                    },
                    {
                        title: "Use cases",
                        links: [
                            { label: "RAG operations", href: "#features" },
                            { label: "Agent workflows", href: "#platform" },
                            { label: "Graph search", href: "#features" },
                        ],
                    },
                    {
                        title: "Company",
                        links: [
                            { label: "Customers", href: "#testimonials" },
                            { label: "Docs", href: "/studio" },
                            { label: "Contact", href: "/studio" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
