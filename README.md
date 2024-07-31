# Hugo 2.0 - Moodle Plugin

## Einleitung

Dieses Repository enthält den Quellcode für das Moodle-Plugin des Hugo 2.0 Projekts. Das Plugin integriert den KI-gestützten Chatbot Hugo in das Moodle-Lernmanagementsystem (LMS), um Lehrkräften und Schüler:innen erweiterte Interaktionsmöglichkeiten und personalisierte Lernerfahrungen zu bieten. Entwickelt wurde das Plugin im Rahmen des Projekts an der Eckener-Schule, um die Nutzung von Künstlicher Intelligenz im Bildungsbereich zu fördern.

## Zielsetzung

Ziel des Plugins ist es, die nahtlose Integration des Hugo 2.0 Backends in Moodle zu gewährleisten. Dies ermöglicht den Einsatz von KI-basierten Tools zur Verbesserung der Lernprozesse, insbesondere durch die Nutzung von "Brains" - individuelle KI-Modelle, die von Lehrkräften für spezifische Kursanforderungen konfiguriert werden können.

## Projektstruktur

### Plugin-Architektur

- **Integration:** Verknüpfung des Moodle-Systems mit dem Hugo 2.0 Backend
- **Benutzeroberfläche:** Einfache Verwaltung von Kurs- und Chatbot-Einstellungen
- **Datenverwaltung:** Nutzung von Vektordatenbanken zur Speicherung und Analyse von Kursinhalten
- **Rollenbasierte Zugriffssteuerung:** Anpassbare Zugriffsrechte für Administratoren, Lehrkräfte und Schüler:innen

### Backend-Anbindung

- **API:** Nutzung der REST-API des Hugo 2.0 Backends für Datenabfragen und Interaktionen
- **Datenverarbeitung:** Echtzeit-Verarbeitung von Anfragen und Antworten durch das Backend

## Installation

### Voraussetzungen

- Moodle 3.9 oder höher
- Zugang zum Hugo 2.0 Backend
- API-Schlüssel für das Backend

### .env Datei

Erstelle eine `.env` Datei im Hauptverzeichnis des Plugins und definiere die notwendigen Umgebungsvariablen, wie den API-Schlüssel und die URL des Backends.

### Schritt-für-Schritt Anleitung

1. **Repository klonen**  
   `git clone https://github.com/dein-username/Hugo-Moodle-Plugin.git`  
   `cd Hugo-Moodle-Plugin`

2. **Plugin in Moodle installieren**  
   - Kopiere den Plugin-Ordner in das Verzeichnis `moodle/local/`.
   - Melde dich als Administrator in Moodle an und navigiere zu „Website-Administration“ -> „Plugins“ -> „Installationen“.
   - Folge den Anweisungen, um das Plugin zu installieren.

3. **Konfiguration**  
   - Nach der Installation erscheint das Plugin in den Moodle-Einstellungen. Konfiguriere hier die API-Schlüssel und weiteren Einstellungen.

## Nutzung

### Lehrkräfte

- **Kurs- und Fachmanagement:** Konfiguration der "Brains" für spezifische Kurse
- **Chatbot-Interaktion:** Nutzung des Chatbots zur Beantwortung von Fragen und Bereitstellung von Lernmaterialien

### Schüler:innen

- **Chatbot-Nutzung:** Fragen stellen und interaktive Lerninhalte nutzen
- **Personalisierte Inhalte:** Zugriff auf Inhalte, die durch den Chatbot speziell für den jeweiligen Kurs bereitgestellt werden

## Herausforderungen und Weiterentwicklungen

### Herausforderungen

- **Integration:** Sicherstellung der reibungslosen Kommunikation zwischen dem Moodle-Plugin und dem Hugo 2.0 Backend
- **Benutzererfahrung:** Optimierung der Benutzeroberfläche für eine intuitive Nutzung

### Mögliche Weiterentwicklungen

- **Erweiterte Analysefunktionen:** Implementierung von Funktionen zur Analyse der Nutzung und Leistung des Chatbots
- **Multilinguale Unterstützung:** Erweiterung der Sprachunterstützung für den internationalen Einsatz
- **Erweiterte Anpassungsmöglichkeiten:** Weitere Optionen zur individuellen Gestaltung der "Brains" durch Lehrkräfte

## Lizenz

Dieses Projekt steht unter der Open-Source-Lizenz und ist Teil der Open Educational Resources (OER).

## Kontakt

RBZ Eckener-Schule Flensburg  
Friesische Lücke 15,  
24937 Flensburg  
https://www.eckener-schule.de/
