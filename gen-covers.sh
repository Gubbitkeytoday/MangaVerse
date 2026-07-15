#!/bin/bash
# Generate manga covers sequentially with retry — robust
cd /home/z/my-project
LOG=/home/z/my-project/gen-covers.log
echo "START $(date)" > "$LOG"

GEN() {
  local prompt="$1"; local out="$2"; local tries=0
  while [ $tries -lt 3 ]; do
    tries=$((tries+1))
    if z-ai image -p "$prompt" -o "$out" -s 864x1152 >>"$LOG" 2>&1; then
      if [ -s "$out" ]; then echo "OK $out (try $tries)" >>"$LOG"; return 0; fi
    fi
    echo "retry $tries for $out" >>"$LOG"
    sleep 3
  done
  echo "FAIL $out" >>"$LOG"
  return 1
}

GEN "Manga cover art, dark fantasy action, a young swordsman with glowing crimson katana standing on a cliff under a blood-red moon, dramatic cinematic lighting, highly detailed anime illustration, vivid colors, professional manga volume cover" "public/covers/shadow-realm.png"
GEN "Manga cover art, supernatural school academy, elegant vampire girl with silver hair in gothic school uniform, full moon and crimson petals, moody atmospheric anime illustration, ornate border, professional manga cover" "public/covers/crimson-moon.png"
GEN "Manga cover art, cyberpunk neon city at night, lone samurai warrior with glowing katana in rain, holographic signs pink and cyan, reflections, cinematic anime illustration, gritty detailed, professional manga volume cover" "public/covers/neon-samurai.png"
GEN "Manga cover art, cosmic horror mystery, a figure silhouette before a massive eldritch eye in deep space, dark purple and teal palette, eerie mist, intricate detailed anime illustration, professional manga cover" "public/covers/whispers-void.png"
GEN "Manga cover art, epic space opera, armored starship captain with glowing visor, galaxies and fleet of spaceships behind, bold blue and gold palette, cinematic anime illustration, professional manga volume cover" "public/covers/stellar-vanguard.png"
GEN "Manga cover art, fantasy adventure, a young alchemist mixing glowing potions in a tower workshop full of scrolls and crystals, warm magical light, detailed anime illustration, professional manga cover" "public/covers/last-alchemist.png"
GEN "Manga cover art, emotional romance drama, two silhouettes under a giant glowing hourglass in a field of stars, soft pink and violet palette, dreamy atmospheric anime illustration, professional manga cover" "public/covers/echoes-eternity.png"
GEN "Manga cover art, historical action, a masked ninja assassin with twin blades on a temple rooftop at dawn, cherry blossoms, ink wash style accents, dynamic anime illustration, professional manga volume cover" "public/covers/phantom-blade.png"
GEN "Manga cover art, mecha sci-fi, giant humanoid robot with glowing core reactor, pilot in cockpit foreground, explosions and energy, metallic blue and orange palette, detailed anime illustration, professional manga cover" "public/covers/mecha-heart.png"
GEN "Manga cover art, slice of life romance, cheerful high school girl among cherry blossom trees, soft pastel colors, warm sunlight, gentle anime illustration, professional manga cover" "public/covers/sakura-days.png"
GEN "Manga cover art, fantasy action, a warrior with dragon-scale armor and a small dragon companion, ancient ruins and embers, fiery orange palette, dynamic detailed anime illustration, professional manga volume cover" "public/covers/dragons-heir.png"
GEN "Manga cover art, cozy slice of life, a small midnight cafe interior with warm lights, a barista and steaming coffee, purple night sky outside window, gentle atmospheric anime illustration, professional manga cover" "public/covers/midnight-cafe.png"

echo "ALL DONE $(date)" >> "$LOG"
echo "counts:" >> "$LOG"
ls -la public/covers/ >> "$LOG" 2>&1
