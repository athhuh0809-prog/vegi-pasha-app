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
      case 'potato':
        return (
          <>
            <path d="M14 35 C12 24, 23 18, 35 19 C47 20, 53 28, 50 39 C47 48, 35 50, 24 47 C17 45, 15 41, 14 35 Z" fill={s ? sil : '#CFA670'} />
            {!s && (
              <>
                <circle cx="25" cy="30" r="1.5" fill="#9A7240" />
                <circle cx="38" cy="27" r="1.3" fill="#9A7240" />
                <circle cx="34" cy="39" r="1.6" fill="#9A7240" />
                <circle cx="43" cy="35" r="1.2" fill="#9A7240" />
              </>
            )}
          </>
        );
      case 'sweet_potato':
        return (
          <>
            <path d="M12 41 C15 29, 31 18, 48 16 C53 16, 54 22, 50 28 C44 39, 30 49, 16 49 C12 49, 11 45, 12 41 Z" fill={s ? sil : '#B5486A'} />
            {!s && (
              <>
                <path d="M23 36 L27 39" stroke="#8C2F4C" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M34 27 L38 30" stroke="#8C2F4C" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="44" cy="22" rx="4" ry="2.2" transform="rotate(-35 44 22)" fill="#F0D88C" />
              </>
            )}
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
      case 'avocado':
        return (
          <>
            <path d="M32 13 C39 13, 46 26, 46 37 C46 46, 40 52, 32 52 C24 52, 18 46, 18 37 C18 26, 25 13, 32 13 Z" fill={s ? silDark : '#3B5E3A'} />
            <path d="M32 16 C37 16, 43 27, 43 37 C43 44, 38 49, 32 49 C26 49, 21 44, 21 37 C21 27, 27 16, 32 16 Z" fill={s ? sil : '#B5D66F'} />
            <circle cx="32" cy="38" r="7.5" fill={s ? silDark : '#7C4B2B'} />
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
