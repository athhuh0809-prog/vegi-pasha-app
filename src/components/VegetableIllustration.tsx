interface VegetableIllustrationProps {
  vegetableId: string;
  silhouette?: boolean;
  className?: string;
}

export function VegetableIllustration({
  vegetableId,
  silhouette = false,
  className = 'w-16 h-16',
}: VegetableIllustrationProps) {
  const s = silhouette;
  const sil = '#B5C5B2';
  const silDark = '#9EB29B';

  const renderShape = () => {
    switch (vegetableId) {
      case 'tomato':
        return (
          <>
            <circle cx="32" cy="36" r="18" fill={s ? sil : '#E45746'} />
            {!s && <ellipse cx="25" cy="29" rx="5" ry="3" transform="rotate(-25 25 29)" fill="#F3887A" opacity="0.7" />}
            <path d="M32 19 C28 14, 21 15, 22 20 C26 19, 29 20, 32 22 C35 20, 38 19, 42 20 C43 15, 36 14, 32 19 Z" fill={s ? silDark : '#3B8152'} />
            <path d="M32 14 L32 21" stroke={s ? silDark : '#2D6A4F'} strokeWidth="2.8" strokeLinecap="round" />
          </>
        );
      case 'carrot':
        return (
          <>
            <path d="M22 22 C28 16, 40 20, 38 28 L24 54 C22 57, 17 55, 18 51 Z" fill={s ? sil : '#EE7B30'} />
            {!s && (
              <>
                <path d="M26 28 L31 31" stroke="#C95E19" strokeWidth="2" strokeLinecap="round" />
                <path d="M23 36 L28 38" stroke="#C95E19" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 44 L25 45" stroke="#C95E19" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            <path d="M33 21 C34 13, 39 10, 44 12 M35 22 C40 16, 46 16, 49 20 M31 20 C29 13, 32 9, 36 9" stroke={s ? silDark : '#3B8152'} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </>
        );
      case 'broccoli':
        return (
          <>
            <path d="M27 36 L25 53 C25 55, 39 55, 39 53 L37 36 Z" fill={s ? silDark : '#7FB872'} />
            <circle cx="22" cy="29" r="9" fill={s ? sil : '#2D6A4F'} />
            <circle cx="42" cy="29" r="9" fill={s ? sil : '#2D6A4F'} />
            <circle cx="32" cy="22" r="11" fill={s ? sil : '#3B8152'} />
            <circle cx="25" cy="25" r="7" fill={s ? sil : '#40916C'} />
            <circle cx="39" cy="25" r="7" fill={s ? sil : '#40916C'} />
          </>
        );
      case 'spinach':
        return (
          <>
            <path d="M32 54 L32 34 M27 52 L32 42 M37 52 L32 42" stroke={s ? silDark : '#5CA467'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 38 C12 28, 16 14, 26 14 C31 14, 32 24, 30 37 Z" fill={s ? sil : '#2D6A4F'} />
            <path d="M44 38 C52 28, 48 14, 38 14 C33 14, 32 24, 34 37 Z" fill={s ? sil : '#3B8152'} />
            <path d="M32 40 C24 30, 24 11, 32 10 C40 11, 40 30, 32 40 Z" fill={s ? sil : '#40916C'} />
            {!s && <path d="M32 15 L32 38" stroke="#8AD097" strokeWidth="1.5" strokeLinecap="round" />}
          </>
        );
      case 'komatsuna':
        return (
          <>
            <path d="M29 54 L27 36 M35 54 L37 36 M32 54 L32 34" stroke={s ? silDark : '#A9D697'} strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="23" cy="24" rx="8" ry="12" transform="rotate(-12 23 24)" fill={s ? sil : '#3B8152'} />
            <ellipse cx="41" cy="24" rx="8" ry="12" transform="rotate(12 41 24)" fill={s ? sil : '#3B8152'} />
            <ellipse cx="32" cy="21" rx="8.5" ry="13" fill={s ? sil : '#4A9C62'} />
          </>
        );
      case 'cabbage':
        return (
          <>
            <circle cx="32" cy="34" r="19" fill={s ? sil : '#79BC73'} />
            <path d="M16 32 C19 20, 30 16, 40 20 C32 23, 27 31, 27 42 C20 41, 16 37, 16 32 Z" fill={s ? silDark : '#A3D89A'} />
            <path d="M48 33 C47 45, 36 51, 26 48 C34 45, 39 36, 38 24 C45 25, 48 29, 48 33 Z" fill={s ? silDark : '#5EA45B'} />
            {!s && <path d="M24 23 C30 26, 34 32, 33 41" stroke="#D7F0CF" strokeWidth="2" fill="none" strokeLinecap="round" />}
          </>
        );
      case 'lettuce':
        return (
          <>
            <path d="M16 36 C11 26, 19 16, 28 19 C32 12, 43 13, 44 21 C52 21, 53 33, 46 39 C47 48, 37 53, 30 49 C22 53, 14 46, 16 36 Z" fill={s ? sil : '#74C06C'} />
            <path d="M21 35 C19 27, 25 21, 32 23 C36 18, 43 22, 42 29 C46 33, 43 42, 36 43 C30 46, 22 42, 21 35 Z" fill={s ? silDark : '#9CE08F'} />
            {!s && <path d="M32 45 L32 30 M32 38 L25 32 M32 36 L39 30" stroke="#DDF7D4" strokeWidth="2" strokeLinecap="round" />}
          </>
        );
      case 'cucumber':
        return (
          <>
            <path d="M15 44 C20 31, 31 20, 44 13 C48 11, 52 15, 50 19 C43 32, 32 43, 20 50 C16 52, 13 48, 15 44 Z" fill={s ? sil : '#3B8152'} />
            {!s && (
              <>
                <circle cx="27" cy="39" r="1.4" fill="#A3D89A" />
                <circle cx="35" cy="31" r="1.4" fill="#A3D89A" />
                <circle cx="42" cy="23" r="1.4" fill="#A3D89A" />
                <circle cx="30" cy="32" r="1.3" fill="#255A37" />
                <circle cx="38" cy="24" r="1.3" fill="#255A37" />
              </>
            )}
          </>
        );
      case 'onion':
        return (
          <>
            <path d="M32 13 C34 19, 49 25, 49 38 C49 48, 41 53, 32 53 C23 53, 15 48, 15 38 C15 25, 30 19, 32 13 Z" fill={s ? sil : '#DF9E55'} />
            {!s && (
              <>
                <path d="M32 16 C27 25, 24 37, 27 51" stroke="#BD7A35" strokeWidth="1.6" fill="none" />
                <path d="M32 16 C37 25, 40 37, 37 51" stroke="#BD7A35" strokeWidth="1.6" fill="none" />
              </>
            )}
            <path d="M30 14 L32 8 L34 14" stroke={s ? silDark : '#7C9E59'} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'pumpkin':
        return (
          <>
            <path d="M29 19 L31 12 L36 13 L34 19 Z" fill={s ? silDark : '#6B5439'} />
            <ellipse cx="22" cy="36" rx="11" ry="15" fill={s ? sil : '#D97B29'} />
            <ellipse cx="42" cy="36" rx="11" ry="15" fill={s ? sil : '#D97B29'} />
            <ellipse cx="32" cy="36" rx="10" ry="16" fill={s ? sil : '#EE8F35'} />
            {!s && <ellipse cx="32" cy="36" rx="5" ry="15" fill="#F5A653" opacity="0.55" />}
          </>
        );
      case 'eggplant':
        return (
          <>
            <path d="M35 16 C40 24, 42 36, 37 47 C33 54, 21 54, 18 46 C16 39, 23 27, 29 17 Z" fill={s ? sil : '#6A3B8C'} />
            {!s && <path d="M24 38 C24 32, 27 26, 30 22" stroke="#9B6AC0" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
            <path d="M27 19 L30 13 L35 12 L37 18 L34 21 L31 18 L28 21 Z" fill={s ? silDark : '#407A4E'} />
            <path d="M33 13 L36 9" stroke={s ? silDark : '#407A4E'} strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'bell_pepper':
        return (
          <>
            <path d="M32 19 L33 12" stroke={s ? silDark : '#2D6A4F'} strokeWidth="3" strokeLinecap="round" />
            <path d="M18 27 C17 20, 26 18, 32 21 C38 18, 47 20, 46 27 C47 38, 44 51, 37 51 C34 51, 33 49, 32 49 C31 49, 30 51, 27 51 C20 51, 17 38, 18 27 Z" fill={s ? sil : '#3B8C4F'} />
            {!s && <path d="M25 25 C24 32, 24 41, 27 47" stroke="#62B575" strokeWidth="2" strokeLinecap="round" fill="none" />}
          </>
        );
      case 'paprika':
        return (
          <>
            <path d="M32 19 L34 12" stroke={s ? silDark : '#407A4E'} strokeWidth="3" strokeLinecap="round" />
            <path d="M17 27 C16 20, 26 18, 32 21 C38 18, 48 20, 47 27 C48 39, 44 51, 37 51 C34 51, 33 49, 32 49 C31 49, 30 51, 27 51 C20 51, 16 39, 17 27 Z" fill={s ? sil : '#E9AE33'} />
            {!s && <path d="M25 25 C24 32, 24 41, 27 47" stroke="#F8D26E" strokeWidth="2.2" strokeLinecap="round" fill="none" />}
          </>
        );
      case 'daikon':
        return (
          <>
            <path d="M24 23 C24 19, 40 19, 40 23 L37 51 C36 55, 28 55, 27 51 Z" fill={s ? sil : '#EFECE2'} stroke={s ? 'none' : '#D5D0C1'} strokeWidth="1.5" />
            <path d="M29 21 C26 14, 21 12, 20 15 M32 20 C32 12, 32 9, 32 9 M35 21 C38 14, 43 12, 44 15" stroke={s ? silDark : '#488D56'} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </>
        );
      case 'napa_cabbage':
        return (
          <>
            <path d="M22 16 C16 24, 17 44, 24 52 L40 52 C47 44, 48 24, 42 16 C38 12, 26 12, 22 16 Z" fill={s ? sil : '#8FD17A'} />
            <path d="M25 23 C23 32, 24 45, 27 52 L37 52 C40 45, 41 32, 39 23 Z" fill={s ? silDark : '#EAF3DA'} />
            {!s && <path d="M32 22 L32 50 M27 32 L32 37 M37 32 L32 37" stroke="#C4DFB2" strokeWidth="1.8" strokeLinecap="round" />}
          </>
        );
      case 'green_onion':
        return (
          <>
            <path d="M18 52 L28 33 L32 36 L22 54 Z" fill={s ? sil : '#EFECE2'} />
            <path d="M28 33 L42 12 L46 14 L32 36 Z" fill={s ? silDark : '#4A9C62'} />
            <path d="M32 35 L48 20 L51 23 L34 38 Z" fill={s ? silDark : '#3B8152'} />
          </>
        );
      case 'bean_sprouts':
        return (
          <>
            <path d="M23 19 C23 29, 27 39, 22 51" stroke={s ? sil : '#EDE9D8'} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M34 16 C36 27, 31 38, 35 52" stroke={s ? sil : '#F4F1E4'} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M43 22 C40 31, 44 41, 42 51" stroke={s ? sil : '#EDE9D8'} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="17" rx="4" ry="3" fill={s ? silDark : '#E2C05C'} />
            <ellipse cx="34" cy="14" rx="4" ry="3" fill={s ? silDark : '#E2C05C'} />
            <ellipse cx="44" cy="20" rx="4" ry="3" fill={s ? silDark : '#E2C05C'} />
          </>
        );
      case 'asparagus':
        return (
          <>
            <path d="M24 52 L24 19 M32 52 L32 14 M40 52 L40 21" stroke={s ? sil : '#4B975C'} strokeWidth="4.2" strokeLinecap="round" />
            <path d="M21 20 L24 12 L27 20 Z M29 16 L32 8 L35 16 Z M37 22 L40 14 L43 22 Z" fill={s ? silDark : '#2D6A4F'} />
          </>
        );
      case 'lotus_root':
        return (
          <>
            <circle cx="32" cy="33" r="18" fill={s ? sil : '#E8D6BC'} />
            {!s && (
              <>
                <circle cx="32" cy="33" r="18" fill="none" stroke="#C5A982" strokeWidth="2" />
                <circle cx="32" cy="33" r="2.2" fill="#9E7E57" />
                <circle cx="32" cy="22" r="2.8" fill="#9E7E57" />
                <circle cx="32" cy="44" r="2.8" fill="#9E7E57" />
                <circle cx="21" cy="33" r="2.8" fill="#9E7E57" />
                <circle cx="43" cy="33" r="2.8" fill="#9E7E57" />
                <circle cx="24" cy="25" r="2.5" fill="#9E7E57" />
                <circle cx="40" cy="25" r="2.5" fill="#9E7E57" />
                <circle cx="24" cy="41" r="2.5" fill="#9E7E57" />
                <circle cx="40" cy="41" r="2.5" fill="#9E7E57" />
              </>
            )}
          </>
        );
      case 'burdock':
        return (
          <>
            <path d="M14 48 L43 16 L49 20 L20 52 Z" fill={s ? sil : '#8A6746'} />
            <path d="M22 49 L48 25 L52 29 L26 53 Z" fill={s ? silDark : '#A07C58'} />
            {!s && (
              <>
                <circle cx="46" cy="18" r="2.5" fill="#EDE2CF" />
                <circle cx="50" cy="27" r="2.2" fill="#EDE2CF" />
              </>
            )}
          </>
        );
      case 'snap_pea':
        return (
          <>
            <path d="M14 40 C20 24, 34 16, 49 16 C48 31, 38 45, 22 49 C17 50, 12 45, 14 40 Z" fill={s ? sil : '#58A85B'} />
            {!s && (
              <>
                <circle cx="24" cy="40" r="4.2" fill="#9BE08E" />
                <circle cx="33" cy="32" r="4.2" fill="#9BE08E" />
                <circle cx="41" cy="24" r="3.8" fill="#9BE08E" />
              </>
            )}
          </>
        );
      case 'edamame':
        return (
          <>
            <path d="M15 39 C17 29, 25 22, 34 21 C41 20, 48 15, 50 18 C52 24, 46 37, 36 44 C28 49, 13 48, 15 39 Z" fill={s ? sil : '#6BB961'} />
            {!s && (
              <>
                <circle cx="24" cy="39" r="5" fill="#4E9646" opacity="0.45" />
                <circle cx="35" cy="32" r="5" fill="#4E9646" opacity="0.45" />
                <circle cx="44" cy="23" r="4" fill="#4E9646" opacity="0.45" />
              </>
            )}
          </>
        );
      case 'corn':
        return (
          <>
            <ellipse cx="32" cy="31" rx="10" ry="18" fill={s ? sil : '#F4C542'} />
            {!s && (
              <>
                <path d="M25 22 L39 22 M23 29 L41 29 M24 36 L40 36 M32 14 L32 45" stroke="#D99B1E" strokeWidth="1.3" opacity="0.65" />
              </>
            )}
            <path d="M22 33 C17 39, 19 50, 29 52 C26 44, 24 38, 22 33 Z" fill={s ? silDark : '#5EA45B'} />
            <path d="M42 33 C47 39, 45 50, 35 52 C38 44, 40 38, 42 33 Z" fill={s ? silDark : '#488D56'} />
          </>
        );
      case 'okra':
        return (
          <>
            <path d="M30 14 L36 14 L38 49 C38 53, 28 53, 28 49 Z" fill={s ? sil : '#4B975C'} />
            <path d="M33 14 L33 9" stroke={s ? silDark : '#2D6A4F'} strokeWidth="3" strokeLinecap="round" />
            {!s && <path d="M33 16 L33 50" stroke="#76C287" strokeWidth="1.6" strokeLinecap="round" />}
          </>
        );
      case 'zucchini':
        return (
          <>
            <path d="M16 45 C22 32, 32 21, 45 14 C49 12, 53 17, 50 22 C43 34, 33 44, 21 51 C17 53, 14 49, 16 45 Z" fill={s ? sil : '#2A6345'} />
            {!s && <path d="M24 41 C30 33, 37 26, 44 21" stroke="#539670" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
            <path d="M46 15 L50 11" stroke={s ? silDark : '#6A8D56'} strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'garlic_chives':
        return (
          <>
            <path d="M22 52 L17 15 M29 52 L27 12 M36 52 L38 12 M42 52 L48 16" stroke={s ? sil : '#3B8152'} strokeWidth="3.6" strokeLinecap="round" />
            <rect x="20" y="47" width="24" height="5" rx="2.5" fill={s ? silDark : '#DFECD7'} />
          </>
        );
      case 'mizuna':
        return (
          <>
            <path d="M30 53 L22 17 M32 53 L32 12 M34 53 L42 17" stroke={s ? silDark : '#D8EBD0'} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M18 32 L14 24 L21 27 L20 17 L26 23 L27 14 L32 22 L36 14 L38 23 L44 17 L43 27 L50 24 L46 32 L32 39 Z" fill={s ? sil : '#40916C'} />
          </>
        );
      case 'pea_sprouts':
        return (
          <>
            <path d="M24 52 L24 26 M32 52 L32 20 M40 52 L40 27" stroke={s ? silDark : '#8ED081'} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="21" cy="24" r="4.5" fill={s ? sil : '#4BA35C'} />
            <circle cx="27" cy="25" r="4" fill={s ? sil : '#5BB86D'} />
            <circle cx="29" cy="18" r="4.8" fill={s ? sil : '#4BA35C'} />
            <circle cx="35" cy="19" r="4.5" fill={s ? sil : '#5BB86D'} />
            <circle cx="38" cy="25" r="4.2" fill={s ? sil : '#4BA35C'} />
            <circle cx="43" cy="26" r="4.2" fill={s ? sil : '#5BB86D'} />
          </>
        );
      case 'bok_choy':
        return (
          <>
            <path d="M22 36 C19 46, 23 53, 32 53 C41 53, 45 46, 42 36 C39 30, 25 30, 22 36 Z" fill={s ? sil : '#DCEFD0'} />
            <ellipse cx="22" cy="25" rx="7" ry="11" transform="rotate(-14 22 25)" fill={s ? silDark : '#3C8E53'} />
            <ellipse cx="42" cy="25" rx="7" ry="11" transform="rotate(14 42 25)" fill={s ? silDark : '#3C8E53'} />
            <ellipse cx="32" cy="22" rx="8" ry="12" fill={s ? sil : '#52A868'} />
            {!s && <path d="M32 34 L32 51" stroke="#B6DFB3" strokeWidth="2" strokeLinecap="round" />}
          </>
        );
      case 'garland_chrysanthemum':
        return (
          <>
            <path d="M32 53 L32 22 M32 42 L22 30 M32 36 L42 25" stroke={s ? silDark : '#488D56'} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M18 33 C14 28, 17 22, 23 24 C22 18, 28 15, 32 19 C36 15, 42 18, 41 24 C47 22, 50 28, 46 33 C42 37, 36 36, 32 41 C28 36, 22 37, 18 33 Z" fill={s ? sil : '#3B8152'} />
            {!s && <circle cx="32" cy="14" r="3.5" fill="#F2C84B" />}
          </>
        );
      case 'sunny_lettuce':
        return (
          <>
            <path d="M16 42 C12 31, 18 19, 26 17 C29 12, 36 12, 39 17 C47 19, 52 31, 48 42 C44 50, 20 50, 16 42 Z" fill={s ? silDark : '#7C3F58'} />
            <path d="M20 43 C17 34, 23 23, 32 22 C41 23, 47 34, 44 43 C40 49, 24 49, 20 43 Z" fill={s ? sil : '#7AC05A'} />
            {!s && <path d="M24 22 C28 19, 36 19, 40 22" stroke="#9B4D6E" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
          </>
        );
      case 'cauliflower':
        return (
          <>
            <path d="M16 36 C15 47, 25 53, 32 53 C39 53, 49 47, 48 36 L42 40 L32 44 L22 40 Z" fill={s ? silDark : '#5AA658'} />
            <circle cx="23" cy="30" r="8.5" fill={s ? sil : '#F5F1E3'} />
            <circle cx="41" cy="30" r="8.5" fill={s ? sil : '#F5F1E3'} />
            <circle cx="32" cy="22" r="9.5" fill={s ? sil : '#FAF7ED'} />
            <circle cx="32" cy="34" r="9" fill={s ? sil : '#F2EDE0'} />
            {!s && (
              <>
                <circle cx="27" cy="24" r="2.2" fill="#DFD8C5" />
                <circle cx="37" cy="26" r="2" fill="#DFD8C5" />
              </>
            )}
          </>
        );
      case 'celery':
        return (
          <>
            <path d="M22 53 L20 24 L27 24 L28 53 Z" fill={s ? sil : '#9ED27A'} />
            <path d="M36 53 L37 24 L44 24 L42 53 Z" fill={s ? sil : '#9ED27A'} />
            <path d="M28 53 L28 21 L36 21 L36 53 Z" fill={s ? silDark : '#B6E094'} />
            <circle cx="22" cy="18" r="5" fill={s ? silDark : '#4B975C'} />
            <circle cx="32" cy="15" r="5.5" fill={s ? silDark : '#3B8152'} />
            <circle cx="42" cy="18" r="5" fill={s ? silDark : '#4B975C'} />
          </>
        );
      case 'bitter_melon':
        return (
          <>
            <path d="M22 18 C22 12, 42 12, 42 18 L44 45 C44 52, 20 52, 20 45 Z" fill={s ? sil : '#3B8C4F'} />
            {!s && (
              <>
                <circle cx="26" cy="24" r="2.6" fill="#296B3A" />
                <circle cx="36" cy="23" r="2.6" fill="#296B3A" />
                <circle cx="31" cy="31" r="2.8" fill="#5CB06F" />
                <circle cx="25" cy="38" r="2.6" fill="#296B3A" />
                <circle cx="37" cy="39" r="2.6" fill="#296B3A" />
                <circle cx="32" cy="45" r="2.5" fill="#5CB06F" />
              </>
            )}
            <path d="M32 13 L32 8" stroke={s ? silDark : '#2D6A4F'} strokeWidth="2.8" strokeLinecap="round" />
          </>
        );
      case 'bamboo_shoot':
        return (
          <>
            <path d="M18 52 L32 12 L46 52 Z" fill={s ? sil : '#C89E66'} />
            {!s && (
              <>
                <path d="M23 40 L41 36" stroke="#9B7240" strokeWidth="2" />
                <path d="M26 30 L38 27" stroke="#9B7240" strokeWidth="2" />
                <path d="M21 52 L32 23 L43 52 Z" fill="#F2E4BA" opacity="0.65" />
              </>
            )}
          </>
        );
      case 'broad_bean':
        return (
          <>
            <path d="M14 40 C16 25, 29 17, 46 18 C51 19, 52 25, 48 31 C40 43, 28 49, 17 47 C13 46, 13 43, 14 40 Z" fill={s ? sil : '#6BB961'} />
            {!s && (
              <>
                <ellipse cx="24" cy="39" rx="5" ry="4" transform="rotate(-20 24 39)" fill="#A5E28C" />
                <ellipse cx="34" cy="32" rx="5" ry="4" transform="rotate(-20 34 32)" fill="#A5E28C" />
                <ellipse cx="43" cy="25" rx="4.5" ry="3.5" transform="rotate(-20 43 25)" fill="#A5E28C" />
              </>
            )}
          </>
        );
      case 'green_bean':
        return (
          <>
            <path d="M16 46 C22 33, 31 23, 44 13" stroke={s ? sil : '#4B975C'} strokeWidth="4.6" strokeLinecap="round" fill="none" />
            <path d="M23 50 C29 37, 38 27, 50 17" stroke={s ? silDark : '#3B8152'} strokeWidth="4.6" strokeLinecap="round" fill="none" />
            <path d="M14 37 C20 26, 29 17, 38 11" stroke={s ? sil : '#65B576'} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </>
        );
      case 'snow_pea':
        return (
          <>
            <path d="M14 42 C18 27, 31 17, 48 16 C49 28, 39 42, 22 48 C16 50, 12 47, 14 42 Z" fill={s ? sil : '#76C26D'} />
            {!s && <path d="M18 42 C25 35, 36 27, 44 20" stroke="#4D9448" strokeWidth="1.8" strokeLinecap="round" fill="none" />}
          </>
        );
      case 'green_peas':
        return (
          <>
            <path d="M14 39 C18 25, 32 17, 49 18 C47 32, 37 45, 20 47 C15 47, 12 43, 14 39 Z" fill={s ? silDark : '#4A9652'} />
            <circle cx="23" cy="39" r="4.5" fill={s ? sil : '#8FE077'} />
            <circle cx="32" cy="33" r="4.5" fill={s ? sil : '#8FE077'} />
            <circle cx="40" cy="26" r="4.2" fill={s ? sil : '#8FE077'} />
          </>
        );
      case 'shiso':
        return (
          <>
            <path d="M32 54 L32 42" stroke={s ? silDark : '#2D6A4F'} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M32 13 C42 18, 50 28, 46 39 C43 46, 36 47, 32 45 C28 47, 21 46, 18 39 C14 28, 22 18, 32 13 Z" fill={s ? sil : '#3E9155'} />
            {!s && <path d="M32 17 L32 44 M32 25 L24 31 M32 25 L40 31 M32 34 L24 39 M32 34 L40 39" stroke="#6AC481" strokeWidth="1.6" strokeLinecap="round" />}
          </>
        );
      case 'garlic':
        return (
          <>
            <path d="M32 12 C34 19, 48 25, 48 38 C48 47, 41 51, 32 51 C23 51, 16 47, 16 38 C16 25, 30 19, 32 12 Z" fill={s ? sil : '#F4EFE4'} stroke={s ? 'none' : '#D5CBB8'} strokeWidth="1.5" />
            {!s && (
              <>
                <path d="M32 16 C27 25, 25 38, 27 50" stroke="#D7CDB8" strokeWidth="1.5" fill="none" />
                <path d="M32 16 C37 25, 39 38, 37 50" stroke="#D7CDB8" strokeWidth="1.5" fill="none" />
              </>
            )}
          </>
        );
      case 'ginger':
        return (
          <>
            <path d="M15 39 C13 31, 21 26, 27 29 C28 21, 36 18, 41 24 C47 22, 52 29, 48 37 C45 45, 34 49, 24 47 C18 46, 16 43, 15 39 Z" fill={s ? sil : '#DFBC7E'} />
            {!s && (
              <>
                <path d="M23 36 L27 33 M34 32 L38 29 M30 41 L35 39" stroke="#B69155" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </>
        );
      case 'myoga':
        return (
          <>
            <path d="M32 13 C41 20, 46 31, 43 43 C41 49, 36 52, 32 52 C28 52, 23 49, 21 43 C18 31, 23 20, 32 13 Z" fill={s ? sil : '#D66B7A'} />
            {!s && (
              <>
                <path d="M23 44 C26 37, 29 29, 32 19 C35 29, 38 37, 41 44" stroke="#F4D3D7" strokeWidth="1.6" fill="none" />
                <ellipse cx="32" cy="48" rx="7" ry="4" fill="#EFE4C4" />
              </>
            )}
          </>
        );
      case 'mitsuba':
        return (
          <>
            <path d="M32 54 L32 31 M32 34 L21 25 M32 34 L43 25" stroke={s ? silDark : '#66AD68'} strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="32" cy="18" rx="6" ry="8" fill={s ? sil : '#449956'} />
            <ellipse cx="20" cy="25" rx="7" ry="5.5" transform="rotate(-25 20 25)" fill={s ? sil : '#52AD64'} />
            <ellipse cx="44" cy="25" rx="7" ry="5.5" transform="rotate(25 44 25)" fill={s ? sil : '#52AD64'} />
          </>
        );
      case 'parsley':
        return (
          <>
            <path d="M32 53 L32 32 M32 38 L22 28 M32 36 L42 27" stroke={s ? silDark : '#3B8152'} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="22" cy="27" r="6" fill={s ? sil : '#3C8E53'} />
            <circle cx="28" cy="20" r="6.5" fill={s ? sil : '#4BA35C'} />
            <circle cx="37" cy="20" r="6.5" fill={s ? sil : '#3C8E53'} />
            <circle cx="43" cy="27" r="6" fill={s ? sil : '#4BA35C'} />
            <circle cx="32" cy="28" r="6.5" fill={s ? sil : '#2D6A4F'} />
          </>
        );
      case 'rapeseed_blossom':
        return (
          <>
            <path d="M32 54 L32 23 M32 42 L22 33 M32 39 L42 30" stroke={s ? silDark : '#488D56'} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="22" cy="35" rx="6" ry="3.5" transform="rotate(-30 22 35)" fill={s ? sil : '#52A868'} />
            <ellipse cx="42" cy="33" rx="6" ry="3.5" transform="rotate(30 42 33)" fill={s ? sil : '#52A868'} />
            <circle cx="27" cy="21" r="4" fill={s ? sil : '#F4C944'} />
            <circle cx="37" cy="21" r="4" fill={s ? sil : '#F4C944'} />
            <circle cx="32" cy="15" r="4.5" fill={s ? sil : '#F9D85E'} />
            <circle cx="32" cy="24" r="3.8" fill={s ? sil : '#52A868'} />
          </>
        );
      case 'turnip':
      default:
        return (
          <>
            <ellipse cx="32" cy="40" rx="15" ry="13" fill={s ? sil : '#F4F1E8'} stroke={s ? 'none' : '#D5D0C1'} strokeWidth="1.5" />
            <path d="M32 27 C27 19, 21 15, 21 18 M32 27 C32 17, 32 12, 32 12 M32 27 C37 19, 43 15, 43 18" stroke={s ? silDark : '#488D56'} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderShape()}
    </svg>
  );
}
