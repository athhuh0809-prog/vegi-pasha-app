interface CharacterIllustrationProps {
  level: number;
  evolutionStage?: 1 | 2 | 3;
  mood?: 'idle' | 'happy' | 'levelup';
  className?: string;
}

export function CharacterIllustration({
  level,
  evolutionStage = 1,
  mood = 'idle',
  className = 'w-44 h-44',
}: CharacterIllustrationProps) {
  const isCheering = mood === 'levelup' || mood === 'happy';
  const hasBud = level >= 3 || evolutionStage >= 2;
  const hasBlossom = level >= 5 || evolutionStage >= 3;

  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="ベジぱしゃの育成キャラクターイラスト"
    >
      {/* Ground Shadow */}
      <ellipse cx="90" cy="154" rx="44" ry="9" fill="#DCE6DA" />

      {/* Celebratory accents when leveling up */}
      {mood === 'levelup' && (
        <g>
          <path
            d="M32 54 L35 46 L38 54 L46 57 L38 60 L35 68 L32 60 L24 57 Z"
            fill="#F4B942"
          />
          <path
            d="M146 44 L148 38 L150 44 L156 46 L150 48 L148 54 L146 48 L140 46 Z"
            fill="#EE7B30"
          />
          <circle cx="42" cy="108" r="4" fill="#81C784" />
          <circle cx="144" cy="100" r="4.5" fill="#F4B942" />
        </g>
      )}

      {/* Sprout Stem & Leaves on Head */}
      <g>
        <path
          d="M90 56 C90 42, 90 34, 90 28"
          stroke="#2D6A4F"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Left Leaf */}
        <path
          d="M89 35 C72 22, 54 27, 56 41 C58 51, 75 49, 89 39 Z"
          fill="#4A9E65"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M84 37 C74 35, 67 36, 63 39" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />

        {/* Right Leaf */}
        <path
          d="M91 34 C108 19, 127 25, 124 39 C122 50, 104 48, 91 38 Z"
          fill="#62B778"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M96 36 C106 34, 113 35, 117 38" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />

        {/* Lv.3+ Sprout Bud / Lv.5+ Small Blossom */}
        {hasBlossom ? (
          <g>
            <circle cx="90" cy="21" r="6" fill="#FCE068" stroke="#D97706" strokeWidth="1.8" />
            <circle cx="84" cy="25" r="4.2" fill="#FFF8E1" stroke="#D97706" strokeWidth="1.4" />
            <circle cx="96" cy="25" r="4.2" fill="#FFF8E1" stroke="#D97706" strokeWidth="1.4" />
            <circle cx="90" cy="24" r="3.2" fill="#F49D37" />
          </g>
        ) : hasBud ? (
          <path
            d="M90 19 C85 23, 85 29, 90 30 C95 29, 95 23, 90 19 Z"
            fill="#F4B942"
            stroke="#2D6A4F"
            strokeWidth="2"
          />
        ) : null}
      </g>

      {/* Feet */}
      <ellipse cx="70" cy="147" rx="12" ry="7" fill="#3B8152" stroke="#2D6A4F" strokeWidth="2.5" />
      <ellipse cx="110" cy="147" rx="12" ry="7" fill="#3B8152" stroke="#2D6A4F" strokeWidth="2.5" />

      {/* Arms */}
      {isCheering ? (
        <>
          <path
            d="M44 96 C32 82, 34 68, 44 68 C51 68, 52 80, 52 92"
            fill="#83C987"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M136 96 C148 82, 146 68, 136 68 C129 68, 128 80, 128 92"
            fill="#83C987"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M44 102 C32 104, 30 116, 39 120 C45 122, 49 115, 50 108"
            fill="#83C987"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M136 102 C148 104, 150 116, 141 120 C135 122, 131 115, 130 108"
            fill="#83C987"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Main Round Body */}
      <path
        d="M90 54 C58 54, 41 75, 41 106 C41 134, 60 147, 90 147 C120 147, 139 134, 139 106 C139 75, 122 54, 90 54 Z"
        fill="#8ED092"
        stroke="#2D6A4F"
        strokeWidth="3.2"
      />

      {/* Soft Highlight on Top Left */}
      <ellipse
        cx="65"
        cy="71"
        rx="11"
        ry="5.5"
        transform="rotate(-22 65 71)"
        fill="#B6E5B8"
        opacity="0.75"
      />

      {/* Cream Belly Patch */}
      <ellipse cx="90" cy="121" rx="31" ry="20" fill="#FBF8F1" />

      {/* Leaf Motif on Belly */}
      <path
        d="M90 115 C84 115, 82 122, 90 128 C98 122, 96 115, 90 115 Z"
        fill="#CFE4CA"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="62" cy="100" rx="7.5" ry="4.5" fill="#F4978E" opacity="0.7" />
      <ellipse cx="118" cy="100" rx="7.5" ry="4.5" fill="#F4978E" opacity="0.7" />

      {/* Eyes & Smile */}
      {isCheering ? (
        <>
          <path
            d="M65 92 C68 86, 75 86, 78 92"
            stroke="#1F2D24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M102 92 C105 86, 112 86, 115 92"
            stroke="#1F2D24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M82 99 C85 107, 95 107, 98 99 Z"
            fill="#E45746"
            stroke="#1F2D24"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle cx="71" cy="91" r="5.5" fill="#1F2D24" />
          <circle cx="69.2" cy="89" r="1.8" fill="#FFFFFF" />
          <circle cx="109" cy="91" r="5.5" fill="#1F2D24" />
          <circle cx="107.2" cy="89" r="1.8" fill="#FFFFFF" />
          <path
            d="M83 99 C86 103, 94 103, 97 99"
            stroke="#1F2D24"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
