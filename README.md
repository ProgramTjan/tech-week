# HYPERION-14 | High-NA EUV Wafer & Chip Simulator

Interactive browser-based simulator for High-NA EUV lithography wafer and chip processes.

🔗 **Live site:** <https://programtjan.github.io/tech-week/>

Elke publish vervangt de vorige site op deze URL.

---

See [AGENTS.md](AGENTS.md) for Cursor cloud-agent conventions.

## Gemiste Kansen – puzzels toevoegen

De pagina [gemiste-kansen/](https://programtjan.github.io/tech-week/gemiste-kansen/)
leest puzzels uit `chess/gemiste-kansen.json`. Elke zaterdag kun je een nieuwe puzzel
toevoegen door een object aan de JSON-array toe te voegen:

```json
{
  "id": "<gameId>-<zetnummer>w",
  "gameUrl": "https://lichess.org/<gameId>#<ply>",
  "date": "YYYY-MM-DD",
  "opponent": "LichessUsername",
  "color": "white|black",
  "moveNumber": 16,
  "fen": "<FEN-string>",
  "sideToMove": "w|b",
  "bestMove": "Nb5",
  "playedMove": "Rad1",
  "evalBefore": 2.32,
  "evalAfterPlayed": 0.0,
  "theme": "overbelasting",
  "uitleg": "Nederlandse uitleg in 1-2 zinnen."
}
```

### Stappen

1. Download de PGN: `curl -H "Accept: application/x-chess-pgn" https://lichess.org/game/export/<id>`
2. Speel de zetten na met `python-chess` tot de gewenste positie en lees het FEN uit
3. Verifieer de zet-legaliteit (bestMove en playedMove) met `python-chess`
4. Controleer de evaluatie met Stockfish (depth ≥ 20)
5. Voeg het object toe aan de array in `chess/gemiste-kansen.json`
6. De `ply` in de gameUrl is het halve-zetnummer na de gespeelde (foute) zet, zodat Lichess de fout toont
7. Commit en push naar `main`
