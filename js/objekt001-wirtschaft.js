/* --------------------------------------------------------------
   Kostenvergleich des Referenzgebäudes (Objekt 001)

   Gemeinsam genutzt von der Startseite (Kurzfassung) und von
   objekte/objekt-001.html. Rechnung und Darstellung stehen nur hier.
   -------------------------------------------------------------- */
(function(){
      /* Basispfad aus dem eigenen <script src> ableiten, damit Daten und Links
         auch aus Unterordnern (objekte/) heraus gefunden werden. */
      const BASIS = (function(){
        const s = document.currentScript;
        const m = s && s.src && s.src.match(/^(.*\/)js\/objekt001-wirtschaft\.js(?:\?.*)?$/);
        return m ? m[1] : '';
      })();

      const OBJEKT_001 = {
        die_eine_zahl: {
          wert: "1,30",
          einheit: "€/m²/Monat",
          label: "Wärmekosten 2025 · Heizung + Warmwasser",
          davon_co2: "0,12",
          bezugsflaeche_m2: 769.83,
          abrechnungsjahr: 2025,
          systemgrenze: "Wärme = Heizung + Warmwasser, Vollkosten inkl. Heizbetrieb, CO₂ ausgewiesen, Kaltwasser/Abwasser ausgeschlossen.",
          quelle: "Gas-Jahresabrechnung und Heiznebenkosten-Abrechnung 2025"
        },
      };

      const anchorEl = document.getElementById("oz-anchor");
      if (!anchorEl) return;

      // === Wirtschaftsvergleich Referenzgebäude ===
      // Massgebliche Quelle ist daten/theaterstrasse-4.json, Block "wirtschaft".
      // Bei Preisaenderung DORT pflegen. Diese Konstante ist nur noch
      // Rueckfallebene, falls der Abruf scheitert.
      // Fernwärme QUARTALSWEISE (SWE-Preisblatt, vgl. parameter.json PreisFW).
      // Methodik NICHT identisch mit dem Entscheider-Rechner: hier nominale Summe
      // aus Energie mit Preissteigerung plus Netto-Investition, ohne Abzinsung,
      // ohne Wartung. Der Rechner rechnet nach VDI 2067 mit Kalkzins und zaehlt
      // Wartung und CO2 als eigene Annuitaeten. Zwei Groessen, nicht eine.
      const WIRTSCHAFT_FALLBACK = {
        waerme_kwh: 77000, waerme_kwh_band: [69000, 85000],   // FW und WP: Waermeabgabe Erzeuger 2025 (Cockpit Tab 02a Nr. 12)
        verbrauch_kwh: 95000,                           // nur Gas: Gaseinsatz, gerundet
        flaeche_m2: 769.83, n: 25, jaz: 3.6, stand: "Q4 2026",
        preis_ct: { gas: 10.2, fw: 18.9, wp: 25 },     // brutto (FW Effektivpreis Q4 2026 bei 77.000 kWh/46 kW, ohne CO2-Zertifikat)
        fw_mit_co2_ct: 20.7,                            // FW Effektivpreis mit CO2-Zertifikat
        steig:    { gas: 0.03, fw: 0.04, wp: 0.025 },   // pro Jahr
        invest:   { fw: 31500, wp: 130000 }, wp_foerd: 0.30, fw_foerd: 0.30,   // Grundfoerderung BEG EM 17.08.2026 Nr. 8.4.1 Buchst. c. Massgebliche Quelle: parameter.json.foerdersaetze — von dort noch nicht gelesen, siehe wirtschaftAusJson().
        ist_eur_m2_monat: 1.30                          // gemessen 2025 (Gas, Vollkosten)
      };

      // Bildet den JSON-Block "wirtschaft" auf die Form ab, mit der WV rechnet.
      // ?? statt ||, damit eine hinterlegte 0 (etwa Preissteigerung) erhalten bleibt.
      // fw_foerd hat in der JSON keine Entsprechung; massgeblich ist
      // parameter.json.foerdersaetze.grundfoerderung_waermenetz.
      function wirtschaftAusJson(w){
        const F = WIRTSCHAFT_FALLBACK;
        if (!w) return F;
        const p = w.preise_ct_brutto || {}, s = w.steigerung_pa || {}, i = w.invest_eur || {};
        return {
          waerme_kwh:    w.waerme_kwh ?? F.waerme_kwh,
          waerme_kwh_band: w.waerme_kwh_band ?? F.waerme_kwh_band,
          verbrauch_kwh: w.verbrauch_kwh ?? F.verbrauch_kwh,
          flaeche_m2:    w.bezugsflaeche_m2 ?? F.flaeche_m2,
          n:             w.zeitraum_j ?? F.n,
          jaz:           w.jaz ?? F.jaz,
          stand:         w.stand ?? F.stand,
          preis_ct: { gas: p.gas ?? F.preis_ct.gas, fw: p.fernwaerme ?? F.preis_ct.fw, wp: p.wp_strom ?? F.preis_ct.wp },
          fw_mit_co2_ct: w.fernwaerme_mit_co2_ct ?? F.fw_mit_co2_ct,
          steig:    { gas: s.gas ?? F.steig.gas,    fw: s.fernwaerme ?? F.steig.fw,    wp: s.wp_strom ?? F.steig.wp },
          invest:   { fw: i.fernwaerme ?? F.invest.fw, wp: i.wp ?? F.invest.wp },
          wp_foerd: w.wp_foerderung_anteil ?? F.wp_foerd,
          fw_foerd: F.fw_foerd,
          ist_eur_m2_monat: w.ist_eur_m2_monat_2025 ?? F.ist_eur_m2_monat
        };
      }

      // DATEN ist die geparste theaterstrasse-4.json oder null (Rueckfallebene).
      // Fehlt sie, entfallen Zerlegung und Ausweisvergleich; der Balken bleibt
      // vollstaendig, weil er allein aus WIRTSCHAFT rechnet.
      function zeichneWirtschaft(WIRTSCHAFT, DATEN){
      const WV = (function(){
        // Zwei Mengen: FW und WP auf die Waermeabgabe, Gas auf den Gaseinsatz.
        const W = WIRTSCHAFT, q = W.waerme_kwh, v = W.verbrauch_kwh, n = W.n, fl = W.flaeche_m2;
        const e1 = { fw: q * W.preis_ct.fw/100, wp: (q / W.jaz) * W.preis_ct.wp/100, gas: v * W.preis_ct.gas/100 };
        const inv = { fw: Math.round(W.invest.fw * (1 - W.fw_foerd)), wp: Math.round(W.invest.wp * (1 - W.wp_foerd)) };
        const sumEsc = (j, e) => e === 0 ? j * n : j * (Math.pow(1 + e, n) - 1) / e;
        const mit  = { fw: sumEsc(e1.fw, W.steig.fw) + inv.fw, wp: sumEsc(e1.wp, W.steig.wp) + inv.wp };
        const ohne = { fw: e1.fw * n + inv.fw, wp: e1.wp * n + inv.wp };
        // Fall "Ausschluss greift": Waermepumpe ohne Foerderabzug, gleiche Methodik.
        const ungefoerdert = { wp: sumEsc(e1.wp, W.steig.wp) + W.invest.wp };
        let be = null, cFW = inv.fw, cWP = inv.wp;
        for (let t = 1; t <= n; t++){ cFW += e1.fw * Math.pow(1 + W.steig.fw, t - 1); cWP += e1.wp * Math.pow(1 + W.steig.wp, t - 1); if (be === null && cFW >= cWP) be = t; }
        return { e1, mit, ohne, ungefoerdert, be, ersparnis: mit.fw - mit.wp, diffFW: mit.fw - ohne.fw,
                 fwMonat: e1.fw / fl / 12, wpMonat: e1.wp / fl / 12, gasMonat: e1.gas / fl / 12 };
      })();
      const fmtTsd = x => Math.round(x / 1000).toLocaleString('de-DE') + '.000 €';
      const fmtEur = x => Math.round(x).toLocaleString('de-DE') + ' €';

      const z = OBJEKT_001.die_eine_zahl;
      const sMin = 0.5, sMax = 2.2;
      function ozPos(v){ return Math.max(4, Math.min(96, (v - sMin) / (sMax - sMin) * 100)).toFixed(1); }
      const fmtM2 = x => x.toFixed(2).replace('.', ',');
      const ct    = x => String(x).replace('.', ',');
      const prz   = x => (x * 100).toLocaleString('de-DE') + ' %';

      // Zerlegung der gemessenen Ist-Zahl. Alle Betraege kommen aus
      // daten/theaterstrasse-4.json, Block "ist_2025"; hier wird nur summiert.
      const IST = (DATEN && DATEN.ist_2025) || null;
      let istHtml = '';
      if (IST) {
        const hb    = IST.heizbetrieb_eur || {};
        const hbSum = (hb.wartung || 0) + (hb.geraetemiete || 0) + (hb.abrechnungsvorbereitung || 0);
        const gesamt = IST.erdgasbezug_eur + hbSum;
        const proM2 = x => fmtM2(x / IST.bezugsflaeche_m2 / 12);
        istHtml =
          '<p class="oz-anchor__ist"><strong>Heute gezahlt: ' + proM2(gesamt) + ' €/m²·Monat.</strong> ' +
          'Gemessen für ' + IST.abrechnungsjahr + ', Heizung und Warmwasser, Kaltwasser und Abwasser ausgenommen. ' +
          'Darin stecken zwei Dinge. Der <strong>Erdgasbezug</strong>: ' + IST.verbrauch_kwh.toLocaleString('de-DE') +
          ' kWh für ' + fmtEur(IST.erdgasbezug_eur) + ', das sind <strong>' + proM2(IST.erdgasbezug_eur) + ' €/m²·Monat</strong>. ' +
          'Und der <strong>Heizbetrieb</strong>: Wartung ' + fmtEur(hb.wartung) + ', Gerätemiete ' + fmtEur(hb.geraetemiete) +
          ', Abrechnungsvorbereitung ' + fmtEur(hb.abrechnungsvorbereitung) + ', zusammen ' + fmtEur(hbSum) +
          ', also <strong>' + proM2(hbSum) + ' €/m²·Monat</strong>. ' +
          'Summe ' + fmtEur(gesamt) + ' im Jahr auf ' + fmtM2(IST.bezugsflaeche_m2) + ' m².</p>';
      }
      const reihe = (IST && Array.isArray(IST.verbrauchsreihe_kwh))
        ? IST.verbrauchsreihe_kwh.map(r => r.jahr + ': ' + r.wert.toLocaleString('de-DE')).join(', ')
        : '';
      // Zwei Spannen mit zwei Bezuegen: gerechnet aus dem Gaseinsatz 2025 und
      // die breitere Bandbreite fuer Vergleiche, die auch das Wetter abdeckt.
      const nutzung = DATEN && DATEN.kennzahlen_2025 && DATEN.kennzahlen_2025.nutzungsgrad_band;
      const reiheJahre = reihe ? IST.verbrauchsreihe_kwh : [];
      const schwankung = (reihe && nutzung)
        ? 'Der Gasverbrauch schwankt mit dem Wetter (' + reiheJahre[0].jahr + ' bis ' + reiheJahre[reiheJahre.length - 1].jahr + '). ' +
          'Gaseinsatz ' + IST.abrechnungsjahr + ' × Nutzungsgrad ' + nutzung[0].toFixed(2).replace('.', ',') + ' bis ' + nutzung[1].toFixed(2).replace('.', ',') + ' ergibt ' +
          (Math.round(IST.verbrauch_kwh * nutzung[0] / 100) * 100).toLocaleString('de-DE') + ' bis ' + (Math.round(IST.verbrauch_kwh * nutzung[1] / 100) * 100).toLocaleString('de-DE') +
          ' kWh. Für Vergleiche wird mit einer Bandbreite von ' + WIRTSCHAFT.waerme_kwh_band[0].toLocaleString('de-DE') + ' bis ' + WIRTSCHAFT.waerme_kwh_band[1].toLocaleString('de-DE') + ' kWh gerechnet. '
        : '';
      // Gaseinsatz: gemessen aus ist_2025, sonst der gerundete Ansatz aus "wirtschaft".
      const gaseinsatz = IST
        ? IST.verbrauch_kwh.toLocaleString('de-DE') + ' kWh Gaseinsatz ' + IST.abrechnungsjahr
        : 'rund ' + WIRTSCHAFT.verbrauch_kwh.toLocaleString('de-DE') + ' kWh Gaseinsatz';
      // Drei Flaechen mit drei Bedeutungen. Jede Zahl nennt ihren Nenner,
      // sonst liest sich die eine als Fehler der anderen (CLAUDE.md Regel 9).
      const AUS = IST && IST.verbrauchsausweis_2018;
      // 769,83 m² ist zugleich Wohnflaeche (gebaeude.flaeche), Festlegung 10.10.2026.
      const ngf = DATEN && DATEN.gebaeude && DATEN.gebaeude.nettogrundflaeche_heizlast_m2;
      const flaechenAbsatz = (IST && AUS && ngf)
        ? '<p>Das Haus trägt drei Flächen mit drei Bedeutungen: ' + fmtM2(IST.bezugsflaeche_m2) +
          ' m² Bezugsfläche der Heizkostenabrechnung (Wohnfläche); ' + AUS.bezugsflaeche_m2.toLocaleString('de-DE') +
          ' m² ' + AUS.bezugsflaeche_bezeichnung + ' laut Energieausweis 2018, nach § 19 EnEV aus der Wohnfläche hochgerechnet; ' +
          ngf.toLocaleString('de-DE') + ' m² Nettogrundfläche der Heizlastberechnung. Die Wärmekosten oben rechnen auf ' +
          'der Heizkostenfläche, seit 21.06.2026 einheitlich.</p>'
        : '';
      const ausweisAbsatz = (IST && AUS)
        ? '<p>Der Verbrauchsausweis von 2018 weist ' + AUS.endenergie_kwh_m2a + ' kWh/m²·a aus, bezogen auf ' +
          AUS.bezugsflaeche_m2.toLocaleString('de-DE') + ' m² ' + AUS.bezugsflaeche_bezeichnung + '. Auf dieselbe Fläche ' +
          'gerechnet liegt der gemessene Verbrauch ' + IST.abrechnungsjahr + ' bei rund ' +
          Math.round(IST.verbrauch_kwh / AUS.bezugsflaeche_m2) + ' kWh/m²·a. Das Gebäude verbraucht heute weniger als zur ' +
          'Zeit des Ausweises, der auf den Jahren ' + AUS.verbrauchsjahre_kwh[0].jahr + ' bis ' +
          AUS.verbrauchsjahre_kwh[AUS.verbrauchsjahre_kwh.length - 1].jahr + ' beruht.</p>'
        : '';
      anchorEl.innerHTML =
        istHtml +
        '<p class="oz-anchor__lbl">Energiekosten · €/m²·Monat — heute und die zwei zulässigen Pfade</p>' +
        '<div class="oz-map">' +
          '<div class="oz-map__bar">' +
            '<span class="oz-map__mark oz-map__mark--wp" style="left:' + ozPos(WV.wpMonat) + '%"><span class="oz-map__lblbox"><span class="oz-map__val">~' + WV.wpMonat.toFixed(2).replace('.', ',') + '</span><span class="oz-map__cap">Wärmepumpe</span></span></span>' +
            '<span class="oz-map__mark oz-map__mark--gas" style="left:' + ozPos(WV.gasMonat) + '%"><span class="oz-map__lblbox"><span class="oz-map__val">' + fmtM2(WV.gasMonat) + '</span><span class="oz-map__cap">Gas heute</span></span></span>' +
            '<span class="oz-map__mark oz-map__mark--fw" style="left:' + ozPos(WV.fwMonat) + '%"><span class="oz-map__lblbox"><span class="oz-map__val">~' + WV.fwMonat.toFixed(2).replace('.', ',') + '</span><span class="oz-map__cap">Fernwärme <em>steigt ▸</em></span></span></span>' +
          '</div>' +
          '<div class="oz-map__labels"><span>niedrig</span><span>im Schnitt</span><span>erhöht</span></div>' +
        '</div>' +
        '<p class="oz-map__basis">Basis: rund ' + WIRTSCHAFT.waerme_kwh.toLocaleString('de-DE') + ' kWh Wärme im Jahr, die Wärmeabgabe ' +
          'des heutigen Kessels (' + gaseinsatz + ' bei einem Nutzungsgrad von 0,80 bis 0,83) · ' +
          fmtM2(WIRTSCHAFT.flaeche_m2) + ' m² · Heizung und Warmwasser. ' + schwankung +
          'Gas ist gemessen, Fernwärme und Wärmepumpe sind zu heutigen Preisen projiziert.</p>' +
        '<p class="oz-map__grenze">Der Balken zeigt nur den Energieanteil — er ist der Teil, der sich mit der Heizung ändert. ' +
          'Betriebskosten fallen bei jeder Lösung an, in unterschiedlicher Höhe; belastbar beziffert sind sie hier allein ' +
          'für die Gasheizung. Das bleibt eine Schieflage zugunsten der Wärmepumpe: Ein Fernwärme-Anschluss braucht weniger ' +
          'Betrieb als ein Gaskessel, eine Wärmepumpe braucht eigene Wartung. Beides steckt nicht im Balken.</p>' +
        '<p class="oz-map__risk">Fernwärme steigt: Die Stadtwerke prognostizieren bis 2040 eine Verdopplung. Ein Netzanschluss bindet langfristig und ist nur eingeschränkt kündbar; das Preisrisiko tragen am Ende Eigentümer und Mieter.</p>' +
        '<details class="oz-anchor__det">' +
          '<summary>Zusammensetzung &amp; Systemgrenze</summary>' +
          '<p>davon CO₂ ' + z.davon_co2 + ' €/m²·Monat' +
            (IST ? ' (' + IST.co2_netto_eur_kwh.toFixed(5).replace('.', ',') + ' €/kWh netto auf ' + IST.verbrauch_kwh.toLocaleString('de-DE') + ' kWh)' : '') +
            ' · Bezugsfläche ' + z.bezugsflaeche_m2.toLocaleString("de-DE") + ' m² · Abrechnungsjahr ' + z.abrechnungsjahr + ' · Quelle: ' + z.quelle + '</p>' +
          '<p>' + z.systemgrenze + '</p>' +
          flaechenAbsatz +
          ausweisAbsatz +
          '<p>Wo einzelne Wohnungen abweichen, sitzt der Unterschied zwischen Kessel und Wohnungszähler, nicht am Gebäude.</p>' +
        '</details>';

      // === Wirtschaftsvergleich: Gesamtkosten (beide Wege) + Jahreskosten ===
      const gesamtEl = document.getElementById("oz-vgl-gesamt");
      if (gesamtEl) {
        const wpBreite = Math.round(WV.mit.wp / WV.mit.fw * 100);
        const bePos = Math.round((WV.be || 6) / WIRTSCHAFT.n * 100);
        gesamtEl.innerHTML =
          '<span class="oz-vgl-row__lbl">Kosten über ' + WIRTSCHAFT.n + ' Jahre · Energie + Investition nach Förderung</span>' +
          '<div class="oz-vgl-line oz-vgl-line--mark"><span class="oz-vgl-line__opt">Fernwärme</span>' +
            '<div class="oz-vgl-track"><div class="oz-vgl-fill" style="width:100%"></div>' +
              '<span class="oz-vgl-mark" style="left:' + bePos + '%"><span class="oz-vgl-mark__lbl">Amortisation WP vs. Fernwärme · ~Jahr ' + (WV.be || '—') + '</span></span>' +
            '</div><span class="oz-vgl-line__val">' + fmtTsd(WV.mit.fw) + '<small style="display:block;opacity:.55;font-weight:400;font-size:10px;">ohne Steigerung ' + fmtTsd(WV.ohne.fw) + '</small></span></div>' +
          '<div class="oz-vgl-line"><span class="oz-vgl-line__opt">Wärmepumpe</span>' +
            '<div class="oz-vgl-track"><div class="oz-vgl-fill" style="width:' + wpBreite + '%"></div></div>' +
            '<span class="oz-vgl-line__val">' + fmtTsd(WV.mit.wp) +
              '<small style="display:block;opacity:.55;font-weight:400;font-size:10px;">ohne Steigerung ' + fmtTsd(WV.ohne.wp) + '</small>' +
              '<small style="display:block;opacity:.55;font-weight:400;font-size:10px;">ohne Förderung ' + fmtTsd(WV.ungefoerdert.wp) + '</small>' +
            '</span></div>' +
          '<p class="oz-vgl-note">Der Hauptwert der Wärmepumpe rechnet mit ' + Math.round(WIRTSCHAFT.wp_foerd * 100) + ' % Grundförderung, also mit dem Fall, dass der Förderausschluss bei kommunaler Anschlussentscheidung hier nicht greift. Ob er greift, ist offen. Greift er, liegt die Wärmepumpe bei rund <strong>' + fmtTsd(WV.ungefoerdert.wp) + '</strong> statt ' + fmtTsd(WV.mit.wp) + '. Gegenüber ' + fmtTsd(WV.mit.fw) + ' Fernwärme ändert das an der Rangfolge nichts. Beide Fälle zeigt die Fördermatrix unten. Bei einem Antrag ab dem ersten Quartal 2027 setzen die 30 % den Bonus für Geräte mit Ursprung in der EU voraus, dessen Einzelheiten noch nicht veröffentlicht sind.</p>' +
          '<p class="oz-vgl-note">Ohne Preissteigerung wirkt Fernwärme rund <strong>' + fmtTsd(WV.diffFW) + '</strong> günstiger, als sie über die Laufzeit real wird — genau das ist das Preisrisiko des Anschlusszwangs.</p>' +
          // Zwei richtige Zahlen mit verschiedenen Bezuegen: ohne diesen Satz
          // haelt jemand, der beides sieht, eine der beiden fuer falsch.
          '<p class="oz-vgl-note"><strong>Zur Methodik:</strong> Diese Rechnung summiert nominal über ' + WIRTSCHAFT.n +
            ' Jahre, also Energiekosten mit jährlicher Preissteigerung plus Investition nach Abzug der Förderung, ' +
            'ohne Abzinsung und ohne Wartung. Der <a href="' + BASIS + 'rechner.html">Entscheider-Rechner</a> geht anders vor: ' +
            'Er zinst nach VDI 2067 ab und rechnet Wartung und CO₂ als eigene Posten. Beide Wege sind richtig und ' +
            'ergeben verschiedene Beträge.</p>' +
          '<p class="oz-vgl-note">Investitionsannahme: Wärmepumpe 130.000 € brutto (vorsichtig angesetzt), Fernwärme ab 31.500 € brutto; mit dem nicht bezifferten baulichen Teil bis rund 42.600 €. Das günstigere reale WP-Angebot lag bei ~100.000 € — Potenzial nach unten. <strong>Stand 10.10.2026:</strong> Die Investitionsannahme Wärmepumpe beruht auf einem Angebot mit drei Außeneinheiten. Die niedrigere Heizlast senkt die Fernwärmekosten sofort. Was die Förderung daraus macht, steht in der Fördermatrix unten. <strong>Schallschutz:</strong> Nachts gilt der Richtwert 40 dB(A), amtlich bestätigt für ein allgemeines Wohngebiet.</p>' +
          '<details class="oz-fw-det">' +
            '<summary>Fernwärme-Anschluss — was wirklich anfällt</summary>' +
            '<div class="oz-fw-det__body">' +
              '<p>Der niedrige „Anschlusspreis" ist nur ein Teil. Ein Fernwärme-Anschluss besteht aus zwei Blöcken:</p>' +
              '<p><strong>Block A — SWE-Anschluss</strong> (belegt, SWE-Schreiben 18.03.2026): Baukostenzuschuss ca. 1.840 € (39,99 €/kW × 46 kW) + Hausanschlusskostenbeitrag 8.982 € = <strong>ca. 10.800 € netto</strong>. Enthalten: Anschlussleitung bis ins Gebäude und Fernwärme-Grundstation („SWE Comfort").</p>' +
              '<p><strong>Block B — bauliche Maßnahmen im Gebäude</strong> (Heizkreise, Pumpen, Mischer, Warmwasserbereitung, Anbindung der Heizzentrale): <strong>ca. 15.000–25.000 € netto</strong> — Erfahrungswert, von der SWE nicht beziffert.</p>' +
              '<p><strong>Gesamtinvestition Fernwärme realistisch ca. 25.800–35.800 € netto</strong>, verbindlich erst mit dem konkreten SWE-Angebot. Der scheinbare Investitionsvorteil gegenüber der Wärmepumpe schrumpft damit deutlich — über 25 Jahre kehrt sich das Bild ohnehin um.</p>' +
              '<p><strong>Förderung:</strong> 30 % auf den Anschluss — auch im Zwanggebiet und trotz gasbasiertem Netz. Die Fälle zeigt die Fördermatrix unten. <a href="' + BASIS + 'foerderparadoxon.html">Hintergrund: Das Förderparadoxon →</a></p>' +
              '<p><strong>Rechtlicher Hintergrund:</strong> <a href="https://www.erfurt.de/mam/ef/rathaus/stadtrecht/3/3008.pdf" target="_blank" rel="noopener">Fernwärmesatzung Erfurt (3.008) →</a> &nbsp;·&nbsp; <a href="https://www.erfurt.de/ef/de/rathaus/bservice/leistungen/leistung-1071.htmc" target="_blank" rel="noopener">Anschlusszwang &amp; Befreiung prüfen →</a></p>' +
            '</div>' +
          '</details>' +
          '';
      }
      // === CO2 · kg pro m²·Jahr — Faktoren aus Block "co2", Mengen wie im Kostenvergleich ===
      const co2El = document.getElementById("oz-vgl-co2");
      const C = DATEN && DATEN.co2;
      if (co2El && C && IST) {
        const f = C.faktoren_kg_kwh, qu = C.quellen;
        const kg = {
          gas: IST.verbrauch_kwh * f.gas / IST.bezugsflaeche_m2,
          fw:  WIRTSCHAFT.waerme_kwh * f.fernwaerme / IST.bezugsflaeche_m2,
          wp:  WIRTSCHAFT.waerme_kwh / WIRTSCHAFT.jaz * f.strom / IST.bezugsflaeche_m2
        };
        const max = Math.max(kg.gas, kg.fw, kg.wp);
        const zeile = (opt, wert, ist) => '<div class="oz-vgl-line"><span class="oz-vgl-line__opt">' + opt + '</span><div class="oz-vgl-track"><div class="oz-vgl-fill' +
          (ist ? ' oz-vgl-fill--ist' : '') + '" style="width:' + Math.round(wert / max * 100) + '%"></div></div><span class="oz-vgl-line__val">' +
          wert.toFixed(1).replace('.', ',') + '</span></div>';
        co2El.innerHTML =
          '<span class="oz-vgl-row__lbl">CO₂ · kg pro m²·Jahr</span>' +
          zeile('Gas (heute)', kg.gas, true) + zeile('Fernwärme', kg.fw) + zeile('Wärmepumpe', kg.wp) +
          '<p class="oz-vgl-note">Überraschend, aber belegt: Die Erfurter Fernwärme ist heute nicht klimafreundlicher als die eigene Gasheizung, sie liegt sogar leicht darüber. Das Netz ist zu rund 95 % gasbasiert.</p>' +
          '<p class="oz-vgl-note">Quellen: ' + qu.fernwaerme + ' (Fernwärme), ' + qu.gas + ' (Gas), ' + qu.strom + ' (Strom).</p>';
      }
      const jahresEl = document.getElementById("oz-vgl-jahres");
      if (jahresEl) {
        const wpB = Math.round(WV.e1.wp / WV.e1.fw * 100);
        jahresEl.innerHTML =
          '<span class="oz-vgl-row__lbl">Jahreskosten heute · Energie</span>' +
          '<div class="oz-vgl-line"><span class="oz-vgl-line__opt">Fernwärme</span><div class="oz-vgl-track"><div class="oz-vgl-fill" style="width:100%"></div></div><span class="oz-vgl-line__val">' + fmtEur(WV.e1.fw) + '</span></div>' +
          '<div class="oz-vgl-line"><span class="oz-vgl-line__opt">Wärmepumpe</span><div class="oz-vgl-track"><div class="oz-vgl-fill" style="width:' + wpB + '%"></div></div><span class="oz-vgl-line__val">' + fmtEur(WV.e1.wp) + '</span></div>' +
          // Link auf das Preisblatt bleibt fest; mit dem Quartal wechseln (Quelle der Werte: Block "wirtschaft").
          '<p class="oz-vgl-note">Basis: ' + WIRTSCHAFT.waerme_kwh.toLocaleString('de-DE') + ' kWh Wärme/Jahr · Preisstand ' + WIRTSCHAFT.stand +
            ', brutto: Fernwärme-Effektivpreis ' + ct(WIRTSCHAFT.preis_ct.fw) + ' ct/kWh (Effektivpreis auf Gebäudeebene bei ' +
            WIRTSCHAFT.waerme_kwh.toLocaleString('de-DE') + ' kWh und 46 kW Anschlussleistung; mit CO₂-Zertifikat ' + ct(WIRTSCHAFT.fw_mit_co2_ct) +
            ' ct — <a href="' + BASIS + 'dokumente/261001_SWE-Preisblatt-Fernwaerme_Q4-2026.pdf" target="_blank" rel="noopener">SWE-Preisblatt 1.10.2026</a>), WP-Strom ' +
            ct(WIRTSCHAFT.preis_ct.wp) + ' ct/kWh; Gas ' + ct(WIRTSCHAFT.preis_ct.gas) + ' ct/kWh (gemessen 2025) — die Wärmepumpe braucht dafür nur gut ein Viertel Strom (Umweltwärme).</p>' +
          '<p class="oz-vgl-note">Über die Laufzeit bleibt es nicht bei diesen Beträgen: In der Rechnung steigt der ' +
            'Fernwärmepreis um ' + prz(WIRTSCHAFT.steig.fw) + ' pro Jahr, der Wärmepumpenstrom um ' + prz(WIRTSCHAFT.steig.wp) + '. ' +
            'Auf ' + WIRTSCHAFT.n + ' Jahre hochgerechnet und um die Investition nach Abzug der Förderung ergänzt, ergibt das ' +
            'die Kosten über ' + WIRTSCHAFT.n + ' Jahre darunter.</p>';
      }
      }

      // Elemente mit data-wert="block.feld" lesen ihren Wert aus der JSON. Der Text
      // im HTML ist nur Rueckfallebene. data-jahr: ohne Tausenderpunkt, data-dez: Nachkommastellen.
      function werteEinsetzen(j){
        document.querySelectorAll('[data-wert]').forEach(function(el){
          const v = el.dataset.wert.split('.').reduce(function(o, k){ return o == null ? o : o[k]; }, j);
          if (typeof v === 'string') { el.textContent = v; return; }
          if (typeof v !== 'number') return;
          const dez = Number(el.dataset.dez || 0);
          el.textContent = v.toLocaleString('de-DE', { minimumFractionDigits: dez, maximumFractionDigits: dez, useGrouping: !('jahr' in el.dataset) });
        });
        const gv = j && j.kennzahlen_2025 && j.kennzahlen_2025.gas_vollkosten_ct;
        if (gv) document.querySelectorAll('[data-gas-plus]').forEach(function(el){
          el.textContent = '+' + Math.round((gv.j2025 / gv.j2019 - 1) * 100) + ' %';
        });
      }

      // Die JSON fuehrt. Scheitert der Abruf, zeichnet die Rueckfallebene.
      fetch(BASIS + 'daten/theaterstrasse-4.json', { cache: 'no-cache' })
        .then(function(r){ return r.json(); })
        .then(function(j){ werteEinsetzen(j); zeichneWirtschaft(wirtschaftAusJson(j && j.wirtschaft), j); })
        .catch(function(err){
          console.warn('[Objekt 001] Block "wirtschaft" nicht ladbar, Rueckfallebene aktiv:', err);
          zeichneWirtschaft(WIRTSCHAFT_FALLBACK, null);
        });
    })();
