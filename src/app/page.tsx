"use client";

import { SectionWrapper } from "@/components/landing/section-wrapper";
import { SmoothScrollLink } from "@/components/landing/smooth-scroll-link";
import { Header } from "@/components/shared/header";
import { PdfViewer } from "@/components/shared/pdf-viewer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  FileText,
  FileUp,
  Home,
  Layers,
  SearchCheck,
  ShieldCheck,
  Target,
  TrendingUp,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";

// Re-styled Feature Card for the new aesthetic
const ModernFeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => (
  <div
    className="transform rounded-xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-primary/20 md:p-8"
    style={{
      animationDelay: `${index * 100}ms`,
      animationFillMode: "backwards",
    }}
  >
    <div className="mb-4 flex items-center gap-4">
      <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
      <h3 className="font-semibold text-foreground text-xl md:text-2xl">
        {title}
      </h3>
    </div>
    <p className="text-muted-foreground text-sm md:text-base">{description}</p>
  </div>
);

// Re-styled Pricing Card
const ModernPricingCard = ({
  title,
  price,
  period,
  description,
  features,
  popular,
  ctaText,
  ctaLink,
  index,
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
  index: number;
}) => (
  <div
    className={`flex transform flex-col rounded-xl border bg-card/70 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-primary/30 md:p-8 ${
      popular
        ? "relative scale-105 border-2 border-primary"
        : "border-border/50"
    }`}
    style={{
      animationDelay: `${index * 100}ms`,
      animationFillMode: "backwards",
    }}
  >
    {popular && (
      <div className="-top-4 -translate-x-1/2 absolute left-1/2 rounded-full bg-primary px-4 py-1 font-bold text-primary-foreground text-xs shadow-lg">
        Popular
      </div>
    )}
    <div className="flex-grow">
      <h3 className="mb-2 text-center font-bold text-2xl text-foreground">
        {title}
      </h3>
      <p className="my-4 text-center font-extrabold text-4xl text-primary">
        {price}
        {period && (
          <span className="font-normal text-base text-muted-foreground">
            {period}
          </span>
        )}
      </p>
      <p className="mb-6 text-center text-muted-foreground text-sm">
        {description}
      </p>
      <ul className="mb-8 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start text-muted-foreground text-sm"
          >
            <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <Button
      asChild
      size="lg"
      className={`mt-auto w-full ${popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/20 text-primary hover:bg-primary/30"}`}
    >
      <SmoothScrollLink href={ctaLink}>{ctaText}</SmoothScrollLink>
    </Button>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <Header />

      <main className="">
        {/* Hero Section */}
        <SectionWrapper
          id="hero"
          className="bg-gradient-radial-hero pt-16 md:pt-0"
          hasPadding={false}
        >
          <div className="flex h-full animate-fade-in-up flex-col items-center justify-center px-4 text-center">
            <h1 className="font-extrabold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Decodifica tu Hipoteca. <br className="hidden sm:block" />
              <span className="text-primary">Decide con Inteligencia.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:mt-8 md:text-xl lg:max-w-2xl">
              No más jerga confusa ni sorpresas ocultas. HipotecaCopilot usa IA
              para darte claridad total sobre tu contrato hipotecario en
              minutos.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-12">
              <Button
                size="lg"
                asChild
                className="transform bg-primary px-8 py-6 text-lg text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40"
              >
                <SmoothScrollLink href="/dashboard">
                  Analiza tu Contrato Gratis
                </SmoothScrollLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="transform border-muted-foreground/50 px-8 py-6 text-lg text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <SmoothScrollLink href="#problem">
                  Descubre Cómo <ChevronRight className="ml-2 h-5 w-5" />
                </SmoothScrollLink>
              </Button>
            </div>
          </div>
        </SectionWrapper>

        {/* PDF Demo Section */}
        <SectionWrapper id="demo" className="bg-muted/30">
          <div className="w-full max-w-6xl animate-fade-in-up text-center">
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-semibold text-primary text-sm">
                Demo en Vivo
              </span>
              <h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
                Ve Nuestra <span className="text-primary">IA en Acción</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Explora este contrato hipotecario de ejemplo para ver cómo
                transformamos documentos complejos en información clara y
                accionable.
              </p>
            </div>

            {/* PDF Viewer Container */}
            <div className="mx-auto h-[600px] max-w-5xl overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl shadow-primary/10">
              <PdfViewer pdfUrl="https://cdn.codewithmosh.com/image/upload/v1721763853/guides/web-roadmap.pdf" />
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="transform bg-primary px-8 py-4 text-lg text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40"
              >
                <SmoothScrollLink href="/dashboard">
                  Prueba con tu Documento
                </SmoothScrollLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="transform border-muted-foreground/50 px-8 py-4 text-lg text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <SmoothScrollLink href="#problem">
                  Continúa Leyendo <ChevronRight className="ml-2 h-5 w-5" />
                </SmoothScrollLink>
              </Button>
            </div>
          </div>
        </SectionWrapper>

        {/* The Problem Section */}
        <SectionWrapper id="problem" className="bg-background">
          <div
            className="max-w-3xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-semibold text-primary text-sm">
              El Reto Hipotecario
            </span>
            <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              ¿Sientes que tu hipoteca es un{" "}
              <span className="text-primary">laberinto indescifrable</span>?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground md:text-xl">
              Millones de personas firman contratos que no comprenden del todo,
              enfrentándose a:
            </p>
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {[
                {
                  icon: <FileText size={32} />,
                  title: "Jerga Compleja",
                  desc: "Términos legales y financieros que parecen diseñados para confundir.",
                },
                {
                  icon: <Layers size={32} />,
                  title: "Cláusulas Ocultas",
                  desc: "Condiciones enterradas en letra pequeña con grandes implicaciones.",
                },
                {
                  icon: <DollarSign size={32} />,
                  title: "Costes Imprevistos",
                  desc: "Comisiones y gastos que aparecen cuando menos te lo esperas.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="transform rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* The Solution Section (Upload Focus) */}
        <SectionWrapper id="solution" className="bg-gradient-subtle-glow">
          <div
            className="max-w-3xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-semibold text-primary text-sm">
              Nuestra Solución
            </span>
            <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              Transforma{" "}
              <span className="text-primary">Confusión en Confianza</span> con
              un Clic.
            </h2>
            <p className="mb-12 text-lg text-muted-foreground md:text-xl">
              Sube tu borrador de hipoteca (PDF). Nuestra IA lo analiza al
              instante y te entrega un resumen claro y accionable.
            </p>
            <Card className="mx-auto max-w-lg border-2 border-primary/30 bg-card/70 p-8 shadow-2xl shadow-primary/10 backdrop-blur-md md:p-12">
              <CardHeader className="mb-6 p-0">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-semibold text-2xl text-foreground md:text-3xl">
                  Analiza tu Contrato Ahora
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  Es rápido, seguro y revelador.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Button
                  size="lg"
                  className="w-full transform bg-primary py-4 text-lg text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40"
                >
                  <SmoothScrollLink href="/dashboard">
                    <FileUp className="mr-2 h-5 w-5" />
                    Subir Documento PDF
                  </SmoothScrollLink>
                </Button>
                <p className="mt-4 text-muted-foreground text-xs">
                  Máximo 10MB. Tu privacidad está garantizada.
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>

        {/* How It Works Section */}
        <SectionWrapper id="how-it-works" className="bg-background">
          <div
            className="w-full max-w-4xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="mb-16 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              Tu Hipoteca,{" "}
              <span className="text-primary">Simplificada en 4 Pasos</span>
            </h2>
            <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Optional: Connecting lines for desktop */}
              <div
                className="-translate-y-1/2 absolute top-1/2 right-0 left-0 hidden h-px transform bg-border/50 lg:block"
                style={{ top: "calc(2.5rem + 16px)" /* icon center */ }}
              />

              {[
                {
                  icon: <UploadCloud size={36} />,
                  title: "Sube tu PDF",
                  desc: "Arrastra o selecciona tu contrato hipotecario.",
                },
                {
                  icon: <Bot size={36} />,
                  title: "Análisis IA",
                  desc: "Nuestra IA procesa y desglosa el documento.",
                },
                {
                  icon: <SearchCheck size={36} />,
                  title: "Obtén Insights",
                  desc: "Resumen claro, riesgos y costes identificados.",
                },
                {
                  icon: <ClipboardCheck size={36} />,
                  title: "Decide Informado",
                  desc: "Usa la información para negociar y elegir.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="mb-6 rounded-full border-2 border-primary/30 bg-card p-5 shadow-lg">
                    <div className="rounded-full bg-primary/10 p-4 text-primary">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-muted-foreground text-sm">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Features Section */}
        <SectionWrapper id="features" className="bg-card/30">
          <div
            className="w-full max-w-4xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              Todo lo que Necesitas para{" "}
              <span className="text-primary">Dominar tu Hipoteca</span>
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground md:text-xl">
              HipotecaCopilot te ofrece un conjunto de herramientas poderosas y
              fáciles de usar.
            </p>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {[
                {
                  icon: <Zap size={28} />,
                  title: "Análisis Instantáneo",
                  desc: "Desglosa cláusulas complejas y términos clave en segundos.",
                },
                {
                  icon: <ShieldCheck size={28} />,
                  title: "Detección de Riesgos",
                  desc: "Identifica TAEs elevados, comisiones ocultas y vinculaciones abusivas.",
                },
                {
                  icon: <DollarSign size={28} />,
                  title: "Costes Transparentes",
                  desc: "Calcula el coste total real de tu hipoteca, sin sorpresas.",
                },
                {
                  icon: <BarChart3 size={28} />,
                  title: "Comparador Inteligente",
                  desc: "Compara múltiples ofertas lado a lado de forma objetiva.",
                },
                {
                  icon: <BookOpen size={28} />,
                  title: "Glosario Interactivo",
                  desc: "Entiende cada término hipotecario con explicaciones sencillas.",
                },
                {
                  icon: <TrendingUp size={28} />,
                  title: "Simulador de Escenarios",
                  desc: "Proyecta cómo cambios en el Euríbor afectarán tu cuota.",
                },
              ].map((feature, idx) => (
                <ModernFeatureCard
                  key={feature.title}
                  index={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                />
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Use Cases Section - Simplified for full height, can be expanded */}
        <SectionWrapper id="use-cases" className="bg-background">
          <div
            className="max-w-3xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              Para <span className="text-primary">Cada Paso</span> de tu Viaje
              Financiero
            </h2>
            <p className="mb-12 text-lg text-muted-foreground md:text-xl">
              No importa si es tu primera vivienda, una refinanciación o una
              inversión, HipotecaCopilot te respalda.
            </p>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: <Home size={32} />,
                  title: "Primerizos",
                  desc: "Navega tu primera hipoteca con total confianza y evita errores comunes.",
                },
                {
                  icon: <Users size={32} />,
                  title: "Refinanciadores",
                  desc: "Optimiza tu hipoteca actual y ahorra miles comparando nuevas ofertas.",
                },
                {
                  icon: <Target size={32} />,
                  title: "Inversores",
                  desc: "Analiza la viabilidad de préstamos para tus propiedades de inversión.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="transform rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-6 inline-block rounded-full bg-primary/10 p-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="mb-3 font-semibold text-2xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="mt-12 transform border-primary px-8 py-6 text-lg text-primary transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:text-primary"
            >
              <SmoothScrollLink href="#pricing">
                Ver Planes y Precios <ArrowRight className="ml-2 h-5 w-5" />
              </SmoothScrollLink>
            </Button>
          </div>
        </SectionWrapper>

        {/* Pricing Section */}
        <SectionWrapper id="pricing" className="bg-card/30">
          <div
            className="w-full max-w-5xl animate-fade-in-up text-center"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
              Planes Claros para Decisiones Claras
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Elige la opción que mejor se adapte a tus necesidades. Empieza
              gratis y sin compromiso.
            </p>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Básico",
                  price: "Gratis",
                  period: "",
                  desc: "Para un análisis rápido de una oferta.",
                  features: [
                    "1 análisis de contrato",
                    "Identificación de riesgos básicos",
                    "Glosario de términos",
                    "Soporte comunitario",
                  ],
                  cta: "Empezar Gratis",
                  link: "/dashboard",
                },
                {
                  title: "Pro",
                  price: "€9.99",
                  period: "/mes",
                  desc: "Ideal para comparar varias opciones y análisis detallados.",
                  features: [
                    "Hasta 5 análisis",
                    "Riesgos avanzados",
                    "Comparador (hasta 3)",
                    "Simulador básico",
                    "Soporte email",
                  ],
                  popular: true,
                  cta: "Elegir Pro",
                  link: "/dashboard?plan=pro",
                },
                {
                  title: "Copilot+",
                  price: "€19.99",
                  period: "/mes",
                  desc: "Para profesionales y decisiones complejas.",
                  features: [
                    "Análisis ilimitados",
                    "Todo Pro",
                    "Comparador ilimitado",
                    "Simulador completo",
                    "Soporte prioritario",
                  ],
                  cta: "Elegir Copilot+",
                  link: "/dashboard?plan=copilot_plus",
                },
              ].map((plan) => (
                <ModernPricingCard
                  key={plan.title}
                  index={0}
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  description={plan.desc}
                  features={plan.features}
                  popular={plan.popular}
                  ctaText={plan.cta}
                  ctaLink={plan.link}
                />
              ))}
            </div>
            <p className="mt-10 text-center text-muted-foreground text-sm">
              Todos los precios incluyen IVA. Cancela en cualquier momento.
            </p>
          </div>
        </SectionWrapper>

        {/* FAQ Section */}
        <SectionWrapper id="faq" className="bg-background">
          <div
            className="w-full max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="mb-12 text-center">
              <h2 className="font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">
                Preguntas Frecuentes
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  q: "¿Qué tipo de documentos puedo subir?",
                  a: "Actualmente, HipotecaCopilot está optimizado para analizar borradores de contratos hipotecarios en formato PDF proporcionados por entidades bancarias en España.",
                },
                {
                  q: "¿Es seguro subir mis documentos?",
                  a: "La seguridad y privacidad de tus datos son nuestra máxima prioridad. Utilizamos encriptación y medidas de seguridad estándar de la industria. Tus documentos se procesan de forma anónima y no se comparten con terceros.",
                },
                {
                  q: "¿Puede HipotecaCopilot reemplazar a un asesor financiero?",
                  a: "HipotecaCopilot es una herramienta de IA diseñada para ayudarte a entender mejor tu hipoteca. No sustituye el consejo personalizado de un asesor financiero cualificado.",
                },
                {
                  q: "¿Cómo funciona la IA detrás del análisis?",
                  a: "Utilizamos modelos de lenguaje avanzados (LLMs) entrenados específicamente en terminología y estructuras de contratos hipotecarios. La IA extrae información, la clasifica y la presenta de forma comprensible.",
                },
              ].map((item) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${item.q.slice(0, 10)}`}
                  className="rounded-xl border border-border/50 bg-card/50 shadow-md backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-foreground text-lg hover:text-primary hover:no-underline md:text-xl">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-base text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SectionWrapper>
      </main>

      {/* Footer */}
      <footer className="border-border/30 border-t bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <SmoothScrollLink
                href="#hero"
                className="group mb-4 flex items-center gap-2"
              >
                <Bot className="h-8 w-8 text-primary group-hover:animate-subtle-pulse" />
                <span className="font-bold text-2xl text-foreground">
                  Hipoteca<span className="text-primary">Copilot</span>
                </span>
              </SmoothScrollLink>
              <p className="text-muted-foreground text-sm">
                Entiende tu hipoteca, toma el control.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-foreground text-md">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                {[
                  { href: "#problem", label: "El Reto" },
                  { href: "#solution", label: "Solución" },
                  { href: "#features", label: "Capacidades" },
                  { href: "#pricing", label: "Planes" },
                  { href: "#faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.label}>
                    <SmoothScrollLink
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {link.label}
                    </SmoothScrollLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-foreground text-md">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <SmoothScrollLink
                    href="/landing/privacy"
                    className="text-muted-foreground text-sm hover:text-primary"
                  >
                    Política de Privacidad
                  </SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink
                    href="/landing/terms"
                    className="text-muted-foreground text-sm hover:text-primary"
                  >
                    Términos de Servicio
                  </SmoothScrollLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border/30 border-t pt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} HipotecaCopilot. Todos los
            derechos reservados. Una herramienta para entender, no un consejo
            financiero.
          </div>
        </div>
      </footer>
    </div>
  );
}
