"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search, FileText, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Über 5.000 Gründer vertrauen bereits auf StartUpAid
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Finde die{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
              richtige Förderung
            </span>
            <br />
            für dein Startup
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            StartUpAid hilft Gründern dabei, passende Förderprogramme, Zuschüsse und Tools zu finden. 
            Von der Idee bis zum erfolgreichen Launch – wir begleiten dich auf deinem Weg.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 ">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">
                Jetzt kostenlos starten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
           
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Kostenlos starten</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Keine Kreditkarte erforderlich</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Jederzeit kündbar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Alles was du brauchst, um durchzustarten
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unsere Plattform bietet dir alle nötigen Tools und Informationen, 
            um dein Startup erfolgreich zu gründen und zu skalieren.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Förderungen finden</h3>
            <p className="text-muted-foreground">
              Durchsuche unsere Datenbank mit über 500 Förderprogrammen und finde 
              die passende Finanzierung für dein Startup.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Anträge verwalten</h3>
            <p className="text-muted-foreground">
              Erstelle und verwalte deine Förderanträge zentral. 
              Nie wieder wichtige Fristen oder Dokumente vergessen.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Netzwerk nutzen</h3>
            <p className="text-muted-foreground">
              Verbinde dich mit anderen Gründern, Mentoren und Investoren 
              in unserem exklusiven Netzwerk.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Für jeden Gründungstyp</h3>
                <p className="text-muted-foreground">
                  Egal ob Tech-Startup, Social Business oder traditionelle Gründung – 
                  wir haben die passenden Programme und Tools für dich.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Erprobte Methoden</h3>
                <p className="text-muted-foreground">
                  Alle Tools und Prozesse wurden von erfolgreichen Gründern entwickelt 
                  und kontinuierlich optimiert.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit, dein Startup zu gründen?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Schließe dich tausenden von Gründern an, die bereits erfolgreich 
              mit StartUpAid durchgestartet sind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">StartUpAid</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StartUpAid. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}